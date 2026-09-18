"use client";

import { Box, Cyl } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";

/**
 * ⚠️ 此组件已不再出现在 Studio 场景中。
 *
 * PHASE 2.7-1：Mailbox 从 PAGE 2（Studio）移除，
 * 改为 PAGE 1（Entry / Landing）圆拱门旁的 CONTACT 入口（见 ui/LoadingScreen.tsx）。
 * 组件文件按需求保留，导出为纯装饰 group，方便日后复用。
 */
export default function Mailbox({
  position = [-2.9, 0, 0.4],
}: {
  position?: [number, number, number];
}) {
  return (
    <group position={position}>
      <Cyl args={[0.07, 0.09, 1.15, 14]} position={[0, 0.58, 0]} color={P.woodDark} roughness={0.72} />
      <Box args={[0.5, 0.44, 0.7]} position={[0, 1.35, 0]} color={P.ember} roughness={0.7} />
      <Box args={[0.54, 0.07, 0.74]} position={[0, 1.6, 0]} color={P.woodDark} roughness={0.72} />
      <Box args={[0.02, 0.07, 0.36]} position={[0.26, 1.42, 0]} color="#3a2a1c" roughness={0.8} />
      <Box args={[0.05, 0.24, 0.05]} position={[-0.26, 1.5, 0.32]} color="#e05a47" roughness={0.7} />
      <Box args={[0.05, 0.11, 0.18]} position={[-0.26, 1.58, 0.24]} color="#e05a47" roughness={0.7} />
    </group>
  );
}
