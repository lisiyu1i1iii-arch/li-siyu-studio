"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useStudioStore } from "../store/studio-store";

/**
 * 右墙窗外环境（纯 2D 平面）：
 * - 白天：平面森林背景（CanvasTexture，含树干 / 大量树冠 / 不同高度 / 远近层次）；
 * - 夜晚：同一张平面森林的夜晚版本（整体变暗，仍能看清森林轮廓）；
 * - 不使用任何 3D 树模型 / 3D 森林场景 / 地形；
 * - 森林平面足够大并位于右墙外侧（x > 5），保证三个窗户在任何镜头角度都能看到森林，
 *   不会露出空白背景；最外层再放一张更大的天空底板兜底。
 */

const HW = 5;

const SKY_DAY = new THREE.Color("#cfe3ef");
const SKY_NIGHT = new THREE.Color("#070e16");
/* 夜晚把「白天森林平面」本身也压暗，避免任何角度露出白天/白色 */
const FOREST_DAY_WHITE = new THREE.Color("#ffffff");
const FOREST_DAY_NIGHT = new THREE.Color("#0a121a");

/* ------------------------------------------------------------------ */
/** 程序化森林贴图（day / night 两套，2D，带远近层次） */
function makeForestTexture(night: boolean): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  let seed = night ? 424242 : 987654321;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };

  // 天空
  const g = ctx.createLinearGradient(0, 0, 0, H * 0.62);
  g.addColorStop(0, night ? "#050b12" : "#bcd8e8");
  g.addColorStop(1, night ? "#0e1b24" : "#eaf3e4");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const trunkColor = night ? "#0a0f0d" : "#6b4a33";
  // 三层不同深浅 / 高度 → 森林纵深
  const layers = night
    ? [
        { color: "#122019", count: 64, base: 0.58, hmin: 0.1, hmax: 0.22, w: 90 },
        { color: "#0c1714", count: 44, base: 0.68, hmin: 0.18, hmax: 0.34, w: 130 },
        { color: "#060f0d", count: 30, base: 0.82, hmin: 0.3, hmax: 0.54, w: 210 },
      ]
    : [
        { color: "#9dbba0", count: 64, base: 0.58, hmin: 0.1, hmax: 0.22, w: 90 },
        { color: "#6f9a68", count: 44, base: 0.68, hmin: 0.18, hmax: 0.34, w: 130 },
        { color: "#4c7248", count: 30, base: 0.82, hmin: 0.3, hmax: 0.54, w: 210 },
      ];

  layers.forEach((L) => {
    for (let i = 0; i < L.count; i++) {
      const x = rnd() * W * 1.08 - W * 0.04;
      const h = (L.hmin + rnd() * (L.hmax - L.hmin)) * H;
      const baseY = H * L.base + rnd() * 20;
      const w = L.w * (0.7 + rnd() * 0.6);
      const cy = baseY - h;

      // 树冠（多个重叠圆 → 自然轮廓）
      ctx.fillStyle = L.color;
      const blobs = 5 + Math.floor(rnd() * 4);
      for (let b = 0; b < blobs; b++) {
        const bx = x + (rnd() - 0.5) * w;
        const by = cy + (rnd() - 0.3) * h * 0.55;
        const br = w * (0.3 + rnd() * 0.24);
        ctx.beginPath();
        ctx.arc(bx, by, br, 0, Math.PI * 2);
        ctx.fill();
      }
      // 树干
      ctx.fillStyle = trunkColor;
      const tw = Math.max(6, w * 0.09);
      ctx.fillRect(x - tw / 2, cy, tw, h);
    }
  });

  // 地面
  ctx.fillStyle = night ? "#0a120f" : "#5d6f47";
  ctx.fillRect(0, H * 0.88, W, H * 0.12);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/** 窗外森林（纯 2D 平面；白天 + 夜晚交叉淡入） */
export function ForestBackdrop() {
  const dayNight = useStudioStore((s) => s.dayNight);
  const dayTex = useMemo(() => makeForestTexture(false), []);
  const nightTex = useMemo(() => makeForestTexture(true), []);
  const dayMat = useRef<THREE.MeshBasicMaterial>(null);
  const nightMat = useRef<THREE.MeshBasicMaterial>(null);
  const skyMat = useRef<THREE.MeshBasicMaterial>(null);
  const nightRef = useRef(0);

  useFrame((_, delta) => {
    const target = dayNight === "night" ? 1 : 0;
    nightRef.current = THREE.MathUtils.damp(nightRef.current, target, 3, delta);
    const n = nightRef.current;
    // 三层同时响应同一个全局 dayNight：天空、白天森林、夜晚森林
    if (skyMat.current) skyMat.current.color.lerpColors(SKY_DAY, SKY_NIGHT, n);
    if (dayMat.current) {
      dayMat.current.color.lerpColors(FOREST_DAY_WHITE, FOREST_DAY_NIGHT, n);
    }
    if (nightMat.current) nightMat.current.opacity = n;
  });

  return (
    <group>
      {/* 更大的天空 / 远景底板：任何角度、任何镜头状态都不会露出默认白色背景 */}
      <mesh position={[HW + 3.6, 2.4, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[44, 22]} />
        <meshBasicMaterial ref={skyMat} color="#cfe3ef" fog={false} />
      </mesh>
      {/* 平面森林（白天）：夜晚会被压暗，即使覆盖层未完全生效也不会露出白天 */}
      <mesh position={[HW + 2.4, 2.0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[24, 12]} />
        <meshBasicMaterial
          ref={dayMat}
          map={dayTex ?? undefined}
          color={dayTex ? "#ffffff" : "#9fbf9a"}
          fog={false}
        />
      </mesh>
      {/* 平面森林（夜晚覆盖层） */}
      <mesh position={[HW + 2.38, 2.0, 0.5]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[24, 12]} />
        <meshBasicMaterial
          ref={nightMat}
          map={nightTex ?? undefined}
          color={nightTex ? "#ffffff" : "#0a1410"}
          transparent
          opacity={0}
          fog={false}
        />
      </mesh>
    </group>
  );
}
