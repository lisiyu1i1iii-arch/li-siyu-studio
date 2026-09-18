"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { playCatMeow, playDogBark } from "@/lib/sound";
import { useFloorDrag, type CircleObstacle } from "./useFloorDrag";

/**
 * 场景生活化角色：
 * · AbyssinianCat — 默认蜷缩睡在左侧沙发；点击 → 猫叫 → 坐起 → 打哈欠 → 保持 → 回到睡姿。
 *   可拖拽到房间内其他安全地面位置，拖拽后仍保留呼吸 idle 与点击互动。
 * · Corgi — 默认点击沿巨大地毯外围逆时针跑一整圈；被拖走后点击改为「以当前位置为中心
 *   的局部巡回」并回到当前位置（绝不瞬移回地毯）。
 *
 * 通用规则：「点击是互动，拖拽是改变位置」——拖拽结束绝不误触发点击 / 叫声 / 跑步。
 */

function makeFurTexture(base: string, dark: string, light: string): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);
  for (let i = 0; i < 1600; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? dark : light;
    ctx.globalAlpha = 0.18 + Math.random() * 0.32;
    ctx.fillRect(Math.random() * S, Math.random() * S, 1.4, 1.4);
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

const lerp = THREE.MathUtils.lerp;

/* ================================================================== */
/* 房间地面边界与家具障碍（用于拖拽约束 + 狗的局部巡回路线）           */

const FLOOR = { minX: -4.5, maxX: 4.5, minZ: -3.5, maxZ: 3.5 };

const STATIC_OBSTACLES: CircleObstacle[] = [
  { x: 0.05, z: 0.35, r: 0.5 }, // 圆茶几
  { x: -1.05, z: 0.95, r: 0.55 }, // 左侧休闲椅
  { x: 1.05, z: 0.95, r: 0.55 }, // 右侧藤椅
  { x: -1.9, z: 1.8, r: 0.35 }, // 落地灯
  { x: -4.05, z: 0.4, r: 0.3 }, // 扫地机器人
  { x: -0.95, z: 1.05, r: 0.25 }, // 小多肉
  { x: 4.45, z: 3.15, r: 0.5 }, // Monstera
  // 右墙两张窗下长凳（沿 z 近似为多个圆）
  { x: 4.55, z: -2.8, r: 0.4 },
  { x: 4.55, z: -2.2, r: 0.4 },
  { x: 4.55, z: -1.6, r: 0.4 },
  { x: 4.55, z: 0.0, r: 0.4 },
  { x: 4.55, z: 0.6, r: 0.4 },
  { x: 4.55, z: 1.2, r: 0.4 },
];

/** 两只宠物的实时世界坐标（模块级共享，供彼此避让） */
const petWorld = {
  cat: { x: -1.03, z: 0.95 },
  dog: { x: 3.6, z: 0.6 },
};

const catObstacles = (): CircleObstacle[] => [
  ...STATIC_OBSTACLES,
  { x: petWorld.dog.x, z: petWorld.dog.z, r: 0.5 },
];
const dogObstacles = (): CircleObstacle[] => [
  ...STATIC_OBSTACLES,
  { x: petWorld.cat.x, z: petWorld.cat.z, r: 0.5 },
];

/* ================================================================== */
/**
 * 阿比西尼亚猫 · 睡在沙发上（完全落在坐垫上）。
 * 点击（真实点击）触发：喵一声 → 坐起 → 打哈欠 → 保持坐姿 → 回到蜷缩睡姿。
 * 拖拽：沿地面移动到房间内其他安全位置，松手后停留在新位置并继续呼吸 idle。
 * 不做 Camera Director 聚焦，也不打开 Overlay。
 */
type CatState = "sleep" | "sit" | "yawn" | "hold" | "return";

export function AbyssinianCat({
  position,
  rotationY,
  scale = 1,
}: {
  position: [number, number, number];
  rotationY: number;
  /** 整体缩放（围绕 group 原点 = 腹部底面，不影响贴地高度） */
  scale?: number;
}) {
  const fur = useMemo(() => makeFurTexture("#B58455", "#8E6238", "#D8B98F"), []);
  const tail = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.18, 0.1, -0.1),
      new THREE.Vector3(-0.22, 0.06, 0.08),
      new THREE.Vector3(-0.12, 0.05, 0.2),
      new THREE.Vector3(0.06, 0.05, 0.22),
    ];
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, 0.02, 8, false);
  }, []);

  const groupRef = useRef<THREE.Group>(null);
  const rootRef = useRef<THREE.Group>(null);
  const breatheRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Mesh>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const tailRef = useRef<THREE.Group>(null);
  const frontLegRefs = useRef<(THREE.Mesh | null)[]>([]);
  const hindLegRefs = useRef<(THREE.Mesh | null)[]>([]);
  const hoveredRef = useRef(false);

  const stateRef = useRef<CatState>("sleep");
  const stateStart = useRef(0);
  const poseRef = useRef(0); // 0 = 睡姿, 1 = 坐姿
  const yawnRef = useRef(0); // 0 → 1 → 0

  /** 权威位置：拖拽后落到地面 y = 0，否则保持初始（沙发坐垫）高度 */
  const posRef = useRef(new THREE.Vector3(position[0], position[1], position[2]));

  useLayoutEffect(() => {
    const g = groupRef.current;
    if (g) g.position.copy(posRef.current);
  }, []);

  const now = () => performance.now() / 1000;

  const startInteraction = () => {
    if (stateRef.current !== "sleep") return;
    playCatMeow();
    stateRef.current = "sit";
    stateStart.current = now();
  };

  const { dragging, handlers } = useFloorDrag({
    floorY: 0,
    minX: FLOOR.minX,
    maxX: FLOOR.maxX,
    minZ: FLOOR.minZ,
    maxZ: FLOOR.maxZ,
    obstacles: catObstacles,
    onDragStart: () => {
      posRef.current.y = 0;
      document.body.style.cursor = "grabbing";
    },
    onDragMove: (x, z) => {
      posRef.current.set(x, 0, z);
    },
    onDragEnd: (x, z) => {
      if (Number.isFinite(x) && Number.isFinite(z)) posRef.current.set(x, 0, z);
      document.body.style.cursor = "auto";
    },
    onClick: () => {
      startInteraction();
    },
    onHoverChange: (h) => {
      hoveredRef.current = h;
      document.body.style.cursor = h ? "pointer" : "auto";
    },
  });

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const st = stateRef.current;
    const elapsed = now() - stateStart.current;

    let poseTarget = 0;
    let yawnTarget = 0;

    if (st === "sit") {
      poseTarget = 1;
      if (elapsed > 0.7) {
        stateRef.current = "yawn";
        stateStart.current = now();
      }
    } else if (st === "yawn") {
      poseTarget = 1;
      const y = Math.min(elapsed / 1.4, 1);
      yawnTarget = Math.sin(y * Math.PI);
      if (elapsed > 1.4) {
        stateRef.current = "hold";
        stateStart.current = now();
      }
    } else if (st === "hold") {
      poseTarget = 1;
      if (elapsed > 1.5) {
        stateRef.current = "return";
        stateStart.current = now();
      }
    } else if (st === "return") {
      poseTarget = 0;
      if (elapsed > 0.9) {
        stateRef.current = "sleep";
      }
    }

    const p = THREE.MathUtils.damp(poseRef.current, poseTarget, 6, delta);
    poseRef.current = p;
    yawnRef.current = THREE.MathUtils.damp(yawnRef.current, yawnTarget, 10, delta);
    const yv = yawnRef.current;

    // 位置：平滑跟随权威位置（拖拽时更跟手）
    const g = groupRef.current;
    if (g) {
      const lambda = dragging ? 30 : 8;
      g.position.x = THREE.MathUtils.damp(g.position.x, posRef.current.x, lambda, delta);
      g.position.y = THREE.MathUtils.damp(g.position.y, posRef.current.y, lambda, delta);
      g.position.z = THREE.MathUtils.damp(g.position.z, posRef.current.z, lambda, delta);
      petWorld.cat.x = g.position.x;
      petWorld.cat.z = g.position.z;
    }

    // 呼吸 idle：坐起时减弱，但始终保留
    if (breatheRef.current) {
      breatheRef.current.scale.y = 1 + Math.sin(t * 1.5) * 0.022 * (1 - p * 0.5);
    }

    if (torsoRef.current) {
      torsoRef.current.position.set(0, lerp(0.13, 0.2, p), 0);
      torsoRef.current.scale.set(
        lerp(0.2, 0.15, p),
        lerp(0.13, 0.19, p),
        lerp(0.22, 0.16, p),
      );
    }

    if (headRef.current) {
      headRef.current.position.set(lerp(0.12, 0, p), lerp(0.14, 0.4, p), lerp(0.14, 0.08, p));
      headRef.current.rotation.set(-yv * 0.42, lerp(-0.5, 0, p), lerp(0.15, 0, p));
    }

    if (mouthRef.current) {
      // 打哈欠：下颌向下张开（mouth 向下移动 + 纵向放大），
      // 嘴顶始终保持在鼻子下方，避免从鼻子/口鼻中间穿出。
      mouthRef.current.position.y = -0.05 - yv * 0.02;
      mouthRef.current.scale.set(
        0.028 + yv * 0.006,
        0.008 + yv * 0.028,
        0.018 + yv * 0.006,
      );
    }

    frontLegRefs.current.forEach((leg, i) => {
      if (!leg) return;
      const s = i === 0 ? -1 : 1;
      leg.position.set(lerp(s * 0.05, s * 0.06, p), lerp(0.06, 0.1, p), lerp(0.12, 0.1, p));
      leg.scale.set(0.032, lerp(0.03, 0.1, p), lerp(0.07, 0.032, p));
    });

    hindLegRefs.current.forEach((leg, i) => {
      if (!leg) return;
      const s = i === 0 ? -1 : 1;
      leg.position.set(lerp(s * 0.16, s * 0.09, p), lerp(0.07, 0.09, p), lerp(-0.05, -0.07, p));
      leg.scale.set(lerp(0.06, 0.07, p), lerp(0.05, 0.09, p), lerp(0.1, 0.09, p));
    });

    if (tailRef.current) {
      tailRef.current.rotation.y = lerp(0, -2.2, p);
    }

    if (rootRef.current) {
      // rootRef 的基础缩放为 1.2，hover 时在此之上再放大 3%
      const target = (hoveredRef.current && st === "sleep" && !dragging ? 1.03 : 1) * 1.2;
      const s = THREE.MathUtils.lerp(rootRef.current.scale.x, target, 0.15);
      rootRef.current.scale.setScalar(s);
    }
  });

  const bodyMat = (
    <meshStandardMaterial map={fur ?? undefined} color={fur ? "#ffffff" : "#B58455"} roughness={0.9} />
  );
  const lightMat = <meshStandardMaterial color="#D8B98F" roughness={0.92} />;

  return (
    <group ref={groupRef} rotation={[0, rotationY, 0]} scale={scale} {...handlers}>
      <group ref={rootRef} scale={1.2}>
        <group ref={breatheRef}>
          {/* 身体（蜷缩 ↔ 坐起） */}
          <mesh ref={torsoRef} position={[0, 0.13, 0]} scale={[0.2, 0.13, 0.22]} castShadow>
            <sphereGeometry args={[1, 24, 18]} />
            {bodyMat}
          </mesh>

          {/* 后腿 / 后臀 */}
          {[-1, 1].map((s, i) => (
            <mesh
              key={`hind-${s}`}
              ref={(el) => {
                hindLegRefs.current[i] = el;
              }}
              position={[s * 0.16, 0.07, -0.05]}
              scale={[0.06, 0.05, 0.1]}
              castShadow
            >
              <sphereGeometry args={[1, 16, 12]} />
              {bodyMat}
            </mesh>
          ))}

          {/* 前腿 / 前爪 */}
          {[-1, 1].map((s, i) => (
            <mesh
              key={`front-${s}`}
              ref={(el) => {
                frontLegRefs.current[i] = el;
              }}
              position={[s * 0.05, 0.06, 0.12]}
              scale={[0.032, 0.03, 0.07]}
              castShadow
            >
              <sphereGeometry args={[1, 14, 12]} />
              {lightMat}
            </mesh>
          ))}

          {/* 头部（睡姿轻贴身体 / 坐姿抬起） */}
          <group ref={headRef} position={[0.12, 0.14, 0.14]} rotation={[0, -0.5, 0.15]}>
            <mesh scale={[0.115, 0.105, 0.12]} castShadow>
              <sphereGeometry args={[1, 22, 18]} />
              {bodyMat}
            </mesh>
            <mesh position={[0, -0.02, 0.1]} scale={[0.045, 0.038, 0.05]}>
              <sphereGeometry args={[1, 16, 12]} />
              {lightMat}
            </mesh>
            {/* 闭眼（细弧） */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.045, 0.03, 0.1]} rotation={[0, 0, s * 0.3]}>
                <boxGeometry args={[0.03, 0.006, 0.006]} />
                <meshStandardMaterial color="#3A2F27" roughness={0.5} />
              </mesh>
            ))}
            {/* 鼻子 */}
            <mesh position={[0, -0.015, 0.145]}>
              <sphereGeometry args={[0.01, 10, 10]} />
              <meshStandardMaterial color="#7A4A3E" roughness={0.5} />
            </mesh>
            {/* 嘴（打哈欠时下颌向下张开；位于鼻子正下方，不穿过鼻子） */}
            <mesh ref={mouthRef} position={[0, -0.05, 0.145]} scale={[0.028, 0.008, 0.018]}>
              <sphereGeometry args={[1, 12, 10]} />
              <meshStandardMaterial color="#5A3330" roughness={0.7} />
            </mesh>
            {/* 大而竖立的耳朵 */}
            {[-1, 1].map((s) => (
              <mesh key={s} position={[s * 0.055, 0.1, -0.02]} rotation={[0, 0, s * 0.3]} castShadow>
                <coneGeometry args={[0.045, 0.1, 14]} />
                {bodyMat}
              </mesh>
            ))}
          </group>

          {/* 蜷曲的尾巴 + 黑尾尖（坐起时绕到身前） */}
          <group ref={tailRef}>
            <mesh geometry={tail} castShadow>
              {bodyMat}
            </mesh>
            <mesh position={[0.06, 0.05, 0.22]}>
              <sphereGeometry args={[0.023, 12, 12]} />
              <meshStandardMaterial color="#2E2A28" roughness={0.85} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

