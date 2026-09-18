"use client";

import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import InteractiveObject from "./InteractiveObject";
import { Box, Cyl, Sphere } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";
import { useStudioStore } from "../store/studio-store";
import type { StudioObjectId } from "../types";

/**
 * BACK WALL RIGHT · 工作区
 * 大型四角深棕长桌 + 显示器（视觉类设计）+ 现代简约办公转椅 + 现代可调手机支架（文字作品）。
 * Desk Monitor ≠ TV（TV 已删除）。
 */
export default function DeskStation() {
  return (
    // 整体位于学术海报正下方（Computer / Chair / Phone 一起）
    <group position={[2.9, 0, -3.5]}>
      <DeskShell />
      <Monitor />
      <Keyboard />
      <Mouse />
      <DeskLamp />
      <Mug />
      <DeskSteam />
      <Books />
      <PenPaper />
      <SmallPlant />
      <Chair />
      <Phone />
    </group>
  );
}

/* ------------------------------------------------------------------ */
function DeskShell() {
  return (
    <group>
      <RoundedBox args={[2.6, 0.12, 0.8]} radius={0.016} smoothness={3} position={[0, 0.69, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={P.deepBrown} roughness={0.68} metalness={0.03} />
      </RoundedBox>
      {[
        [-1.2, -0.33],
        [-1.2, 0.33],
        [1.2, -0.33],
        [1.2, 0.33],
      ].map(([x, z], i) => (
        <Box key={i} args={[0.1, 0.66, 0.1]} position={[x, 0.33, z]} color={P.deepBrown} roughness={0.7} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 显示器（视觉类设计）—— 保持合理比例，不再明显偏小 */
function Monitor() {
  const screenRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    const mat = screenRef.current.material as THREE.MeshStandardMaterial;
    // 降低屏幕整体亮度：像真实显示器而非发光广告牌（夜晚仍作为柔和光源）
    mat.emissiveIntensity = 0.5 + Math.sin(clock.elapsedTime * 1.6) * 0.05;
  });

  return (
    <InteractiveObject id="computer">
      <group position={[0, 0, -0.2]}>
        <RoundedBox args={[0.4, 0.026, 0.24]} radius={0.008} smoothness={3} position={[0, 0.763, 0]} castShadow>
          <meshStandardMaterial color="#8f97a3" roughness={0.32} metalness={0.7} />
        </RoundedBox>
        <Box args={[0.07, 0.38, 0.055]} position={[0, 0.95, 0]} color="#8f97a3" roughness={0.32} metalness={0.7} />
        <RoundedBox args={[1.42, 0.86, 0.05]} radius={0.018} smoothness={3} position={[0, 1.43, 0]} castShadow receiveShadow>
          <meshStandardMaterial color="#23262d" roughness={0.5} metalness={0.18} />
        </RoundedBox>
        <mesh ref={screenRef} position={[0, 1.43, 0.028]}>
          <planeGeometry args={[1.32, 0.76]} />
          <meshStandardMaterial color={P.screen} emissive={P.screen} emissiveIntensity={0.5} toneMapped={false} />
        </mesh>
        {/* 屏幕内容：左右两张易拉宝（真实资源，按原始比例，像屏幕 UI 而非外部海报） */}
        <ScreenRollups />
        <mesh position={[0, 1.08, 0.029]}>
          <planeGeometry args={[1.32, 0.04]} />
          <meshStandardMaterial color="#16202e" emissive="#16202e" emissiveIntensity={0.25} toneMapped={false} />
        </mesh>
      </group>
    </InteractiveObject>
  );
}

/* ------------------------------------------------------------------ */
/** 柔和卡片阴影贴图（轻微 blur + 自然边缘，非黑色硬边） */
function makeShadowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.clearRect(0, 0, S, S);
  ctx.filter = "blur(10px)";
  ctx.fillStyle = "rgba(10,15,25,0.55)";
  const x = 28;
  const y = 28;
  const w = S - 56;
  const h = S - 56;
  const r = 14;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** 显示器屏幕内的易拉宝展示：左右并列、整体缩小、带柔和卡片阴影 */
function ScreenRollups() {
  // 屏幕内使用缩略图（避免 3024×6803 原图占用过多显存）；Overlay 中仍用原图
  const textures = useLoader(THREE.TextureLoader, [
    "/assets/portfolio/rollup/thumbs/rollup-1.png",
    "/assets/portfolio/rollup/thumbs/rollup-2.png",
  ]);
  const shadowTex = useMemo(() => makeShadowTexture(), []);
  const aspects = [308 / 702, 3024 / 6803];

  useMemo(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
    });
  }, [textures]);

  const slotW = 0.4;
  const slotH = 0.5;

  return (
    <>
      {textures.map((tex, i) => {
        const aspect = aspects[i] || 1;
        let w = slotW;
        let h = w / aspect;
        if (h > slotH) {
          h = slotH;
          w = h * aspect;
        }
        const x = i === 0 ? -0.27 : 0.27;
        return (
          <group key={i}>
            {/* 柔和阴影：轻微 blur + 自然偏移，像贴在屏幕里的卡片（不溢出屏幕） */}
            <mesh position={[x + 0.012, 1.43 - 0.014, 0.03]}>
              <planeGeometry args={[w + 0.05, h + 0.05]} />
              <meshBasicMaterial
                map={shadowTex ?? undefined}
                transparent
                opacity={0.55}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[x, 1.43, 0.031]}>
              <planeGeometry args={[w, h]} />
              {/* 轻微降亮：像真实显示器而非发光广告牌（内容仍清晰） */}
              <meshBasicMaterial map={tex} color="#e0e0e0" toneMapped={false} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
function Keyboard() {
  return (
    <group position={[0, 0, 0.28]}>
      <RoundedBox args={[1.0, 0.028, 0.35]} radius={0.008} smoothness={2} position={[0, 0.766, 0]} castShadow>
        <meshStandardMaterial color="#3a3f4b" roughness={0.6} metalness={0.08} />
      </RoundedBox>
      <Box args={[0.86, 0.01, 0.25]} position={[0, 0.782, 0]} color="#4a5060" roughness={0.55} castShadow={false} />
    </group>
  );
}

function Mouse() {
  return (
    <group position={[0.5, 0, 0.3]}>
      <mesh position={[0, 0.784, 0]} scale={[0.045, 0.032, 0.07]} castShadow>
        <sphereGeometry args={[1, 16, 12]} />
        <meshStandardMaterial color="#3a3f4b" roughness={0.5} metalness={0.12} />
      </mesh>
    </group>
  );
}

/**
 * 现代简约工业风金属台灯：白色调、锥形灯罩（上窄下宽、内侧浅金）、
 * 弧形弯折金属管灯杆、圆形白色金属底座。
 * 白天关闭；夜晚灯罩内部柔和暖光（隐藏光源，无裸露灯泡）。
 */
function DeskLamp() {
  const dayNight = useStudioStore((s) => s.dayNight);
  const toggleDayNight = useStudioStore((s) => s.toggleDayNight);
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);
  const bulbRef = useRef<THREE.MeshStandardMaterial>(null);
  const nightRef = useRef(0);

  const stemGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.77, 0),
      new THREE.Vector3(0.0, 0.98, 0.0),
      new THREE.Vector3(-0.02, 1.16, 0.08),
      new THREE.Vector3(0.0, 1.24, 0.16),
    ]);
    return new THREE.TubeGeometry(curve, 24, 0.012, 8, false);
  }, []);

  useFrame((_, delta) => {
    const target = dayNight === "night" ? 1 : 0;
    nightRef.current = THREE.MathUtils.damp(nightRef.current, target, 2.2, delta);
    if (glowRef.current) glowRef.current.emissiveIntensity = nightRef.current * 1.6;
    if (bulbRef.current) bulbRef.current.emissiveIntensity = nightRef.current * 1.3;
  });

  return (
    <group position={[-1.15, 0, -0.05]}>
      {/* 圆形白色金属底座 */}
      <Cyl args={[0.075, 0.085, 0.022, 20]} position={[0, 0.761, 0]} color="#F2F2F0" roughness={0.35} metalness={0.55} />
      {/* 弧形弯折金属管灯杆 */}
      <mesh geometry={stemGeo} castShadow>
        <meshStandardMaterial color="#F2F2F0" roughness={0.35} metalness={0.55} />
      </mesh>
      {/* 锥形灯罩：开口向外（朝桌面 / 观察者）约 45°；点击切换昼夜 */}
      <group position={[0, 1.24, 0.16]} rotation={[-0.72, 0, 0]}>
        <InteractiveObject id="deskLamp" mode="action" onActivate={toggleDayNight}>
          <mesh castShadow>
            <coneGeometry args={[0.13, 0.16, 20, 1, true]} />
            <meshStandardMaterial color="#F4F4F2" roughness={0.4} metalness={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* 金属圆环：贴合灯罩开口最外缘（不缩进、不悬空） */}
          <mesh position={[0, -0.08, 0]}>
            <torusGeometry args={[0.13, 0.01, 10, 32]} />
            <meshStandardMaterial color="#C9A96A" roughness={0.35} metalness={0.7} />
          </mesh>
          {/* 内侧发光面（夜晚暖光） */}
          <mesh position={[0, -0.01, 0]}>
            <coneGeometry args={[0.118, 0.14, 18, 1, true]} />
            <meshStandardMaterial
              ref={glowRef}
              color="#3a2f24"
              emissive="#ffd9a0"
              emissiveIntensity={0}
              roughness={0.8}
              side={THREE.BackSide}
            />
          </mesh>
          {/* 灯泡 / 光源：藏在灯罩内部，从开口能隐约看到一点，不裸露 */}
          <mesh position={[0, 0.02, 0]}>
            <sphereGeometry args={[0.032, 16, 12]} />
            <meshStandardMaterial
              ref={bulbRef}
              color="#FFF3D6"
              emissive="#ffd9a0"
              emissiveIntensity={0}
              roughness={0.4}
            />
          </mesh>
        </InteractiveObject>
      </group>
    </group>
  );
}

function Mug() {
  return (
    <group position={[-0.62, 0, 0.3]}>
      <Cyl args={[0.058, 0.05, 0.13, 18]} position={[0, 0.815, 0]} color={P.cream} roughness={0.4} />
      <mesh position={[0.064, 0.82, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <torusGeometry args={[0.028, 0.006, 6, 12, Math.PI]} />
        <meshStandardMaterial color={P.cream} roughness={0.4} />
      </mesh>
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

/** 桌面水杯热气：基于统一 focus state（camera / computer / phone）判断 */
const DESK_STEAM_FOCUS: StudioObjectId[] = ["camera", "computer", "phone"];
const DESK_STEAM_COUNT = 12;

function DeskSteam() {
  const focusedObject = useStudioStore((s) => s.focusedObject);
  const active =
    focusedObject !== null && DESK_STEAM_FOCUS.includes(focusedObject);

  const { geo, seeds } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(DESK_STEAM_COUNT * 3);
    const phase = new Float32Array(DESK_STEAM_COUNT);
    const radius = new Float32Array(DESK_STEAM_COUNT);
    const angle = new Float32Array(DESK_STEAM_COUNT);
    const speed = new Float32Array(DESK_STEAM_COUNT);
    for (let i = 0; i < DESK_STEAM_COUNT; i++) {
      phase[i] = Math.random();
      radius[i] = 0.008 + Math.random() * 0.014;
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
        size: 0.05,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    [],
  );

  useFrame(({ clock }, delta) => {
    const target = active ? 0.45 : 0;
    mat.opacity = THREE.MathUtils.damp(mat.opacity, target, 2.5, delta);
    if (mat.opacity < 0.01) return;
    const t = clock.elapsedTime;
    const arr = geo.attributes.position.array as Float32Array;
    for (let i = 0; i < DESK_STEAM_COUNT; i++) {
      const p = (seeds.phase[i] + t * seeds.speed[i]) % 1;
      const spread = p * 0.1;
      // 向上缓慢飘散 + 轻微左右摆动
      const sway = Math.sin(t * 1.6 + seeds.phase[i] * 6.28) * 0.012;
      arr[i * 3] = Math.cos(seeds.angle[i]) * (seeds.radius[i] + spread) + sway;
      arr[i * 3 + 1] = p * 0.28;
      arr[i * 3 + 2] = Math.sin(seeds.angle[i]) * (seeds.radius[i] + spread);
    }
    geo.attributes.position.needsUpdate = true;
  });

  // 位于水杯杯口上方（Mug 在本地 [-0.62, 0, 0.3]，杯口约 y=0.88）
  return (
    <points
      geometry={geo}
      material={mat}
      position={[-0.62, 0.89, 0.3]}
      frustumCulled={false}
    />
  );
}

function Books() {
  return (
    <group position={[-0.85, 0, -0.28]}>
      <Box args={[0.3, 0.048, 0.21]} position={[0, 0.774, 0]} rotation={[0, 0.2, 0]} color={P.brick} roughness={0.8} />
      <Box args={[0.28, 0.04, 0.2]} position={[0.012, 0.82, 0.012]} rotation={[0, -0.15, 0]} color={P.cream} roughness={0.85} />
    </group>
  );
}

function PenPaper() {
  return (
    <group>
      {/* 桌面纸张：纯装饰，无交互（不聚焦、不打开 Overlay） */}
      <Box
        args={[0.3, 0.005, 0.38]}
        position={[1.12, 0.756, 0.28]}
        rotation={[0, 0.18, 0]}
        color={P.paper}
        roughness={0.9}
        castShadow={false}
      />
      <group position={[1.14, 0.763, 0.24]} rotation={[0, 0.5, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.16, 6]} />
          <meshStandardMaterial color={P.ember} roughness={0.45} />
        </mesh>
      </group>
    </group>
  );
}

function SmallPlant() {
  return (
    <group position={[-0.88, 0, 0.32]}>
      <Cyl args={[0.072, 0.06, 0.11, 16]} position={[0, 0.805, 0]} color={P.pot} roughness={0.85} />
      <Sphere radius={0.085} position={[0, 0.92, 0]} color={P.plant} roughness={0.9} />
      <Sphere radius={0.055} position={[0.038, 0.96, 0.012]} color={P.plantDark} roughness={0.9} />
      <Sphere radius={0.04} position={[-0.04, 0.95, -0.01]} color="#6b9a63" roughness={0.9} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 现代简约办公转椅：浅米色厚软包 + 黑色金属框架 + 五星脚滚轮 + 升降调节杆 */
const CHAIR_FABRIC = "#D8CDBA";
const CHAIR_FRAME = "#26262A";

const CHAIR_SPIN_DURATION = 2.2;

function Chair() {
  const chairRef = useRef<THREE.Group>(null);
  /** -1 = idle；>= 0 = 旋转已进行的时间（秒） */
  const spinRef = useRef(-1);

  useFrame((_, delta) => {
    if (spinRef.current < 0 || !chairRef.current) return;
    spinRef.current += delta;
    const progress = spinRef.current / CHAIR_SPIN_DURATION;
    if (progress >= 1) {
      chairRef.current.rotation.y = 0;
      spinRef.current = -1;
      return;
    }
    // 原地平滑旋转两整圈（720°）
    chairRef.current.rotation.y = progress * Math.PI * 4;
  });

  const startSpin = () => {
    if (spinRef.current >= 0) return;
    spinRef.current = 0;
  };

  return (
    // 向左移动并转向电脑桌（椅背朝外），避免遮挡手机支架与手机
    <group position={[-0.5, 0, 1.0]} rotation={[0, Math.PI, 0]} scale={1.2}>
      <InteractiveObject
        id="officeChair"
        mode="action"
        onActivate={startSpin}

      >
        <group ref={chairRef}>
      {/* 五星脚 + 滚轮 */}
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <group key={i} rotation={[0, a, 0]}>
            <Box args={[0.07, 0.032, 0.34]} position={[0, 0.05, 0.17]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
            <mesh position={[0, 0.032, 0.345]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.032, 12]} />
              <meshStandardMaterial color="#1E1E22" roughness={0.5} metalness={0.3} />
            </mesh>
          </group>
        );
      })}
      {/* 升降调节杆 */}
      <Cyl args={[0.032, 0.038, 0.32, 14]} position={[0, 0.2, 0]} color={CHAIR_FRAME} roughness={0.35} metalness={0.7} />
      <Box args={[0.06, 0.022, 0.13]} position={[0, 0.17, 0.08]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />

      {/* 厚实布艺坐垫 */}
      <RoundedBox args={[0.54, 0.14, 0.52]} radius={0.06} smoothness={3} position={[0, 0.45, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={CHAIR_FABRIC} roughness={0.95} />
      </RoundedBox>

      {/* 厚实弧形靠背 */}
      <RoundedBox args={[0.52, 0.64, 0.15]} radius={0.075} smoothness={3} position={[0, 0.84, -0.23]} rotation={[-0.16, 0, 0]} castShadow>
        <meshStandardMaterial color={CHAIR_FABRIC} roughness={0.95} />
      </RoundedBox>
      <Box args={[0.07, 0.42, 0.07]} position={[0, 0.62, -0.2]} rotation={[-0.16, 0, 0]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />

      {/* 一体成型扶手 */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Cyl args={[0.019, 0.019, 0.36, 10]} position={[s * 0.29, 0.64, -0.02]} rotation={[Math.PI / 2, 0, 0]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
          <Cyl args={[0.019, 0.019, 0.22, 10]} position={[s * 0.29, 0.54, 0.15]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
          <Cyl args={[0.019, 0.019, 0.22, 10]} position={[s * 0.29, 0.54, -0.19]} rotation={[-0.16, 0, 0]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
        </group>
      ))}
        </group>
      </InteractiveObject>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 现代可调节角度手机支架（文字作品）：黑色金属 + 银色旋钮 + 浅灰网格背板 */
function makeMeshTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 96;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#C4C4C0";
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = "rgba(90,90,90,0.5)";
  ctx.lineWidth = 2;
  for (let i = 0; i <= S; i += 12) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, S);
    ctx.moveTo(0, i);
    ctx.lineTo(S, i);
    ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 3);
  return tex;
}

/**
 * 手机屏幕内的「虚拟推文排版」贴图。
 * 微信页面无法嵌入 3D，这里用中性占位排版（标题 / 封面 / 正文行），
 * 不编造任何真实文章标题、正文或数据；真实链接保留在作品数据中。
 */
function makeWechatScreenTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 256;
  const H = 512;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 白色纸底
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // 顶部导航条
  ctx.fillStyle = "#ededed";
  ctx.fillRect(0, 0, W, 34);
  ctx.fillStyle = "#333333";
  ctx.font = "bold 15px Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("微信公众号作品", W / 2, 18);
  // 返回箭头
  ctx.strokeStyle = "#333333";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(18, 12);
  ctx.lineTo(11, 18);
  ctx.lineTo(18, 24);
  ctx.stroke();

  // 封面 / 配图区域
  ctx.fillStyle = "#dbe6ef";
  ctx.fillRect(16, 50, W - 32, 130);
  ctx.fillStyle = "#b9cddd";
  ctx.beginPath();
  ctx.arc(W / 2, 108, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(W / 2 - 46, 158);
  ctx.lineTo(W / 2 - 10, 118);
  ctx.lineTo(W / 2 + 16, 146);
  ctx.lineTo(W / 2 + 40, 126);
  ctx.lineTo(W / 2 + 58, 158);
  ctx.closePath();
  ctx.fill();

  // 标题（中性占位）
  ctx.fillStyle = "#222222";
  ctx.font = "bold 16px Helvetica, Arial, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("推文作品", 16, 208);
  ctx.fillStyle = "#999999";
  ctx.font = "11px Helvetica, Arial, sans-serif";
  ctx.fillText("WECHAT ARTICLE", 16, 226);

  // 正文排版（灰色行）
  const lines = [0.72, 0.92, 0.6, 0.85, 0.7, 0.9, 0.5];
  let y = 250;
  lines.forEach((f) => {
    ctx.fillStyle = "#d2d2d2";
    ctx.fillRect(16, y, (W - 32) * f, 8);
    y += 20;
  });

  // 底部留白 + 链接提示
  ctx.fillStyle = "#f2f2f2";
  ctx.fillRect(0, H - 34, W, 34);
  ctx.fillStyle = "#8a8a8a";
  ctx.font = "10px Helvetica, Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("点击打开原文", W / 2, H - 16);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function Phone() {
  const screenRef = useRef<THREE.Mesh>(null);
  const meshTex = useMemo(() => makeMeshTexture(), []);
  const wechatTex = useMemo(() => makeWechatScreenTexture(), []);
  useFrame(({ clock }) => {
    if (!screenRef.current) return;
    const mat = screenRef.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.75 + Math.sin(clock.elapsedTime * 2.1 + 1) * 0.06;
  });

  return (
    <InteractiveObject id="phone">
      {/* 手机支架（背板约 90° 竖直）+ 手机继续放大，屏幕朝向房间 / Camera
       * 整体向右平移 0.25m（与电脑拉开距离）；scale / rotation 不变。
       * 底座右缘仍完整落在桌面上，与桌右缘保留约 0.16m 安全距离。 */}
      <group position={[1.0, 0.75, -0.05]} rotation={[0, -0.25, 0]} scale={1.85}>
        {/* 扁平黑色圆形底座（不宽于手机太多） */}
        <Cyl args={[0.065, 0.075, 0.014, 24]} position={[0, 0.007, 0]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
        {/* 下臂 */}
        <Cyl args={[0.014, 0.016, 0.2, 12]} position={[0, 0.11, 0.015]} rotation={[0.28, 0, 0]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
        {/* 关节 + 银色旋钮 */}
        <Sphere radius={0.026} position={[0, 0.21, 0.045]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
        <mesh position={[0, 0.21, 0.072]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.022, 12]} />
          <meshStandardMaterial color="#C9C9C9" roughness={0.25} metalness={0.85} />
        </mesh>
        {/* 上臂 */}
        <Cyl args={[0.012, 0.014, 0.18, 12]} position={[0, 0.3, 0.05]} rotation={[0.12, 0, 0]} color={CHAIR_FRAME} roughness={0.4} metalness={0.6} />
        {/* 浅灰网格背板（约 90° 竖直）：尺寸与手机匹配，不左右露出 */}
        <mesh position={[0, 0.4, 0.06]} rotation={[0.06, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 0.19, 0.012]} />
          <meshStandardMaterial map={meshTex ?? undefined} color={meshTex ? "#ffffff" : "#C4C4C0"} roughness={0.8} />
        </mesh>
        {/* 手机（竖直放在背板上） */}
        <group position={[0, 0.39, 0.075]} rotation={[0.06, 0, 0]}>
          <RoundedBox args={[0.105, 0.2, 0.012]} radius={0.008} smoothness={2} castShadow>
            <meshStandardMaterial color="#2b2f3a" roughness={0.4} metalness={0.2} />
          </RoundedBox>
          {/* 屏幕：竖屏 90° 姿态，内容裁切在屏幕内（不溢出边框） */}
          <mesh ref={screenRef} position={[0, 0, 0.0075]}>
            <planeGeometry args={[0.092, 0.182]} />
            <meshStandardMaterial
              map={wechatTex ?? undefined}
              color={wechatTex ? "#ffffff" : "#bfe4ff"}
              emissive="#ffffff"
              emissiveMap={wechatTex ?? undefined}
              emissiveIntensity={wechatTex ? 0.75 : 0.9}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </InteractiveObject>
  );
}
