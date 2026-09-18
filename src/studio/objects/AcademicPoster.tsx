"use client";

import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import InteractiveObject from "./InteractiveObject";
import { Box, Cyl, Sphere } from "./primitives";
import { STUDIO_PALETTE as P, STUDIO_PROFILE } from "../data/studio-content";
import { useStudioStore } from "../store/studio-store";

/**
 * BACK WALL · 电脑桌上方 · 两张海报
 *
 * · 左侧海报：唯一可交互 —— 个人信息（Personal Scrapbook / Mood Board 视觉）
 * · 右侧海报：纯装饰，不可点击、无 hover、无 Overlay
 * · 上方深木挂牌 + 暖白灯带，下方一盏小黄铜吊灯，形成柔和暖意
 */
const POSTER_W = 1.05;
const POSTER_H = 0.78;

export default function AcademicPoster() {
  return (
    <group>
      {/* 左侧海报：唯一可交互 —— 个人信息。整体上移 0.20（y 2.28 → 2.48）。
       * scale / rotation / 内容不变；InteractiveObject 与 hitbox 随 group 同步上移。
       * 底边 ≈ y2.09，与显示器上缘（≈y1.86）保留 ≈0.23 间距。 */}
      <group position={[2.45, 2.48, -3.9]} rotation={[0, 0, 0.012]}>
        <InteractiveObject id="poster">
          <PosterFrame variant={0} />
        </InteractiveObject>
      </group>

      {/* 右侧海报：纯装饰（无 InteractiveObject）。整体上移 0.06（y 2.30 → 2.36），
       * 最终比左侧低约 0.12（错落构图）。scale / rotation / 内容不变。
       * 底边 ≈ y2.04，与显示器上缘保留 ≈0.18 间距。 */}
      <group position={[3.9, 2.36, -3.86]} rotation={[0, 0, -0.012]} scale={0.82}>
        <PosterFrame variant={1} />
      </group>

      <SignBoard />
      <PendantLamp />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 少女风 Personal Scrapbook / Mood Board（中性占位素材，不伪造真人照片） */
function makeScrapbookTexture(variant: number): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 560;
  const H = 420;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 纸底 + 细微颗粒
  ctx.fillStyle = "#F7F1E6";
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 900; i++) {
    ctx.fillStyle = `rgba(120,100,80,${Math.random() * 0.05})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }

  const drawFlower = (cx: number, cy: number, r: number, color: string) => {
    ctx.fillStyle = color;
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * 0.62, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#F7D774";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.5, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawStar = (cx: number, cy: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const rr = k % 2 === 0 ? r : r * 0.45;
      const a = -Math.PI / 2 + (k * Math.PI) / 5;
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawHeart = (cx: number, cy: number, s: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cx, cy + s * 0.7);
    ctx.bezierCurveTo(cx - s * 1.2, cy - s * 0.2, cx - s * 0.5, cy - s * 1.1, cx, cy - s * 0.35);
    ctx.bezierCurveTo(cx + s * 0.5, cy - s * 1.1, cx + s * 1.2, cy - s * 0.2, cx, cy + s * 0.7);
    ctx.fill();
  };

  // 三张真实个人照片由 ScrapbookPhotos 以 3D 平面叠加显示（按原始比例）

  // 星星 / 爱心 / 花朵 贴纸
  drawStar(232, 70, 11, "#F2C15A");
  drawStar(380, 78, 8, "#E6A9B8");
  drawStar(70, 250, 9, "#C9A7DE");
  drawHeart(500, 62, 10, "#E88A9A");
  drawHeart(168, 300, 8, "#E88A9A");
  drawFlower(250, 250, 10, "#F3C6CE");
  drawFlower(360, 300, 8, "#BFD8A8");

  // 手绘涂鸦（波浪线）
  ctx.strokeStyle = "rgba(150,120,90,0.5)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = 300; x < 470; x += 6) {
    const y = 356 + Math.sin(x * 0.12) * 5;
    if (x === 300) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // 少量个人信息（仅左侧海报，使用真实资料）
  // 按需求只保留姓名：已删除「新媒体运营 / 重庆」两行文字
  if (variant === 0) {
    ctx.fillStyle = "#3A2F27";
    ctx.font = "bold 30px Georgia, 'Times New Roman', serif";
    ctx.fillText(STUDIO_PROFILE.name, 58, 348);
  } else {
    ctx.fillStyle = "rgba(120,100,80,0.7)";
    ctx.font = "italic 16px Georgia, serif";
    ctx.fillText("little studio", 300, 388);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/** 圆角原木框 + Scrapbook 海报（以自身中心为原点） */
function PosterFrame({ variant }: { variant: number }) {
  const texture = useMemo(() => makeScrapbookTexture(variant), [variant]);
  const t = 0.04;
  const d = 0.035;
  const bars: { args: [number, number, number]; pos: [number, number, number] }[] = [
    { args: [POSTER_W, t, d], pos: [0, POSTER_H / 2 - t / 2, 0] },
    { args: [POSTER_W, t, d], pos: [0, -POSTER_H / 2 + t / 2, 0] },
    { args: [t, POSTER_H - 2 * t, d], pos: [-POSTER_W / 2 + t / 2, 0, 0] },
    { args: [t, POSTER_H - 2 * t, d], pos: [POSTER_W / 2 - t / 2, 0, 0] },
  ];

  return (
    <group>
      {/* 背板 */}
      <Box args={[POSTER_W, POSTER_H, 0.012]} position={[0, 0, 0.006]} color="#4a3121" roughness={0.8} castShadow={false} />
      {/* 海报纸张 */}
      <mesh position={[0, 0, 0.014]}>
        <planeGeometry args={[POSTER_W - 2 * t, POSTER_H - 2 * t]} />
        <meshStandardMaterial
          map={texture ?? undefined}
          color={texture ? "#ffffff" : P.posterBg}
          roughness={0.95}
          metalness={0}
        />
      </mesh>
      {/* 三张真实个人照片（仅左侧可交互海报） */}
      {variant === 0 && <ScrapbookPhotos />}
      {/* 原木框 */}
      {bars.map((bar, i) => (
        <Box
          key={i}
          args={bar.args}
          position={[bar.pos[0], bar.pos[1], 0.016]}
          color={P.wood}
          roughness={0.72}
          metalness={0.03}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 三张真实个人照片：按原始比例、不同自然尺寸/角度叠加，形成 scrapbook 感 */
function ScrapbookPhotos() {
  const textures = useLoader(THREE.TextureLoader, [
    "/assets/portfolio/personal/thumbs/personal-1.jpg",
    "/assets/portfolio/personal/thumbs/personal-2.jpg",
    "/assets/portfolio/personal/thumbs/personal-3.jpg",
  ]);

  useMemo(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
    });
  }, [textures]);

  const photos = [
    { tex: textures[0], aspect: 4032 / 3024, x: -0.24, y: 0.06, w: 0.3, rot: 0.05 },
    { tex: textures[1], aspect: 1707 / 1280, x: 0.06, y: 0.12, w: 0.26, rot: -0.06 },
    { tex: textures[2], aspect: 2851 / 3802, x: 0.32, y: -0.02, w: 0.19, rot: 0.04 },
  ];

  return (
    <>
      {photos.map((p, i) => {
        const h = p.w / p.aspect;
        return (
          <group key={i} position={[p.x, p.y, 0.021]} rotation={[0, 0, p.rot]}>
            {/* 白色拍立得边 */}
            <mesh position={[0, 0, -0.001]}>
              <planeGeometry args={[p.w + 0.03, h + 0.035]} />
              <meshStandardMaterial color="#ffffff" roughness={0.95} />
            </mesh>
            <mesh>
              <planeGeometry args={[p.w, h]} />
              <meshStandardMaterial map={p.tex} roughness={0.95} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------ */
/** 深木挂牌 + 暖白灯带 */
function SignBoard() {
  return (
    // 挂灯横木：与吊灯一起上移 0.20（y 3.05 → 3.25），
    // 使吊灯灯绳重新接入横木下方（不再悬空），同时与两个相框保持间距。
    <group position={[3.1, 3.25, -3.88]}>
      <RoundedBox args={[2.6, 0.24, 0.14]} radius={0.02} smoothness={3} castShadow>
        <meshStandardMaterial color={P.deepBrown} roughness={0.7} />
      </RoundedBox>
      {/* 灯带：按需求全屋灯具关闭，去掉 emissive */}
      <Box args={[2.44, 0.05, 0.02]} position={[0, -0.05, 0.075]} color="#D8CDBA" roughness={0.7} castShadow={false} />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 小型黄铜吊灯（电脑上方）：白天关闭，夜晚内部柔和暖光（无可见灯泡） */
function PendantLamp() {
  const dayNight = useStudioStore((s) => s.dayNight);
  const glowRef = useRef<THREE.MeshStandardMaterial>(null);
  const nightRef = useRef(0);

  useFrame((_, delta) => {
    const target = dayNight === "night" ? 1 : 0;
    nightRef.current = THREE.MathUtils.damp(nightRef.current, target, 2.2, delta);
    if (glowRef.current) glowRef.current.emissiveIntensity = nightRef.current * 1.6;
  });

  return (
    // 与两个相框一起上移 0.20（y 0 → 0.20）；左右位置 / rotation / scale / 灯光效果不变
    <group position={[3.1, 0.2, -3.6]}>
      <Cyl args={[0.005, 0.005, 0.24, 6]} position={[0, 2.88, 0]} color="#6b5a3f" roughness={0.8} />
      <mesh position={[0, 2.74, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.12, 0.12, 18, 1, true]} />
        <meshStandardMaterial color={P.brass} roughness={0.4} metalness={0.75} side={THREE.DoubleSide} />
      </mesh>
      {/* 内层发光面（夜晚暖光，无可见灯泡） */}
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[0.1, 0.1, 16, 1, true]} />
        <meshStandardMaterial
          ref={glowRef}
          color="#3a2f24"
          emissive="#ffd2a0"
          emissiveIntensity={0}
          roughness={0.8}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
