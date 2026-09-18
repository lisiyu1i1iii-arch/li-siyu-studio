"use client";

import { useMemo } from "react";

import { Box, Cyl, Sphere } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";

/**
 * ⚠️ 此组件已不再出现在 Studio 场景中。
 *
 * PHASE 2.8：书架拆分为两处——
 *   · 后墙照片墙下方「长扁单层矮书架」→ 见 objects/PhotoWall.tsx 的 LowShelf
 *   · 左墙「五层落地书架 + 地球仪」→ 见 objects/LeftWall.tsx 的 Bookcase
 * 组件文件按需求保留，导出为纯装饰 group，方便日后复用。
 */
export default function Bookshelf({
  position = [-3.2, 0, -3.72],
}: {
  position?: [number, number, number];
}) {
  const books = useMemo(() => {
    const colors = [P.green, P.woodDark, "#F2EDE4", P.brick, "#B8892F", "#6B7A8F"];
    return [0, 1].flatMap((tier) =>
      Array.from({ length: 9 }, (_, i) => ({
        tier,
        x: -0.62 + i * 0.15,
        h: 0.24 + ((i * 3 + tier * 5) % 4) * 0.03,
        color: colors[(i + tier * 3) % colors.length],
      })),
    );
  }, []);

  return (
    <group position={position}>
      <Box args={[0.04, 0.9, 0.35]} position={[-0.78, 0.45, 0]} color={P.woodDark} roughness={0.72} />
      <Box args={[0.04, 0.9, 0.35]} position={[0.78, 0.45, 0]} color={P.woodDark} roughness={0.72} />
      {[0.04, 0.45, 0.86].map((y, i) => (
        <Box key={i} args={[1.6, 0.04, 0.35]} position={[0, y, 0]} color={P.woodDark} roughness={0.72} />
      ))}
      <Box args={[1.6, 0.9, 0.02]} position={[0, 0.45, -0.165]} color="#5c3f2c" roughness={0.8} />
      {books.map((b, i) => (
        <Box
          key={i}
          args={[0.07, b.h, 0.2]}
          position={[b.x, (b.tier === 0 ? 0.06 : 0.47) + b.h / 2, 0.03]}
          color={b.color}
          roughness={0.85}
        />
      ))}
      <Cyl args={[0.13, 0.1, 0.17, 14]} position={[0.5, 0.155, 0.02]} color={P.rattan} roughness={0.8} />
      <Sphere radius={0.06} position={[-0.55, 0.5, 0.02]} color={P.cream} roughness={0.7} />
    </group>
  );
}
