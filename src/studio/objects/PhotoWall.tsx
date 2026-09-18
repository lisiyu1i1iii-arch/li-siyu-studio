"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { isRealClick } from "@/lib/pointer-guard";
import { PHOTO_WALL_Z, PHOTOGRAPHY } from "../data/photography";
import { STUDIO_PALETTE as P } from "../data/studio-content";
import InteractiveObject from "./InteractiveObject";
import { Box, Cyl, Sphere } from "./primitives";

/**
 * BACK WALL LEFT · 摄影墙
 *
 * 13 个相框 = 13 个独立 InteractiveObject（photo-01 … photo-13，5/4/4 构图）。
 * 每个相框只拥有自己的点击区域，打开对应索引的摄影 Gallery。
 *
 * 相框内使用真实摄影作品的缩略图（3D 纹理，按原始比例适配、不拉伸）；
 * Gallery 中显示全尺寸原图。
 *
 * 下方矮书架 / 书 / 多肉为纯装饰。三盆多肉各自是独立 InteractiveObject。
 *
 * 性能：所有相框共用同一份 unit geometry 与共享材质；缩略图显著降低显存占用。
 */

/* 共享 geometry / material：13 个相框复用，不各自创建 */
const UNIT_BOX = new THREE.BoxGeometry(1, 1, 1);
const FRAME_WOOD = new THREE.MeshStandardMaterial({
  color: "#6B4A33",
  roughness: 0.68,
  metalness: 0.03,
});
const FRAME_BACKING = new THREE.MeshStandardMaterial({
  color: "#4a3121",
  roughness: 0.8,
});