/* ================================================================== */
/**
 * 柯基跑步路径：围绕巨大地毯外围的椭圆（默认位置专用）。
 * 起点角度由狗的实际初始位置反推，保证从原位置无缝出发并回到原位。
 */
const RUN = { cx: 0.2, cz: 0.5, rx: 3.4, rz: 2.45, duration: 7 };
const RUN_THETA0 = Math.atan2((0.6 - RUN.cz) / RUN.rz, (3.6 - RUN.cx) / RUN.rx);

/** 柯基四条腿的对角步态相位（0 = 左前 & 右后，π = 右前 & 左后） */
const LEG_PHASE = [0, Math.PI, Math.PI, 0];

/* 局部巡回路线 */
type Route =
  | {
      kind: "ellipse";
      cx: number;
      cz: number;
      rx: number;
      rz: number;
      theta0: number;
      duration: number;
      hx: number;
      hz: number;
    }
  | {
      kind: "circle";
      cx: number;
      cz: number;
      r: number;
      theta0: number;
      duration: number;
      hx: number;
      hz: number;
    }
  | {
      kind: "line";
      ax: number;
      az: number;
      bx: number;
      bz: number;
      duration: number;
      hx: number;
      hz: number;
    };

/**
 * 以当前位置 P 为中心生成一条安全的小型巡回路线：
 *   1. 优先「小型圆弧」：圆心沿「房间中心方向」偏移 r，使 P 落在圆周上；
 *   2. r 从大到小尝试，直到整圈都留在房间内且避开所有障碍；
 *   3. 若空间不足（贴墙 / 贴家具），退化为折返路线。
 * 路线始终从 P 出发、回到 P，且不改变 Y 高度。
 */
