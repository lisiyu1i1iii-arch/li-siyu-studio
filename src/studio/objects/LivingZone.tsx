"use client";

import { useMemo, useRef, useState } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { isRealClick } from "@/lib/pointer-guard";

import InteractiveObject from "./InteractiveObject";
import { Box, Cyl, Sphere } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";
import { useStudioStore } from "../store/studio-store";

/**
 * CENTER — LIVING ZONE
 * 圆形编织地毯 + 圆形茶几 + Lazy 休闲椅 + 藤编扶手椅 + 落地灯。
 * 两把椅子围绕茶几，形成真正的 conversational living area。 */
const TABLE = { x: 0.05, z: 0.35 };
const RUG = { x: 0, z: 0.4 };

function faceTo(x: number, z: number, tx: number, tz: number) {
  return Math.atan2(tx - x, tz - z);
}

export default function LivingZone() {
  return (
    <group>
      <RoundRug />
      <RugCushions />
      <CoffeeTable />
      <LoungeChair />
      <RattanArmchair />
      <FloorLamp />
      <RobotVacuum />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 白色扫地机器人：点击 → 沿房间前后方向（z）来回 3 趟后回到原位。
 * 路径经过碰撞检查：位于地毯与左墙之间、书架前方，
 * 不经过地毯、沙发、圆桌、电脑桌，也不与狗跑步路径重叠。 */
const ROBOT = { x: -4.05, z: 0.4, amp: 1.3, trips: 3, duration: 7.2 };

function RobotVacuum() {
  const bodyRef = useRef<THREE.Group>(null);
  const runRef = useRef(-1);

  useFrame((_, delta) => {
    if (runRef.current < 0 || !bodyRef.current) return;
    runRef.current += delta;
    const t = runRef.current / ROBOT.duration;
    if (t >= 1) {
      bodyRef.current.position.z = 0;
      bodyRef.current.rotation.y = 0;
      runRef.current = -1;
      return;
    }
    const phase = t * Math.PI * 2 * ROBOT.trips;
    // 前后方向移动 + 轻微清扫转向，不偏离主路线
    bodyRef.current.position.z = Math.sin(phase) * ROBOT.amp;
    bodyRef.current.rotation.y = Math.sin(phase) * 0.12;
  });

  const start = () => {
    if (runRef.current >= 0) return;
    runRef.current = 0;
  };

  return (
    <group position={[ROBOT.x, 0, ROBOT.z]}>
      <InteractiveObject id="robot" mode="action" onActivate={start}>
        <group ref={bodyRef}>
          {/* 扁平圆形机身 */}
          <Cyl args={[0.18, 0.18, 0.06, 28]} position={[0, 0.035, 0]} color="#F4F2ED" roughness={0.5} />
          {/* 顶盖 */}
          <Cyl args={[0.15, 0.15, 0.022, 28]} position={[0, 0.074, 0]} color="#E7E3DA" roughness={0.45} />
          {/* 顶部控制圆盘 */}
          <Cyl args={[0.05, 0.05, 0.012, 20]} position={[0, 0.092, 0]} color="#C9C4B8" roughness={0.4} />
          {/* 前部传感器（朝向房间内侧 -z） */}
          <mesh position={[0, 0.05, -0.17]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
            <meshStandardMaterial color="#2E2E30" roughness={0.4} />
          </mesh>
          {/* 两侧细节 */}
          <Box args={[0.02, 0.012, 0.1]} position={[0.16, 0.05, 0]} color="#D8D3C8" roughness={0.5} />
          <Box args={[0.02, 0.012, 0.1]} position={[-0.16, 0.05, 0]} color="#D8D3C8" roughness={0.5} />
          {/* 底部边刷 */}
          <mesh position={[0.11, 0.012, -0.11]} rotation={[0, 0, 0.2]}>
            <cylinderGeometry args={[0.03, 0.03, 0.008, 12]} />
            <meshStandardMaterial color="#9AA0A6" roughness={0.6} />
          </mesh>
        </group>
      </InteractiveObject>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 放大的圆形编织地毯：直径 4.6，覆盖圆桌与两把沙发，形成完整中央休闲区。
 * 点击 → 颜色在米白 / 柔和植物绿之间平滑切换（尺寸、位置、纹理不变）。
 */
const RUG_WHITE = new THREE.Color(P.rug);
const RUG_GREEN = new THREE.Color("#8FA57E");

function RoundRug() {
  const rugMat = useRef<THREE.MeshStandardMaterial>(null);
  const [green, setGreen] = useState(false);
  const amount = useRef(0);

  useFrame((_, delta) => {
    amount.current = THREE.MathUtils.damp(amount.current, green ? 1 : 0, 3, delta);
    if (rugMat.current) {
      rugMat.current.color.lerpColors(RUG_WHITE, RUG_GREEN, amount.current);
    }
  });

  return (
    <group position={[RUG.x, 0.012, RUG.z]}>
      <mesh
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!isRealClick(e)) return;
          setGreen((v) => !v);
        }}
      >
        <cylinderGeometry args={[2.3, 2.3, 0.02, 72]} />
        <meshStandardMaterial ref={rugMat} color={P.rug} roughness={0.98} />
      </mesh>
      {[1.0, 1.6, 2.15].map((r) => (
        <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
          <torusGeometry args={[r, 0.01, 6, 72]} />
          <meshStandardMaterial color={P.rugRing} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 圆形厚坐垫（B 灰底白花 / C 黑白日式波浪 + 绗缝纽扣）。
 * 重新布局（避免被两侧沙发遮挡）：
 *   · grey → 波浪垫的右后方，略微缩小
 *   · wave → 位置保持不变
 */
const CUSHIONS: {
  x: number;
  z: number;
  kind: "grey" | "wave";
  scale?: number;
  y?: number;
}[] = [
  // 第三个（波浪）榻榻米的右后方，略缩小
  { x: 1.9, z: 1.05, kind: "grey", scale: 0.82 },
  // 主要榻榻米：位置不变
  { x: 1.2, z: 1.85, kind: "wave" },
];
// 注：原左侧地板榻榻米已移除，改为白色扫地机器人（见 RobotVacuum）
function RugCushions() {
  return (
    <group>
      {CUSHIONS.map((c) => (
        <Cushion key={c.kind} {...c} />
      ))}
    </group>
  );
}

function Cushion({
  x,
  z,
  kind,
  scale = 1,
  y = 0.1,
}: {
  x: number;
  z: number;
  kind: string;
  scale?: number;
  y?: number;
}) {
  const texture = useMemo(() => makeCushionTexture(kind), [kind]);
  return (
    // 榻榻米 / 坐垫：拦截点击，避免点击坐垫时触发下方地毯的颜色切换
    <group
      position={[x, y, z]}
      scale={scale}
      onClick={(e) => e.stopPropagation()}
      onPointerOver={(e) => e.stopPropagation()}
    >
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.36, 0.36, 0.16, 28]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? "#ffffff" : "#c9c9c4"}
          roughness={0.95}
        />
      </mesh>
      {/* 饱满的顶面 */}
      <mesh position={[0, 0.08, 0]} scale={[1, 0.32, 1]} castShadow>
        <sphereGeometry args={[0.36, 24, 16]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? "#ffffff" : "#c9c9c4"}
          roughness={0.95}
        />
      </mesh>
      {/* 日式波浪坐垫的绗缝纽扣 */}
      {kind === "wave" && (
        <Sphere radius={0.03} position={[0, 0.115, 0]} color="#2b2b2b" roughness={0.6} />
      )}
    </group>
  );
}

function makeCushionTexture(kind: string): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  if (kind === "fruit") {
    ctx.fillStyle = "#F3E2CE";
    ctx.fillRect(0, 0, S, S);
    const fruit = (x: number, y: number, r: number) => {
      ctx.fillStyle = "#E08A3C";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#C96A2B";
      ctx.beginPath();
      ctx.arc(x - r * 0.25, y - r * 0.2, r * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#6E9A5F";
      ctx.beginPath();
      ctx.ellipse(x + r * 0.5, y - r * 0.9, r * 0.55, r * 0.24, -0.6, 0, Math.PI * 2);
      ctx.fill();
    };
    fruit(64, 66, 26);
    fruit(192, 80, 24);
    fruit(110, 190, 28);
    fruit(212, 198, 22);
  } else if (kind === "grey") {
    ctx.fillStyle = "#9A9A94";
    ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    for (let gy = 0; gy < 4; gy++) {
      for (let gx = 0; gx < 4; gx++) {
        const x = 32 + gx * 64;
        const y = 32 + gy * 64;
        for (let k = 0; k < 5; k++) {
          const a = (k / 5) * Math.PI * 2;
          ctx.beginPath();
          ctx.ellipse(x + Math.cos(a) * 8, y + Math.sin(a) * 8, 7, 4, a, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  } else {
    // 自然花纹：米底 + 柔和花朵 / 叶片
    ctx.fillStyle = "#EDE6D8";
    ctx.fillRect(0, 0, S, S);
    const flower = (x: number, y: number, r: number, petal: string, center: string) => {
      ctx.fillStyle = petal;
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r, y + Math.sin(a) * r, r * 0.62, r * 0.4, a, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = center;
      ctx.beginPath();
      ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
      ctx.fill();
    };
    const leaf = (x: number, y: number, rot: number, s: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = "#8FB07E";
      ctx.beginPath();
      ctx.ellipse(0, 0, 12 * s, 5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    const spots: [number, number][] = [
      [48, 48], [176, 64], [112, 150], [208, 190], [56, 210], [160, 236],
    ];
    spots.forEach(([x, y], i) => {
      leaf(x + 20, y + 16, 0.8, 0.9);
      leaf(x - 22, y - 14, -0.7, 0.8);
      const petals = i % 2 === 0 ? ["#E7BFC6", "#E9C15A"] : ["#C9D8B8", "#E9C15A"];
      flower(x, y, 15, petals[0], petals[1]);
    });
    // 轻微绗缝
    ctx.strokeStyle = "rgba(140,125,105,0.25)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/**
 * 圆形茶几：直径 0.7、高 0.35、深木色。
 * 可交互：第一次点击聚焦，聚焦后水杯冒热气，第二次点击打开 Overlay。
 */
function CoffeeTable() {
  return (
    <group position={[TABLE.x, 0, TABLE.z]}>
      <InteractiveObject id="roundTable">
        <Cyl args={[0.35, 0.35, 0.04, 32]} position={[0, 0.33, 0]} color={P.woodDark} roughness={0.6} />
        <Cyl args={[0.05, 0.05, 0.3, 12]} position={[0, 0.16, 0]} color={P.woodDark} roughness={0.65} />
        <Cyl args={[0.22, 0.24, 0.03, 32]} position={[0, 0.015, 0]} color={P.woodDark} roughness={0.7} />

        {/* 桌面 props（轻微错位，不排齐） */}
        <Box args={[0.2, 0.03, 0.15]} position={[-0.1, 0.365, 0.04]} rotation={[0, 0.4, 0]} color={P.brick} roughness={0.75} />
        <Box args={[0.18, 0.028, 0.13]} position={[-0.08, 0.394, 0.05]} rotation={[0, -0.2, 0]} color={P.cream} roughness={0.85} />
        {/* 水杯（热气来源） */}
        <Cyl args={[0.04, 0.035, 0.08, 16]} position={[0.13, 0.39, -0.08]} color={P.cream} roughness={0.4} />
        {/* 苹果（纯桌面装饰，无独立交互）
         * Y = 桌面实际高度 0.35 + 苹果半高 0.05×0.92 = 0.396（底部正好落在桌面）；
         * 位置移到桌前部（远离水杯），与书、水杯互不遮挡。 */}
        <group position={[0.02, 0.396, 0.22]}>
          <mesh scale={[1, 0.92, 1]} castShadow>
            <sphereGeometry args={[0.05, 20, 16]} />
            <meshStandardMaterial color="#C0392B" roughness={0.45} />
          </mesh>
          {/* 果蒂 */}
          <mesh position={[0, 0.05, 0]} rotation={[0.12, 0, 0]}>
            <cylinderGeometry args={[0.006, 0.008, 0.028, 8]} />
            <meshStandardMaterial color="#5A3A1E" roughness={0.8} />
          </mesh>
          {/* 小叶 */}
          <mesh position={[0.016, 0.058, 0]} rotation={[0, 0, -0.5]} scale={[1.6, 0.35, 1]}>
            <sphereGeometry args={[0.016, 12, 10]} />
            <meshStandardMaterial color="#5F8A5A" roughness={0.85} />
          </mesh>
        </group>
      </InteractiveObject>

      {/* 聚焦后：水杯杯口的热气 */}
      <CupSteam />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 柔和热气纹理（白色径向渐变，边缘透明） */
function makeSteamTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 64;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,255,0.9)");
  g.addColorStop(0.45, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 水杯热气：少量半透明粒子从杯口向上升起、扩散、消散并循环。
 * 仅在圆桌处于聚焦状态时出现；退出聚焦 / 关闭 Overlay 后淡出隐藏。
 * 单一 useFrame，无逐帧对象创建。
 */
const STEAM_COUNT = 12;

function CupSteam() {
  const focused = useStudioStore((s) => s.focusedObject === "roundTable");

  const { geo, seeds } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(STEAM_COUNT * 3);
    const phase = new Float32Array(STEAM_COUNT);
    const radius = new Float32Array(STEAM_COUNT);
    const angle = new Float32Array(STEAM_COUNT);
    const speed = new Float32Array(STEAM_COUNT);
    for (let i = 0; i < STEAM_COUNT; i++) {
      phase[i] = Math.random();
      radius[i] = 0.012 + Math.random() * 0.018;
      angle[i] = Math.random() * Math.PI * 2;
      speed[i] = 0.16 + Math.random() * 0.14;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return { geo: g, seeds: { phase, radius, angle, speed } };
  }, []);

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        map: makeSteamTexture() ?? undefined,
        color: "#ffffff",
        size: 0.07,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const target = focused ? 0.5 : 0;
    mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 2.5, delta);
    if (mat.opacity < 0.01) return;
    const t = clock.elapsedTime;
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < STEAM_COUNT; i++) {
      const p = (seeds.phase[i] + t * seeds.speed[i]) % 1;
      const spread = p * 0.16;
      arr[i * 3] = Math.cos(seeds.angle[i]) * (seeds.radius[i] + spread);
      arr[i * 3 + 1] = p * 0.42;
      arr[i * 3 + 2] = Math.sin(seeds.angle[i]) * (seeds.radius[i] + spread);
    }
    geo.attributes.position.needsUpdate = true;
  });

  // 位于水杯杯口上方（杯子在桌面局部坐标 [0.13, 0.39, -0.08]）
  return (
    <points
      geometry={geo}
      material={mat}
      position={[0.13, 0.44, -0.08]}
      frustumCulled={false}
    />
  );
}

/* ------------------------------------------------------------------ */
/** Lazy 休闲椅：圆润厚坐垫、约 30° 后仰靠背、木脚，朝向茶几 */
function LoungeChair() {
  const x = -1.05;
  const z = 0.95;
  return (
    // 缩小到 80%，并向外打开约 34°
    <group
      position={[x, -0.064, z]}
      rotation={[0, faceTo(x, z, TABLE.x, TABLE.z) - 0.6, 0]}
      scale={0.8}
      onClick={(e) => e.stopPropagation()}
      onPointerOver={(e) => e.stopPropagation()}
    >
      <RoundedBox args={[0.9, 0.22, 0.85]} radius={0.09} smoothness={3} position={[0, 0.33, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#F2EDE4" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[0.8, 0.13, 0.74]} radius={0.06} smoothness={3} position={[0, 0.48, 0.02]} castShadow>
        <meshStandardMaterial color="#E5D5C0" roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.88, 0.62, 0.2]} radius={0.09} smoothness={3} position={[0, 0.58, -0.34]} rotation={[-0.5, 0, 0]} castShadow>
        <meshStandardMaterial color="#F2EDE4" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.3, 0.78]} radius={0.07} smoothness={3} position={[-0.38, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#F2EDE4" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[0.16, 0.3, 0.78]} radius={0.07} smoothness={3} position={[0.38, 0.45, 0]} castShadow>
        <meshStandardMaterial color="#F2EDE4" roughness={0.92} />
      </RoundedBox>
      <RoundedBox args={[0.36, 0.32, 0.12]} radius={0.04} smoothness={3} position={[0.05, 0.62, -0.2]} rotation={[-0.4, 0.2, 0.1]} castShadow>
        <meshStandardMaterial color="#E5D5C0" roughness={0.95} />
      </RoundedBox>
      {[
        [-0.34, -0.32],
        [-0.34, 0.32],
        [0.34, -0.32],
        [0.34, 0.32],
      ].map(([fx, fz], i) => (
        <Cyl key={i} args={[0.035, 0.03, 0.14, 10]} position={[fx, 0.15, fz]} color={P.woodDark} roughness={0.65} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 藤编扶手椅：藤编框架 + 米白坐垫 + 深绿/砖红靠枕，与休闲椅约 90° 相对 */
function RattanArmchair() {
  const x = 1.05;
  const z = 0.95;
  return (
    // 缩小到 78%，并向外打开约 34°
    <group
      position={[x, 0, z]}
      rotation={[0, faceTo(x, z, TABLE.x, TABLE.z) + 0.6, 0]}
      scale={0.78}
      onClick={(e) => e.stopPropagation()}
      onPointerOver={(e) => e.stopPropagation()}
    >
      {/* 右侧沙发：纯装饰，无交互（拦截点击，避免误触发下方地毯） */}
      {/* 座框 */}
      <RoundedBox args={[0.74, 0.12, 0.72]} radius={0.05} smoothness={3} position={[0, 0.4, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={P.rattan} roughness={0.78} />
      </RoundedBox>
      <RoundedBox args={[0.66, 0.1, 0.62]} radius={0.04} smoothness={3} position={[0, 0.5, 0.02]} castShadow>
        <meshStandardMaterial color="#F2EDE4" roughness={0.94} />
      </RoundedBox>
      {/* 靠背（藤编竖条 + 顶横档） */}
      <RoundedBox args={[0.74, 0.62, 0.1]} radius={0.04} smoothness={3} position={[0, 0.76, -0.3]} rotation={[-0.12, 0, 0]} castShadow>
        <meshStandardMaterial color={P.rattan} roughness={0.78} />
      </RoundedBox>
      {[-0.24, -0.08, 0.08, 0.24].map((bx) => (
        <Cyl key={bx} args={[0.014, 0.014, 0.58, 8]} position={[bx, 0.76, -0.24]} rotation={[-0.12, 0, 0]} color="#c99a4e" roughness={0.8} />
      ))}
      {/* 扶手 */}
      <RoundedBox args={[0.1, 0.1, 0.72]} radius={0.04} smoothness={2} position={[-0.37, 0.62, 0]} castShadow>
        <meshStandardMaterial color={P.rattan} roughness={0.78} />
      </RoundedBox>
      <RoundedBox args={[0.1, 0.1, 0.72]} radius={0.04} smoothness={2} position={[0.37, 0.62, 0]} castShadow>
        <meshStandardMaterial color={P.rattan} roughness={0.78} />
      </RoundedBox>
      {/* 靠枕 */}
      <RoundedBox args={[0.3, 0.28, 0.12]} radius={0.05} smoothness={3} position={[-0.14, 0.66, -0.2]} rotation={[-0.3, 0, 0.15]} castShadow>
        <meshStandardMaterial color={P.green} roughness={0.95} />
      </RoundedBox>
      <RoundedBox args={[0.28, 0.26, 0.12]} radius={0.05} smoothness={3} position={[0.16, 0.66, -0.22]} rotation={[-0.3, 0, -0.12]} castShadow>
        <meshStandardMaterial color={P.brick} roughness={0.95} />
      </RoundedBox>
      {/* 腿 */}
      {[
        [-0.31, -0.3],
        [-0.31, 0.3],
        [0.31, -0.3],
        [0.31, 0.3],
      ].map(([lx, lz], i) => (
        <Cyl key={i} args={[0.028, 0.024, 0.4, 10]} position={[lx, 0.2, lz]} color={P.rattan} roughness={0.8} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 落地灯：约 1.5m，暖光罩 + 黄铜杆 + 石质底座。
 * 点击 → 切换白天 / 夜晚（不弹 Overlay、不聚焦）；夜晚灯罩内灯泡亮起。
 */
function FloorLamp() {
  const toggleDayNight = useStudioStore((s) => s.toggleDayNight);
  const dayNight = useStudioStore((s) => s.dayNight);
  const bulbRef = useRef<THREE.MeshStandardMaterial>(null);
  const shadeRef = useRef<THREE.MeshStandardMaterial>(null);
  const nightRef = useRef(0);

  useFrame((_, delta) => {
    const target = dayNight === "night" ? 1 : 0;
    nightRef.current = THREE.MathUtils.damp(nightRef.current, target, 2.2, delta);
    const n = nightRef.current;
    if (bulbRef.current) bulbRef.current.emissiveIntensity = n * 1.8;
    // 灯罩本身柔和发光，避免“只有底部漏光”的硬边感
    if (shadeRef.current) shadeRef.current.emissiveIntensity = n * 0.55;
  });

  return (
    <group position={[-1.9, 0, 1.8]}>
      <Cyl args={[0.16, 0.18, 0.03, 20]} position={[0, 0.015, 0]} color={P.lampBase} roughness={0.6} metalness={0.2} />
      <Cyl args={[0.018, 0.018, 1.32, 10]} position={[0, 0.68, 0]} color={P.brass} roughness={0.35} metalness={0.7} />

      <group position={[0, 1.42, 0]}>
        <InteractiveObject id="floorLamp" mode="action" onActivate={toggleDayNight}>
          <mesh castShadow>
            <cylinderGeometry args={[0.2, 0.22, 0.28, 22, 1, true]} />
            <meshStandardMaterial
              ref={shadeRef}
              color="#F2EDE4"
              emissive="#ffd9a0"
              emissiveIntensity={0}
              roughness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* 灯泡：夜晚暖色发光 */}
          <mesh position={[0, -0.04, 0]}>
            <sphereGeometry args={[0.05, 16, 12]} />
            <meshStandardMaterial
              ref={bulbRef}
              color="#DED8CC"
              emissive="#ffd9a0"
              emissiveIntensity={0}
              roughness={0.6}
            />
          </mesh>
        </InteractiveObject>
      </group>
    </group>
  );
}


