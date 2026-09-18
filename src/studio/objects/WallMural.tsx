"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { isRealClick } from "@/lib/pointer-guard";

/**
 * 左墙整面植物壁画（替换原局部墙绘）。
 *
 * 像直接绘制在浅色墙面上的大型手绘壁画：单层透明贴图平面、贴墙、无边框、
 * 无厚度、无悬浮。内容为**一棵完整清晰的矮主干大树**：
 * 居中的矮粗主树干（下部干净）→ 由主干向左右伸展的树枝 → 主干上方茂密树冠
 * → 枝头少量小鸟 → 底部小草与小花。
 */

const WALL_X = -5;
const MURAL = {
  x: WALL_X + 0.03,
  y: 1.9,
  z: 0,
  w: 7.8,
  h: 3.7,
};

function makeMuralTexture(yellow: boolean): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 1024;
  const H = 486;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, W, H);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  let seed = 20241001;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  // ---- 矮粗主树干（居中、下部干净） ----
  ctx.fillStyle = "#7A5233";
  ctx.beginPath();
  ctx.moveTo(452, H);
  ctx.bezierCurveTo(462, 400, 480, 320, 492, 250);
  ctx.lineTo(538, 250);
  ctx.bezierCurveTo(550, 320, 568, 400, 578, H);
  ctx.closePath();
  ctx.fill();
  // 树皮纹理
  ctx.strokeStyle = "rgba(58,38,24,0.4)";
  ctx.lineWidth = 3;
  for (let x = 470; x <= 560; x += 14) {
    ctx.beginPath();
    ctx.moveTo(x, H);
    ctx.bezierCurveTo(x + 3, 400, x - 3, 320, x + (x < 515 ? 16 : -16), 252);
    ctx.stroke();
  }
  // 根部外扩
  ctx.fillStyle = "#7A5233";
  ctx.beginPath();
  ctx.ellipse(515, H - 6, 96, 24, 0, Math.PI, 0);
  ctx.fill();

  // ---- 树枝：由主干顶部向左右 / 上方伸展 ----
  const branch = (pts: number[][], width: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) {
      const xc = (pts[i][0] + pts[i + 1][0]) / 2;
      const yc = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], xc, yc);
    }
    ctx.lineTo(pts[pts.length - 1][0], pts[pts.length - 1][1]);
    ctx.stroke();
  };
  const branches: { pts: number[][]; w: number; c: string }[] = [
    { pts: [[505, 255], [380, 200], [240, 168], [120, 150]], w: 17, c: "#7A5233" },
    { pts: [[525, 255], [660, 200], [800, 168], [920, 152]], w: 17, c: "#7A5233" },
    { pts: [[505, 250], [430, 170], [360, 100], [300, 60]], w: 11, c: "#8E6A45" },
    { pts: [[525, 250], [600, 165], [670, 100], [720, 62]], w: 11, c: "#8E6A45" },
    { pts: [[515, 248], [516, 160], [512, 80]], w: 10, c: "#8E6A45" },
    { pts: [[380, 200], [350, 140], [370, 88]], w: 7, c: "#8E6A45" },
    { pts: [[240, 168], [210, 120], [232, 76]], w: 7, c: "#8E6A45" },
    { pts: [[660, 200], [700, 140], [680, 86]], w: 7, c: "#8E6A45" },
    { pts: [[800, 168], [840, 120], [820, 78]], w: 7, c: "#8E6A45" },
    { pts: [[920, 152], [950, 116], [940, 82]], w: 6, c: "#8E6A45" },
  ];
  branches.forEach((b) => branch(b.pts, b.w, b.c));

  // ---- 树冠：集中在主干上方 / 树枝周围 ----
  // 仅树叶颜色随 yellow 变化（树干 / 树枝 / 鸟 / 草花保持原色）
  const greens = yellow
    ? ["#E6C24A", "#F0D264", "#D9A93A", "#F5DE8A", "#E0B84A", "#F7E6A0"]
    : ["#6E9A5F", "#87AE72", "#4E7A45", "#9CC08A", "#5F8A52", "#A7C994"];
  const leaf = (x: number, y: number, rot: number, s: number, c: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.ellipse(0, 0, 13 * s, 6 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  // 沿树枝布叶（越靠枝梢越密）
  branches.forEach((b) => {
    for (let seg = 0; seg < b.pts.length - 1; seg++) {
      const [x0, y0] = b.pts[seg];
      const [x1, y1] = b.pts[seg + 1];
      for (let i = 0; i < 18; i++) {
        const t = i / 18;
        const x = x0 + (x1 - x0) * t + (rnd() - 0.5) * 34;
        const y = y0 + (y1 - y0) * t + (rnd() - 0.5) * 34;
        const n = rnd() < 0.5 ? 3 : 2;
        for (let k = 0; k < n; k++) {
          leaf(x + (rnd() - 0.5) * 26, y + (rnd() - 0.5) * 26, rnd() * Math.PI, 0.6 + rnd() * 0.9, greens[Math.floor(rnd() * greens.length)]);
        }
      }
    }
  });
  // 树冠团簇（围绕主干上方，形成一棵树；主干下部保持干净）
  const clusters: [number, number, number][] = [
    [515, 90, 130],
    [360, 110, 105],
    [670, 110, 105],
    [230, 150, 85],
    [800, 150, 85],
    [430, 190, 80],
    [610, 190, 80],
    [515, 200, 90],
    [150, 170, 62],
    [890, 168, 62],
  ];
  clusters.forEach(([cx, cy, r]) => {
    const n = 46;
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2;
      const rr = rnd() * r;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr * 0.7;
      // 主干下部保持干净
      if (x > 430 && x < 600 && y > 290) continue;
      leaf(x, y, rnd() * Math.PI, 0.45 + rnd() * 0.95, greens[Math.floor(rnd() * greens.length)]);
    }
  });

  // ---- 枝头小鸟（少量、自然） ----
  const birds = ["#6E8FA8", "#C08A4A", "#B85A4A", "#5E7A52"];
  const bird = (x: number, y: number, s: number, color: string, look: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, 13, 8, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(11, -5 + look * 2, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#E0A63C";
    ctx.beginPath();
    ctx.moveTo(16, -6 + look * 2);
    ctx.lineTo(23, -4 + look * 2);
    ctx.lineTo(16, -3 + look * 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-11, -1);
    ctx.lineTo(-24, -8);
    ctx.lineTo(-22, 3);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2E2A28";
    ctx.beginPath();
    ctx.arc(13, -6 + look * 2, 1.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#8A6A45";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-2, 7);
    ctx.lineTo(-2, 13);
    ctx.moveTo(4, 7);
    ctx.lineTo(4, 13);
    ctx.stroke();
    ctx.restore();
  };
  const perches: [number, number, number, number][] = [
    [240, 168, 0.9, 0],
    [300, 60, 0.8, 1],
    [720, 62, 0.85, 0],
    [800, 168, 0.8, 1],
    [370, 88, 0.75, 0],
  ];
  perches.forEach(([x, y, s, look], i) => bird(x, y, s, birds[i % birds.length], look));

  // ---- 底部小草 + 小花（主干根部留白） ----
  const blade = (x: number, baseY: number, h: number, lean: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x + lean * 0.4, baseY - h * 0.6, x + lean, baseY - h);
    ctx.stroke();
  };
  const grassGreens = ["#6E9A5F", "#5F8A52", "#87AE72", "#4E7A45"];
  for (let x = -10; x < W + 10; x += 7) {
    if (x > 420 && x < 610) continue; // 树干根部留白
    const h = 26 + rnd() * 52;
    const lean = (rnd() - 0.5) * 16;
    blade(x + (rnd() - 0.5) * 5, H + 6, h, lean, grassGreens[Math.floor(rnd() * grassGreens.length)]);
  }
  const flower = (x: number, y: number, s: number, petal: string, center: string) => {
    ctx.fillStyle = petal;
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(x + Math.cos(a) * 5 * s, y + Math.sin(a) * 5 * s, 3.2 * s, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = center;
    ctx.beginPath();
    ctx.arc(x, y, 2.4 * s, 0, Math.PI * 2);
    ctx.fill();
  };
  const petals = [
    ["#F3C6CE", "#F2C15A"],
    ["#E8D6F0", "#F2C15A"],
    ["#F6E2A8", "#E8A24A"],
    ["#F2EDE4", "#E8A24A"],
  ];
  for (let i = 0; i < 46; i++) {
    const x = rnd() * W;
    if (x > 420 && x < 610) continue;
    const y = H - 10 - rnd() * 44;
    const p = petals[Math.floor(rnd() * petals.length)];
    flower(x, y, 0.7 + rnd() * 0.6, p[0], p[1]);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/**
 * 左墙树木墙绘：点击 → 树叶在绿色 / 黄色之间平滑切换。
 * 只改树叶颜色（两张仅叶色不同的贴图交叉淡入），树干 / 鸟 / 草花保持不变。
 * 不弹 Overlay、不 Camera Focus、无黄色点；isRealClick 防止拖拽误触发。
 */
export default function WallMural() {
  const greenTex = useMemo(() => makeMuralTexture(false), []);
  const yellowTex = useMemo(() => makeMuralTexture(true), []);
  const yellowMat = useRef<THREE.MeshStandardMaterial>(null);
  const [yellow, setYellow] = useState(false);
  const amount = useRef(0);

  useFrame((_, delta) => {
    amount.current = THREE.MathUtils.damp(amount.current, yellow ? 1 : 0, 3, delta);
    if (yellowMat.current) yellowMat.current.opacity = amount.current;
  });

  const toggle = () => setYellow((v) => !v);

  return (
    <group>
      {/* 绿色树叶底图（树干 / 鸟 / 草花原色）——纯视觉，不接收点击 */}
      <mesh position={[MURAL.x, MURAL.y, MURAL.z]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[MURAL.w, MURAL.h]} />
        <meshStandardMaterial
          map={greenTex ?? undefined}
          transparent
          alphaTest={0.08}
          roughness={0.95}
          metalness={0}
          side={THREE.FrontSide}
        />
      </mesh>
      {/* 黄色树叶覆盖层（仅叶色不同，平滑淡入淡出） */}
      <mesh
        position={[MURAL.x + 0.002, MURAL.y, MURAL.z]}
        rotation={[0, Math.PI / 2, 0]}
        renderOrder={1}
      >
        <planeGeometry args={[MURAL.w, MURAL.h]} />
        <meshStandardMaterial
          ref={yellowMat}
          map={yellowTex ?? undefined}
          transparent
          opacity={0}
          alphaTest={0.08}
          roughness={0.95}
          metalness={0}
          side={THREE.FrontSide}
        />
      </mesh>
      {/*
        树木专属 hitbox：只覆盖树木实际视觉范围（约 5.4 × 3.0），
        不是整面左墙；黑板有自己的 InteractiveObject 且位于更前方，会拦截点击。
      */}
      <mesh
        position={[MURAL.x + 0.006, 1.8, 0]}
        rotation={[0, Math.PI / 2, 0]}
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
          toggle();
        }}
      >
        <planeGeometry args={[5.4, 3.0]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
