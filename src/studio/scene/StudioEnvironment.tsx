"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import InteractiveObject from "../objects/InteractiveObject";
import { STUDIO_PALETTE as P } from "../data/studio-content";
import PlankFloor from "./PlankFloor";
import { ForestBackdrop } from "./WindowBackdrop";

/**
 * 空间尺寸：10 × 8（不变）。
 * 后墙 Deep Green、左右墙 Warm White、Baseboard 米白、地板木色。
 * 右墙为**三扇圆拱窗**（PHASE 2.8）。
 */
const W = 10;
const D = 8;
const H = 3.8;
const HW = W / 2;
const HD = D / 2;

const RIDGE_Y = 6.2;
const RISE = RIDGE_Y - H;
const SLOPE_BASE = Math.hypot(HD, RISE);
const SLOPE_ANGLE = Math.atan2(RISE, HD);
const OVERHANG_SLOPE = 0.6;
const SLOPE_LEN = SLOPE_BASE + OVERHANG_SLOPE;
const SLAB_X = W + 0.8;
const UZ = HD / SLOPE_BASE;
const UY = RISE / SLOPE_BASE;
const EAVE_Y = H - OVERHANG_SLOPE * UY;
const EAVE_Z = HD + OVERHANG_SLOPE * UZ;
const ROOF_CY = (RIDGE_Y + EAVE_Y) / 2;
const ROOF_CZ = EAVE_Z / 2;
const RAFTER_X = [-4.6, -2.76, -0.92, 0.92, 2.76, 4.6];

/**
 * 三扇拱窗（世界 z 中心 / 宽 / 底 / 直墙顶）。
 * 前两扇在右墙，第三扇在仙人掌后方；统一设计。
 */
const WINDOWS = [
  { id: "window-01" as const, z: -2.2, w: 1.6, y0: 0.7, yTop: 2.7 },
  { id: "window-02" as const, z: 0.6, w: 1.6, y0: 0.7, yTop: 2.7 },
  { id: "window-03" as const, z: 3.0, w: 1.6, y0: 0.7, yTop: 2.7 },
];

/** 短而圆润的弓形拱（约占整窗 20%）：可开启窗扇明显更高 */
const ARCH_RISE = 0.5;
function archGeometry(w: number) {
  const r = w / 2;
  const R = (r * r + ARCH_RISE * ARCH_RISE) / (2 * ARCH_RISE);
  const a = Math.atan2(R - ARCH_RISE, r);
  return { r, R, a };
}

