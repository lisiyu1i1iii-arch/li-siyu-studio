"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { isRealClick } from "@/lib/pointer-guard";
import InteractiveObject from "./InteractiveObject";
import { Box, Cyl } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";
import { useStudioStore } from "../store/studio-store";

/**
 * 吊灯与串灯。
 *
 * - 两盏「藤绳编织半球形罩灯」，整体放大（比落地灯略小）；
 * - 点击任意一盏 → 切换白天 / 夜晚（不弹 Overlay、不聚焦）；
 * - 夜晚：灯罩内部整体柔和发光，**看不到裸露灯泡**（用隐藏的内层发光半球 + 点光源）；
 * - 白天：完全关闭。
 */
export default function HangingLights() {
  return (
    <group>
      {/* 吊灯 1：五层书架前、未被地毯覆盖的地面区域中心上方 */}
      <RattanPendant id="pendant1" position={[-3.4, 0, -2.5]} shadeY={2.62} ropeLength={1.55} />
      {/* 吊灯 2：狗狗上方、略微偏左 */}
      <RattanPendant id="pendant2" position={[3.0, 0, 0.7]} shadeY={2.48} ropeLength={2.35} />
      <StringLights />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 藤编纹理（交错编织感） */
function makeRattanTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 128;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#C9A063";
  ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = "rgba(120,86,44,0.55)";
  ctx.lineWidth = 4;
  for (let i = 0; i <= S; i += 12) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, S);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(S, i);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(240,214,160,0.35)";
  ctx.lineWidth = 2;
  for (let i = 6; i <= S; i += 12) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, S);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 2);
  return tex;
}

/* ------------------------------------------------------------------ */
/** 藤绳编织半球形罩灯（夜晚内部柔和发光，无可见灯泡） */
function RattanPendant({
  id,
  position,
  shadeY,
  ropeLength,
}: {
  id: "pendant1" | "pendant2";
  position: [number, number, number];
  shadeY: number;
  ropeLength: number;
}) {
  const texture = useMemo(() => makeRattanTexture(), []);
  const toggleDayNight = useStudioStore((s) => s.toggleDayNight);
  const dayNight = useStudioStore((s) => s.dayNight);
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);
  const shadeRef = useRef<THREE.MeshStandardMaterial>(null);
  const nightRef = useRef(0);

  useFrame((_, delta) => {
    const target = dayNight === "night" ? 1 : 0;
    nightRef.current = THREE.MathUtils.damp(nightRef.current, target, 2.2, delta);
    const n = nightRef.current;
    if (glowRef.current) glowRef.current.emissiveIntensity = n * 1.4;
    // 藤编灯罩本身透出柔和暖光（四周均匀发光，而非只有底部漏光）
    if (shadeRef.current) shadeRef.current.emissiveIntensity = n * 0.75;
  });

  const R = 0.3; // 放大后的灯罩半径

  return (
    <group position={position}>
      {/* 吊绳 + 顶部固定盘（装饰，不参与点击） */}
      <Cyl
        args={[0.007, 0.007, ropeLength, 6]}
        position={[0, shadeY + ropeLength / 2, 0]}
        color="#6b5a3f"
        roughness={0.85}
      />
      <Cyl
        args={[0.032, 0.032, 0.014, 12]}
        position={[0, shadeY + ropeLength, 0]}
        color="#6b5a3f"
        roughness={0.8}
      />

      {/* 灯罩本体：点击切换昼夜 */}
      <group position={[0, shadeY, 0]}>
        <InteractiveObject id={id} mode="action" onActivate={toggleDayNight}>
          {/* 藤编半球灯罩（开口朝下）：夜晚自身柔和发光，形成四周光晕 */}
          <mesh castShadow>
            <sphereGeometry args={[R, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              ref={shadeRef}
              map={texture ?? undefined}
              color={texture ? "#ffffff" : P.rattan}
              emissive="#ffcf95"
              emissiveIntensity={0}
              roughness={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* 内层发光半球：夜晚整体柔和发光，看不到灯泡本体 */}
          <mesh position={[0, -0.005, 0]}>
            <sphereGeometry args={[R * 0.9, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              ref={glowRef}
              color="#3a2f24"
              emissive="#ffcf95"
              emissiveIntensity={0}
              roughness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* 底部收口圈 */}
          <mesh>
            <torusGeometry args={[R, 0.013, 8, 30]} />
            <meshStandardMaterial color="#A9845A" roughness={0.85} />
          </mesh>
        </InteractiveObject>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 彩灯（串灯）：保持原高度 3.35 / 下垂风格 / z=-3.85。
 * 点击 → 切换白天 / 夜晚（与落地灯、吊灯、台灯共用同一 day/night state）。
 * 夜晚：只保留每颗小灯自身均匀、柔和的暖黄小光点（emissive），不做大范围照明；白天关闭。
 */
const STRING = { count: 15, x0: -4.3, x1: 0.9, baseY: 3.35, z: -3.85 };

function StringLights() {
  const toggleDayNight = useStudioStore((s) => s.toggleDayNight);
  const dayNight = useStudioStore((s) => s.dayNight);
  const nightRef = useRef(0);

  const points = useMemo(
    () =>
      Array.from({ length: STRING.count }, (_, i) => {
        const t = i / (STRING.count - 1);
        const x = STRING.x0 + (STRING.x1 - STRING.x0) * t;
        const y = STRING.baseY - 0.14 * (1 - Math.pow(2 * t - 1, 2));
        return [x, y, STRING.z] as [number, number, number];
      }),
    [],
  );

  // 共享几何 / 材质：15 颗灯泡只创建一次，逐帧只改一个材质
  const bulbGeo = useMemo(() => new THREE.SphereGeometry(0.026, 12, 10), []);
  const bulbMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#E8D9B8",
        emissive: "#FFD98A",
        emissiveIntensity: 0,
        roughness: 0.7,
      }),
    [],
  );

  useFrame((_, delta) => {
    const target = dayNight === "night" ? 1 : 0;
    nightRef.current = THREE.MathUtils.damp(nightRef.current, target, 2.2, delta);
    // 只保留每颗小灯自身均匀、柔和的小光点，不再做大范围照明
    bulbMat.emissiveIntensity = nightRef.current * 0.85;
  });

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (!isRealClick(e)) return;
        toggleDayNight();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {points.map((p, i) => (
        <group key={i} position={p}>
          <mesh geometry={bulbGeo} material={bulbMat} position={[0, -0.035, 0]} />
          <Cyl args={[0.008, 0.008, 0.03, 6]} position={[0, -0.012, 0]} color="#5c4a34" roughness={0.8} />
        </group>
      ))}
      {points.slice(0, -1).map((p, i) => {
        const q = points[i + 1];
        const dx = q[0] - p[0];
        const dy = q[1] - p[1];
        const len = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        return (
          <Box
            key={`w-${i}`}
            args={[len, 0.006, 0.006]}
            position={[(p[0] + q[0]) / 2, (p[1] + q[1]) / 2, STRING.z]}
            rotation={[0, 0, angle]}
            color="#5c4a34"
            roughness={0.85}
            castShadow={false}
          />
        );
      })}
    </group>
  );
}