export default function PhotoWall() {
  // 13 张缩略图一次性加载（避免全尺寸纹理占用过多显存）
  const textures = useLoader(
    THREE.TextureLoader,
    PHOTOGRAPHY.map((p) => p.thumb ?? ""),
  );

  useMemo(() => {
    textures.forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
    });
  }, [textures]);

  return (
    <group>
      {PHOTOGRAPHY.map((photo, i) => (
        <group
          key={photo.id}
          position={[photo.frame.x, photo.frame.y, PHOTO_WALL_Z]}
          rotation={[0, 0, photo.frame.r + (photo.frame.groupRotate ?? 0)]}
        >
          <InteractiveObject id={photo.id}>
            <Frame
              w={photo.frame.w}
              h={photo.frame.h}
              texture={textures[i]}
              aspect={photo.aspect}
              rotate={photo.frame.rotate ?? 0}
            />
          </InteractiveObject>
        </group>
      ))}

      {/* 装饰（无交互） */}
      <LowShelf />
      <Succulents />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 单个相框：背板 + 真实照片（按原始比例 contain）+ 四条木框 */
function Frame({
  w,
  h,
  texture,
  aspect,
  rotate = 0,
}: {
  w: number;
  h: number;
  texture: THREE.Texture;
  aspect: number;
  rotate?: number;
}) {
  const t = Math.min(0.045, Math.max(0.03, w * 0.06));
  const d = 0.035;
  const bars: { s: [number, number, number]; p: [number, number, number] }[] = [
    { s: [w, t, d], p: [0, h / 2 - t / 2, 0.02] },
    { s: [w, t, d], p: [0, -h / 2 + t / 2, 0.02] },
    { s: [t, h - 2 * t, d], p: [-w / 2 + t / 2, 0, 0.02] },
    { s: [t, h - 2 * t, d], p: [w / 2 - t / 2, 0, 0.02] },
  ];

  const rotated = rotate === 90;
  const maxW = w - 2 * t - 0.02;
  const maxH = h - 2 * t - 0.02;
  // 旋转 90° 后平面包围盒会交换宽高：按交换后的可用空间适配（仍为 contain）
  const boxW = rotated ? maxH : maxW;
  const boxH = rotated ? maxW : maxH;
  let iw = boxW;
  let ih = boxW / (aspect || 1);
  if (ih > boxH) {
    ih = boxH;
    iw = boxH * (aspect || 1);
  }

  return (
    <group>
      <mesh
        geometry={UNIT_BOX}
        scale={[w, h, 0.014]}
        position={[0, 0, 0.009]}
        material={FRAME_BACKING}
      />
      <mesh
        position={[0, 0, 0.017]}
        rotation={[0, 0, rotated ? -Math.PI / 2 : 0]}
      >
        <planeGeometry args={[iw, ih]} />
        <meshStandardMaterial map={texture} roughness={0.92} />
      </mesh>
      {bars.map((bar, i) => (
        <mesh
          key={i}
          geometry={UNIT_BOX}
          scale={bar.s}
          position={bar.p}
          material={FRAME_WOOD}
          castShadow
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 悬浮式低矮木质置物架：装饰，无交互。
 * 单层木板 + 两处隐藏式金属支撑；无侧板 / 无背板 / 无柜脚 / 无柜体。
 * 长度与上方 string light 大致一致（x ≈ -4.3 … 0.9）。
 */
function LowShelf() {
  const books = [0.3, 0.28, 0.32, 0.26, 0.29, 0.27, 0.31, 0.25, 0.28, 0.3];
  const colors = [P.green, P.brick, "#B8892F", P.woodDark, "#6B7A8F", "#F2EDE4"];

  return (
    <group position={[-1.7, 0, -3.72]}>
      {/* 单层悬浮木板（顶面 y = 0.55，长 5.2 ≈ string light 长度） */}
      <Box args={[5.2, 0.06, 0.3]} position={[0, 0.52, 0]} color={P.deepBrown} roughness={0.7} />

      {/* 隐藏式金属支撑（贴墙竖板 + 托板） */}
      {[-2.3, 2.3].map((x) => (
        <group key={x} position={[x, 0, -0.16]}>
          <Box args={[0.04, 0.26, 0.02]} position={[0, 0.39, 0]} color="#3a3f4b" roughness={0.5} metalness={0.6} />
          <Box args={[0.04, 0.02, 0.18]} position={[0, 0.5, 0.09]} color="#3a3f4b" roughness={0.5} metalness={0.6} />
        </group>
      ))}

      {/* 左侧一小组书（书脊更清晰、更厚更高） */}
      {books.map((h, i) => (
        <Box
          key={i}
          args={[0.085, h * 1.35, 0.3]}
          position={[-2.3 + i * 0.11, 0.55 + (h * 1.35) / 2, 0]}
          rotation={[0, 0, i === 4 ? 0.2 : 0]}
          color={colors[i % colors.length]}
          roughness={0.85}
        />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/**
 * 书架顶部右侧三盆多肉（错落）。
 * 点击任意一盆 → 三盆一起「向左蹦跳 → 掉头 → 向右蹦跳回到原位」，
 * 不弹 Overlay、不 Camera Focus、无黄色点；用 isRealClick 区分拖拽。
 */
const SUCC_POTS = [
  { x: 1.9, z: 0.03, s: 1, pot: P.pot, targetX: -1.0, jumpH: 0.09, delay: 0, phase: 0 },
  { x: 2.2, z: -0.03, s: 0.85, pot: "#F2EDE4", targetX: -0.7, jumpH: 0.11, delay: 0.06, phase: 1.7 },
  { x: 2.5, z: 0.04, s: 0.72, pot: P.green, targetX: -0.4, jumpH: 0.08, delay: 0.12, phase: 3.2 },
];

const SUCC_DURATION = 3.6;

function Succulents() {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const runRef = useRef(-1);

  useFrame((_, delta) => {
    const t = runRef.current;
    const active = t >= 0;
    if (active) runRef.current = t + delta;

    const stage = SUCC_DURATION / 2;
    SUCC_POTS.forEach((p, i) => {
      const g = refs.current[i];
      if (!g) return;
      if (!active) {
        g.position.set(p.x, 0, p.z);
        return;
      }
      const local = t - p.delay;
      let progress: number;
      let going: boolean; // true = 向左，false = 向右返回
      if (local < 0) {
        progress = 0;
        going = true;
      } else if (local < stage) {
        progress = local / stage;
        going = true;
      } else if (local < stage * 2) {
        progress = (local - stage) / stage;
        going = false;
      } else {
        progress = 1;
        going = false;
      }

      const fromX = going ? p.x : p.targetX;
      const toX = going ? p.targetX : p.x;
      const x = fromX + (toX - fromX) * progress;
      // 明显蹦跳：多个跳跃周期 + 每盆不同相位/高度
      const hop = Math.abs(Math.sin(progress * Math.PI * 3 + p.phase)) * p.jumpH;
      g.position.set(x, hop, p.z);
    });

    if (active && t >= SUCC_DURATION) {
      runRef.current = -1;
    }
  });

  const start = () => {
    if (runRef.current >= 0) return;
    runRef.current = 0;
  };

  return (
    <group position={[-1.7, 0.55, -3.72]}>
      {SUCC_POTS.map((p, i) => (
        <group
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[p.x, 0, p.z]}
          scale={p.s}
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
            start();
          }}
        >
          {/* 花盆（带盆沿细节） */}
          <Cyl args={[0.1, 0.082, 0.14, 18]} position={[0, 0.07, 0]} color={p.pot} roughness={0.85} />
          <mesh position={[0, 0.14, 0]}>
            <torusGeometry args={[0.098, 0.012, 8, 20]} />
            <meshStandardMaterial color={p.pot} roughness={0.85} />
          </mesh>
          {/* 多层叶片 */}
          <Sphere radius={0.1} position={[0, 0.18, 0]} color={P.plant} roughness={0.9} />
          <Sphere radius={0.058} position={[0.038, 0.23, 0.016]} color={P.plantDark} roughness={0.9} />
          <Sphere radius={0.046} position={[-0.034, 0.22, -0.014]} color="#6b9a63" roughness={0.9} />
          <Sphere radius={0.034} position={[0.008, 0.27, -0.03]} color={P.plant} roughness={0.9} />
        </group>
      ))}
    </group>
  );
}