export default function StudioEnvironment() {
  return (
    <group>
      {/* 连续平整的木质基底（顶面 y = 0），同时作为长条地板均匀细缝的底色 */}
      <mesh position={[0, -0.15, 0]} receiveShadow>
        <boxGeometry args={[W + 0.8, 0.3, D + 0.8]} />
        <meshStandardMaterial color="#7d4f33" roughness={0.9} />
      </mesh>

      {/* 长条实木 running-bond 表面：近乎共面的单 InstancedMesh，平整无碎片 */}
      <PlankFloor />

      {/* 后墙 / 左墙 */}
      <mesh position={[0, H / 2, -HD]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color={P.green} roughness={0.96} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[-HW, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color={P.wallWarm} roughness={0.96} side={THREE.DoubleSide} />
      </mesh>

      {/* 右墙：两扇圆拱窗 */}
      <RightWall />

      {/* Baseboard */}
      <mesh position={[0, 0.05, -HD + 0.02]}>
        <boxGeometry args={[W, 0.1, 0.04]} />
        <meshStandardMaterial color={P.baseboard} roughness={0.85} />
      </mesh>
      <mesh position={[-HW + 0.02, 0.05, 0]}>
        <boxGeometry args={[0.04, 0.1, D]} />
        <meshStandardMaterial color={P.baseboard} roughness={0.85} />
      </mesh>

      {/* 墙顶收边 */}
      <mesh position={[0, H - 0.09, -HD + 0.08]} castShadow>
        <boxGeometry args={[W, 0.18, 0.16]} />
        <meshStandardMaterial color={P.beam} roughness={0.9} />
      </mesh>
      <mesh position={[-HW + 0.08, H - 0.09, 0]} castShadow>
        <boxGeometry args={[0.16, 0.18, D]} />
        <meshStandardMaterial color={P.beam} roughness={0.9} />
      </mesh>
      <mesh position={[HW - 0.08, H - 0.09, 0]} castShadow>
        <boxGeometry args={[0.16, 0.18, D]} />
        <meshStandardMaterial color={P.beam} roughness={0.9} />
      </mesh>

      <Roof />
    </group>
  );
}

/* ------------------------------------------------------------------ */
function Roof() {
  return (
    <group>
      {[1, -1].map((dir) => (
        <group key={dir}>
          <mesh position={[0, ROOF_CY, dir * ROOF_CZ]} rotation={[dir * SLOPE_ANGLE, 0, 0]} receiveShadow>
            <boxGeometry args={[SLAB_X, 0.16, SLOPE_LEN]} />
            {/* 屋顶板面 = 侧墙同款白色；横梁 / 椽条保持原木色 */}
            <meshStandardMaterial color={P.wallWarm} roughness={0.9} />
          </mesh>
          {RAFTER_X.map((x) => (
            <mesh key={x} position={[x, ROOF_CY - 0.1, dir * (ROOF_CZ - 0.07)]} rotation={[dir * SLOPE_ANGLE, 0, 0]} receiveShadow>
              {/* 更细、更浅的椽条：保留屋顶结构但不抢视觉 */}
              <boxGeometry args={[0.085, 0.085, SLOPE_LEN * 0.92]} />
              <meshStandardMaterial color={P.woodLight} roughness={0.9} />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, RIDGE_Y + 0.06, 0]}>
        <boxGeometry args={[SLAB_X, 0.22, 0.32]} />
        <meshStandardMaterial color={P.beam} roughness={0.9} />
      </mesh>

      {/* 开放式木屋架：多根横向木梁沿房间长度方向形成结构节奏 */}
      {[-3.6, -2.4, -1.2, 1.2, 2.4, 3.6].map((z) => (
        <mesh key={z} position={[0, RIDGE_Y - (RISE / HD) * Math.abs(z) - 0.26, z]} castShadow>
          <boxGeometry args={[W - 0.3, 0.18, 0.14]} />
          <meshStandardMaterial color="#8a5a3a" roughness={0.85} />
        </mesh>
      ))}

      <GableEnd side={1} />
      <GableEnd side={-1} />
    </group>
  );
}

function GableEnd({ side }: { side: 1 | -1 }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-HD, 0);
    s.lineTo(HD, 0);
    s.lineTo(0, RISE);
    s.closePath();
    return s;
  }, []);

  return (
    <mesh position={[side * HW, H, 0]} rotation={[0, (side * Math.PI) / 2, 0]} receiveShadow>
      <extrudeGeometry args={[shape, { depth: 0.18, bevelEnabled: false }]} />
      <meshStandardMaterial color={P.wallWarm} roughness={0.96} side={THREE.DoubleSide} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/** 右墙：带拱形洞口的墙面 + 木框 + 玻璃 + 木质分格 + 窗外森林 */
function RightWall() {
  const camera = useThree((s) => s.camera);
  const backdropRef = useRef<THREE.Group>(null);
  useFrame(() => {
    if (backdropRef.current) {
      backdropRef.current.visible = camera.position.x < HW;
    }
  });

  const wallShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-HD, 0);
    s.lineTo(HD, 0);
    s.lineTo(HD, H);
    s.lineTo(-HD, H);
    s.closePath();
    WINDOWS.forEach(({ z, w, y0, yTop }) => {
      const { r, R, a } = archGeometry(w);
      const cy = yTop + ARCH_RISE - R;
      const p = new THREE.Path();
      p.moveTo(z - r, y0);
      p.lineTo(z - r, yTop);
      p.absarc(z, cy, R, Math.PI - a, a, true);
      p.lineTo(z + r, y0);
      p.closePath();
      s.holes.push(p);
    });
    return s;
  }, []);

  const glassShape = useMemo(() => {
    const { w, yTop, y0 } = WINDOWS[0];
    const { r, R, a } = archGeometry(w);
    const h = yTop - y0;


  const cy = h + ARCH_RISE - R; // 拱心（本地坐标）
    const s = new THREE.Shape();
    s.moveTo(-r, 0);
    s.lineTo(-r, h);
    s.absarc(0, cy, R, Math.PI - a, a, true);
    s.lineTo(r, 0);
    s.closePath();
    return s;
  }, []);

  return (
    <group>
      {/* 带洞口的墙面 */}
      <mesh position={[HW, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <shapeGeometry args={[wallShape]} />
        <meshStandardMaterial color={P.wallWarm} roughness={0.96} side={THREE.DoubleSide} />
      </mesh>

      {/* 窗外平面森林（白天 / 夜晚），只在室内可见 */}
      <group ref={backdropRef}>
        <ForestBackdrop />
      </group>

      {WINDOWS.map((win) => (
        <ArchedWindow key={win.z} {...win} glassShape={glassShape} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
const WIN_WOOD = "#B98C5A"; // 浅暖木色
const WIN_WOOD_LIGHT = "#CBAE86"; // 细木格
const WIN_GLASS = "#eef4ea";

/**
 * 复古英式拱形木窗：
 * · 上半部：弧形固定玻璃 + 细木格多格分割
 * · 下半部：左右两扇向外敞开的平开窗（同样多格玻璃）
 * · 浅暖木框、通透玻璃、可见室外自然光
 */
function ArchedWindow({
  id,
  z,
  w,
  y0,
  yTop,
  glassShape,
}: {
  id: "window-01" | "window-02" | "window-03";
  z: number;
  w: number;
  y0: number;
  yTop: number;
  glassShape: THREE.Shape;
}) {
  const { r, R, a } = archGeometry(w);
  const h = yTop - y0; // 直墙段 = 可开启窗扇高度（约占整窗 70%）
  const cy = h + ARCH_RISE - R; // 拱心（本地坐标）
  const archArc = Math.PI - 2 * a; // 弓形拱圆心角
  const openAngle = 0.5;
  const archTopAt = (x: number) => cy + Math.sqrt(Math.max(R * R - x * x, 0));

  return (
    <group position={[HW, y0, z]} rotation={[0, -Math.PI / 2, 0]}>
      {/* 每扇窗是独立 InteractiveObject：只做放大 / 聚焦，不打开信息 Overlay */}
      <InteractiveObject id={id} mode="focus">
      {/* 整扇玻璃底（透出室外柔和自然光） */}
      <mesh position={[0, 0, -0.03]}>
        <shapeGeometry args={[glassShape]} />
        <meshStandardMaterial color={WIN_GLASS} transparent opacity={0.16} roughness={0.12} side={THREE.DoubleSide} />
      </mesh>

      {/* 侧框（浅暖木） */}
      {[-r, r].map((sx) => (
        <mesh key={sx} position={[sx, h / 2, 0.02]} castShadow>
          <boxGeometry args={[0.09, h, 0.1]} />
          <meshStandardMaterial color={WIN_WOOD} roughness={0.62} />
        </mesh>
      ))}
      {/* 较矮的弓形拱木框 */}
      <mesh position={[0, cy, 0.02]} rotation={[0, 0, a]} castShadow>
        <torusGeometry args={[R, 0.045, 8, 30, archArc]} />
        <meshStandardMaterial color={WIN_WOOD} roughness={0.62} />
      </mesh>
      {/* 窗台（略带使用痕迹） */}
      <mesh position={[0, -0.04, 0.07]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.22, 0.08, 0.28]} />
        <meshStandardMaterial color="#A9814F" roughness={0.72} />
      </mesh>

      {/* 拱起点横档（transom） */}
      <mesh position={[0, h, 0.03]} castShadow>
        <boxGeometry args={[w, 0.1, 0.12]} />
        <meshStandardMaterial color={WIN_WOOD} roughness={0.62} />
      </mesh>

      {/* 上半部固定拱形玻璃：细木格（3 竖 + 1 横，贴合拱形） */}
      {[-r / 3, 0, r / 3].map((x) => {
        const top = archTopAt(x) - 0.06;
        return (
          <mesh key={`av${x}`} position={[x, (h + top) / 2, 0.015]}>
            <boxGeometry args={[0.025, top - h, 0.05]} />
            <meshStandardMaterial color={WIN_WOOD_LIGHT} roughness={0.6} />
          </mesh>
        );
      })}
      <mesh position={[0, h + ARCH_RISE * 0.5, 0.015]}>
        <boxGeometry args={[1.24, 0.025, 0.05]} />
        <meshStandardMaterial color={WIN_WOOD_LIGHT} roughness={0.6} />
      </mesh>

      {/* 下半部：左右两扇向外敞开的平开窗（占整窗较大比例） */}
      <group position={[-r, 0, 0.02]} rotation={[0, openAngle, 0]}>
        <Sash width={r} height={h} dir={1} cols={3} rows={4} />
      </group>
      <group position={[r, 0, 0.02]} rotation={[0, -openAngle, 0]}>
        <Sash width={r} height={h} dir={-1} cols={3} rows={4} />
      </group>
      </InteractiveObject>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 平开窗扇：多格玻璃；dir 决定窗扇从铰链延伸的方向 */
function Sash({
  width,
  height,
  dir,
  cols,
  rows,
}: {
  width: number;
  height: number;
  dir: 1 | -1;
  cols: number;
  rows: number;
}) {
  const t = 0.04;
  const d = 0.055;
  const cx = (dir * width) / 2;
  const innerW = width - 2 * t;
  const innerH = height - 2 * t;

  return (
    <group>
      {/* 窗扇边框 */}
      <mesh position={[cx, height - t / 2, 0]} castShadow>
        <boxGeometry args={[width, t, d]} />
        <meshStandardMaterial color={WIN_WOOD} roughness={0.62} />
      </mesh>
      <mesh position={[cx, t / 2, 0]} castShadow>
        <boxGeometry args={[width, t, d]} />
        <meshStandardMaterial color={WIN_WOOD} roughness={0.62} />
      </mesh>
      <mesh position={[dir * (width - t / 2), height / 2, 0]} castShadow>
        <boxGeometry args={[t, innerH, d]} />
        <meshStandardMaterial color={WIN_WOOD} roughness={0.62} />
      </mesh>
      <mesh position={[dir * (t / 2), height / 2, 0]} castShadow>
        <boxGeometry args={[t, innerH, d]} />
        <meshStandardMaterial color={WIN_WOOD} roughness={0.62} />
      </mesh>
      {/* 玻璃 */}
      <mesh position={[cx, height / 2, 0]}>
        <planeGeometry args={[innerW, innerH]} />
        <meshStandardMaterial color={WIN_GLASS} transparent opacity={0.16} roughness={0.12} side={THREE.DoubleSide} />
      </mesh>
      {/* 细木格 */}
      {Array.from({ length: cols - 1 }, (_, i) => (i + 1) / cols).map((f) => (
        <mesh key={`v${f}`} position={[dir * (t + f * innerW), height / 2, 0]}>
          <boxGeometry args={[0.022, innerH, d * 0.6]} />
          <meshStandardMaterial color={WIN_WOOD_LIGHT} roughness={0.6} />
        </mesh>
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (i + 1) / rows).map((f) => (
        <mesh key={`h${f}`} position={[cx, t + f * innerH, 0]}>
          <boxGeometry args={[innerW, 0.022, d * 0.6]} />
          <meshStandardMaterial color={WIN_WOOD_LIGHT} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}