function buildLocalRoute(px: number, pz: number, obstacles: CircleObstacle[]): Route {
  const cxRoom = 0;
  const czRoom = 0.4;
  let dx = cxRoom - px;
  let dz = czRoom - pz;
  const dl = Math.hypot(dx, dz) || 1;
  dx /= dl;
  dz /= dl;

  const MAX_R = 1.5;
  const MIN_R = 0.55;
  for (let r = MAX_R; r >= MIN_R - 1e-6; r -= 0.1) {
    const cx = px + dx * r;
    const cz = pz + dz * r;
    if (
      cx - r < FLOOR.minX ||
      cx + r > FLOOR.maxX ||
      cz - r < FLOOR.minZ ||
      cz + r > FLOOR.maxZ
    ) {
      continue;
    }
    let ok = true;
    for (const o of obstacles) {
      if (Math.hypot(cx - o.x, cz - o.z) < r + o.r + 0.15) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    const theta0 = Math.atan2(pz - cz, px - cx);
    const duration = Math.min(Math.max((2 * Math.PI * r) / 2.6, 2.6), 6.5);
    return { kind: "circle", cx, cz, r, theta0, duration, hx: px, hz: pz };
  }

  // 折返：选一条最长的无遮挡方向
  const dirs = 16;
  let best = { len: 0, ux: 1, uz: 0 };
  for (let i = 0; i < dirs; i++) {
    const a = (i / dirs) * Math.PI * 2;
    const ux = Math.cos(a);
    const uz = Math.sin(a);
    let len = 2.0;
    const bxLimit = ux > 1e-6 ? (FLOOR.maxX - px) / ux : ux < -1e-6 ? (FLOOR.minX - px) / ux : Infinity;
    const bzLimit = uz > 1e-6 ? (FLOOR.maxZ - pz) / uz : uz < -1e-6 ? (FLOOR.minZ - pz) / uz : Infinity;
    len = Math.min(len, bxLimit, bzLimit);
    for (const o of obstacles) {
      const ox = o.x - px;
      const oz = o.z - pz;
      const proj = ox * ux + oz * uz;
      if (proj <= 0) continue;
      const perp2 = ox * ox + oz * oz - proj * proj;
      const rr = (o.r + 0.25) * (o.r + 0.25);
      if (perp2 < rr) {
        const t = proj - Math.sqrt(rr - perp2);
        if (t > 0) len = Math.min(len, t);
      }
    }
    len = Math.max(len, 0);
    if (len > best.len) best = { len, ux, uz };
  }
  const L = Math.max(best.len, 0.6);
  const bx = px + best.ux * L;
  const bz = pz + best.uz * L;
  const duration = Math.min(Math.max((2 * L) / 2.6, 2.0), 5.0);
  return { kind: "line", ax: px, az: pz, bx, bz, duration, hx: px, hz: pz };
}

function dampAngle(current: number, target: number, lambda: number, delta: number) {
  let diff = (target - current) % (Math.PI * 2);
  if (diff > Math.PI) diff -= Math.PI * 2;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * (1 - Math.exp(-lambda * delta));
}

/** 彭布罗克威尔士柯基 · 可点击跑动 / 可拖拽 */
export function Corgi({
  position,
  rotationY,
}: {
  position: [number, number, number];
  rotationY: number;
}) {
  const fur = useMemo(() => makeFurTexture("#D9A441", "#C08A2E", "#EAC97A"), []);
  const groupRef = useRef<THREE.Group>(null);
  const bobRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const legRefs = useRef<(THREE.Group | null)[]>([]);
  const footRefs = useRef<(THREE.Mesh | null)[]>([]);
  const startRef = useRef(0);
  const routeRef = useRef<Route | null>(null);
  const runningRef = useRef(false);
  const movedRef = useRef(false);
  const [running, setRunning] = useState(false);
  const [hovered, setHovered] = useState(false);

  const posRef = useRef(new THREE.Vector3(position[0], position[1], position[2]));
  const headingRef = useRef(rotationY);
  const headingTargetRef = useRef(rotationY);

  useLayoutEffect(() => {
    const g = groupRef.current;
    if (g) {
      g.position.copy(posRef.current);
      g.rotation.y = rotationY;
    }
    petWorld.dog.x = position[0];
    petWorld.dog.z = position[2];
  }, [position, rotationY]);

  const now = () => performance.now() / 1000;

  const resetLegs = () => {
    legRefs.current.forEach((l) => {
      if (l) l.rotation.x = 0;
    });
    footRefs.current.forEach((f) => {
      if (f) f.position.set(0, -0.22, 0.01);
    });
    if (bobRef.current) {
      bobRef.current.position.y = 0;
      bobRef.current.rotation.x = 0;
    }
    if (tailRef.current) tailRef.current.rotation.z = 0;
    if (headRef.current) headRef.current.rotation.x = 0;
  };

  const startRun = () => {
    if (runningRef.current) return;
    playDogBark();

    let route: Route;
    if (movedRef.current) {
      route = buildLocalRoute(posRef.current.x, posRef.current.z, dogObstacles());
    } else {
      route = {
        kind: "ellipse",
        cx: RUN.cx,
        cz: RUN.cz,
        rx: RUN.rx,
        rz: RUN.rz,
        theta0: RUN_THETA0,
        duration: RUN.duration,
        hx: posRef.current.x,
        hz: posRef.current.z,
      };
    }
    routeRef.current = route;
    startRef.current = now();
    runningRef.current = true;
    setRunning(true);
  };

  const { dragging, handlers } = useFloorDrag({
    floorY: 0,
    minX: FLOOR.minX,
    maxX: FLOOR.maxX,
    minZ: FLOOR.minZ,
    maxZ: FLOOR.maxZ,
    obstacles: dogObstacles,
    enabled: !running,
    onDragStart: () => {
      movedRef.current = true;
      document.body.style.cursor = "grabbing";
    },
    onDragMove: (x, z) => {
      const dx = x - posRef.current.x;
      const dz = z - posRef.current.z;
      if (Math.hypot(dx, dz) > 1e-3) headingTargetRef.current = Math.atan2(dx, dz);
      posRef.current.set(x, 0, z);
    },
    onDragEnd: (x, z) => {
      if (Number.isFinite(x) && Number.isFinite(z)) {
        movedRef.current = true;
        posRef.current.set(x, 0, z);
      }
      document.body.style.cursor = "auto";
    },
    onClick: () => {
      if (runningRef.current) return;
      startRun();
    },
    onHoverChange: (h) => {
      if (runningRef.current) return;
      setHovered(h);
      document.body.style.cursor = h ? "pointer" : "auto";
    },
  });

  useFrame(({ clock }, delta) => {
    const g = groupRef.current;
    if (!g) return;

    if (!running) {
      if (bobRef.current) bobRef.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.006;
      const lambda = dragging ? 30 : 10;
      g.position.x = THREE.MathUtils.damp(g.position.x, posRef.current.x, lambda, delta);
      g.position.y = THREE.MathUtils.damp(g.position.y, posRef.current.y, lambda, delta);
      g.position.z = THREE.MathUtils.damp(g.position.z, posRef.current.z, lambda, delta);
      g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, hovered ? 1.05 : 1, 0.15));
      g.rotation.y = dampAngle(g.rotation.y, headingTargetRef.current, 10, delta);
      headingRef.current = g.rotation.y;
      petWorld.dog.x = g.position.x;
      petWorld.dog.z = g.position.z;
      return;
    }

    const route = routeRef.current;
    const t = now() - startRef.current;
    if (!route || t >= route.duration) {
      runningRef.current = false;
      setRunning(false);
      if (route) posRef.current.set(route.hx, 0, route.hz);
      g.position.copy(posRef.current);
      headingTargetRef.current = headingRef.current;
      g.scale.setScalar(1);
      resetLegs();
      return;
    }

    const progress = t / route.duration;
    let vx = 0;
    let vz = 0;

    if (route.kind === "ellipse") {
      const th = route.theta0 + progress * Math.PI * 2;
      g.position.set(
        route.cx + route.rx * Math.cos(th),
        0,
        route.cz + route.rz * Math.sin(th),
      );
      vx = -route.rx * Math.sin(th);
      vz = route.rz * Math.cos(th);
    } else if (route.kind === "circle") {
      const th = route.theta0 + progress * Math.PI * 2;
      g.position.set(
        route.cx + route.r * Math.cos(th),
        0,
        route.cz + route.r * Math.sin(th),
      );
      vx = -Math.sin(th);
      vz = Math.cos(th);
    } else {
      const s = 1 - Math.abs(2 * progress - 1);
      g.position.set(
        route.ax + (route.bx - route.ax) * s,
        0,
        route.az + (route.bz - route.az) * s,
      );
      const dir = progress < 0.5 ? 1 : -1;
      vx = (route.bx - route.ax) * dir;
      vz = (route.bz - route.az) * dir;
    }

    posRef.current.set(g.position.x, 0, g.position.z);
    headingTargetRef.current = Math.atan2(vx, vz);
    g.rotation.y = dampAngle(g.rotation.y, headingTargetRef.current, 12, delta);
    headingRef.current = g.rotation.y;
    g.scale.setScalar(1);
    petWorld.dog.x = g.position.x;
    petWorld.dog.z = g.position.z;

    // 步频：约每 0.45s 一个完整步态周期
    const phase = t * 14;

    // 四条腿明显交替前后摆动 + 脚掌抬起
    legRefs.current.forEach((l, i) => {
      if (!l) return;
      const sw = Math.sin(phase + LEG_PHASE[i]);
      l.rotation.x = sw * 0.95;
      const foot = footRefs.current[i];
      if (foot) {
        const lift = Math.max(0, Math.cos(phase + LEG_PHASE[i]));
        foot.position.set(0, -0.22 + lift * 0.065, 0.01 + sw * 0.02);
      }
    });

    // 身体随步态上下起伏 + 轻微前倾
    if (bobRef.current) {
      bobRef.current.position.y = 0.012 + Math.abs(Math.sin(phase)) * 0.05;
      bobRef.current.rotation.x = 0.06 + Math.sin(phase * 2) * 0.045;
    }
    // 头部自然点头 / 尾巴摆动
    if (headRef.current) headRef.current.rotation.x = -0.05 + Math.sin(phase * 2 + 0.6) * 0.09;
    if (tailRef.current) tailRef.current.rotation.z = Math.sin(phase) * 0.28;
  });

  const yellowMat = (
    <meshStandardMaterial map={fur ?? undefined} color={fur ? "#ffffff" : "#D9A441"} roughness={0.95} />
  );
  const whiteMat = <meshStandardMaterial color="#F2EDE4" roughness={0.95} />;

  return (
    <group ref={groupRef} {...handlers}>
      <group ref={bobRef} scale={1.2}>
        {/* 后臀 / 长身（黄色背部）：整体抬高，露出四腿，避免“趴地”感 */}
        <mesh position={[0, 0.19, -0.09]} scale={[0.15, 0.13, 0.18]} castShadow>
          <sphereGeometry args={[1, 22, 18]} />
          {yellowMat}
        </mesh>
        <mesh position={[0, 0.28, -0.02]} scale={[0.13, 0.16, 0.15]} castShadow>
          <sphereGeometry args={[1, 22, 18]} />
          {yellowMat}
        </mesh>
        {/* 白色围脖 / 胸口 */}
        <mesh position={[0, 0.25, 0.1]} scale={[0.1, 0.13, 0.1]} castShadow>
          <sphereGeometry args={[1, 18, 14]} />
          {whiteMat}
        </mesh>

        {/* 头部（可轻微上下） */}
        <group ref={headRef} position={[0, 0.36, 0.06]}>
          <mesh position={[0, 0.04, -0.01]} scale={[0.095, 0.09, 0.115]} castShadow>
            <sphereGeometry args={[1, 22, 18]} />
            {yellowMat}
          </mesh>
          <mesh position={[0, 0.015, 0.08]} scale={[0.055, 0.045, 0.075]}>
            <sphereGeometry args={[1, 16, 12]} />
            {whiteMat}
          </mesh>
          {/* 张开的嘴 + 舌头 */}
          <mesh position={[0, -0.008, 0.125]} scale={[0.035, 0.025, 0.035]}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color="#3A2A28" roughness={0.6} />
          </mesh>
          <mesh position={[0, -0.015, 0.145]} rotation={[0.3, 0, 0]} scale={[0.026, 0.011, 0.04]}>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color="#E58A8A" roughness={0.7} />
          </mesh>
          <mesh position={[0, 0.03, 0.152]}>
            <sphereGeometry args={[0.015, 12, 12]} />
            <meshStandardMaterial color="#2E2A28" roughness={0.5} />
          </mesh>
          {/* 明亮眼睛 */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.042, 0.065, 0.08]}>
              <mesh>
                <sphereGeometry args={[0.015, 14, 12]} />
                <meshStandardMaterial color="#5A3E22" roughness={0.25} />
              </mesh>
              <mesh position={[0, 0, 0.012]}>
                <sphereGeometry args={[0.008, 10, 10]} />
                <meshStandardMaterial color="#1E1A18" roughness={0.3} />
              </mesh>
            </group>
          ))}
          {/* 竖立大耳 */}
          {[-1, 1].map((s) => (
            <group key={s} position={[s * 0.06, 0.14, -0.04]} rotation={[0, 0, s * 0.2]}>
              <mesh castShadow>
                <coneGeometry args={[0.055, 0.13, 16]} />
                {yellowMat}
              </mesh>
              <mesh position={[0, 0.005, 0.025]}>
                <coneGeometry args={[0.033, 0.085, 12]} />
                <meshStandardMaterial color="#E8B8B8" roughness={0.9} />
              </mesh>
            </group>
          ))}
        </group>

        {/* 四条可摆动的腿（对角步态 + 脚掌抬起） */}
        {[
          [-0.065, 0.12],
          [0.065, 0.12],
          [-0.07, -0.06],
          [0.07, -0.06],
        ].map(([x, z], i) => (
          <group
            key={i}
            ref={(el) => {
              legRefs.current[i] = el;
            }}
            position={[x, 0.23, z]}
          >
            <mesh position={[0, -0.12, 0]} castShadow>
              <capsuleGeometry args={[0.033, 0.11, 6, 14]} />
              {whiteMat}
            </mesh>
            <mesh
              ref={(el) => {
                footRefs.current[i] = el;
              }}
              position={[0, -0.22, 0.01]}
              scale={[0.037, 0.028, 0.045]}
              castShadow
            >
              <sphereGeometry args={[1, 14, 12]} />
              {whiteMat}
            </mesh>
          </group>
        ))}

        {/* 短尾（可轻微摆动） */}
        <group ref={tailRef} position={[0, 0.25, -0.25]} rotation={[-0.6, 0, 0]}>
          <mesh castShadow>
            <capsuleGeometry args={[0.04, 0.07, 6, 14]} />
            {whiteMat}
          </mesh>
        </group>
      </group>
    </group>
  );
}
