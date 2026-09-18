"use client";

import { RoundedBox } from "@react-three/drei";

import { Box, Cyl, Sphere } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";

/**
 * RIGHT — WINDOW / READING ZONE
 * 两扇圆拱窗下各一张长形无靠背沙发（深绿 + 白色串珠纹 + 深木圆腿）。
 * 沙发上的抱枕与玩偶是纯装饰，无交互。
 * 这一区不放 TV / Camera / Desk / Bookshelf / Chair；大型植物只在最右侧靠墙。
 */
const WINDOW_Z = [-2.2, 0.6];
const BENCH_X = 4.55;

export default function WindowZone() {
  return (
    <group>
      {WINDOW_Z.map((z) => (
        <WindowBench key={z} z={z} />
      ))}
      <Monstera />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 窗下长条无靠背沙发：约 1.5m */
function WindowBench({ z }: { z: number }) {
  const LEN = 1.5;
  const beads = Math.round(LEN / 0.11);

  return (
    <group position={[BENCH_X, 0, z]}>
      {/* 座板 */}
      <Box args={[0.45, 0.07, LEN]} position={[0, 0.44, 0]} color={P.deepBrown} roughness={0.72} />
      {/* 深木圆腿（6 条） */}
      {[-0.72, 0, 0.72].map((lz) =>
        [-0.15, 0.15].map((lx) => (
          <Cyl key={`${lz}-${lx}`} args={[0.028, 0.024, 0.4, 10]} position={[lx, 0.2, lz]} color={P.deepBrown} roughness={0.7} />
        )),
      )}
      {/* 深绿坐垫 */}
      <RoundedBox args={[0.42, 0.11, LEN - 0.06]} radius={0.04} smoothness={3} position={[0, 0.53, 0]} castShadow>
        <meshStandardMaterial color={P.green} roughness={0.94} />
      </RoundedBox>
      {/* 白色串圆珠花纹（细小、重复） */}
      {Array.from({ length: beads }, (_, i) => (
        <Sphere
          key={i}
          radius={0.012}
          position={[0.21, 0.53, -LEN / 2 + 0.06 + i * 0.11]}
          color={P.bead}
          roughness={0.6}
          castShadow={false}
        />
      ))}
      {/* 2 个抱枕 + 1 个小玩偶：纯装饰，不可点击 / 不可聚焦 / 无 Hover */}
      <group position={[0.13, 0.72, -0.42]} rotation={[0, 0, -0.25]}>
        <RoundedBox args={[0.16, 0.3, 0.34]} radius={0.05} smoothness={3} castShadow>
          <meshStandardMaterial color={P.bead} roughness={0.95} />
        </RoundedBox>
      </group>
      <group position={[0.13, 0.71, 0.08]} rotation={[0, 0, -0.25]}>
        <RoundedBox args={[0.16, 0.28, 0.32]} radius={0.05} smoothness={3} castShadow>
          <meshStandardMaterial color={P.brick} roughness={0.95} />
        </RoundedBox>
      </group>
      <group position={[0.1, 0.6, 0.52]}>
        <Sphere radius={0.075} position={[0, 0.07, 0]} color="#E5D5C0" roughness={0.95} />
        <Sphere radius={0.055} position={[0, 0.17, 0]} color="#E5D5C0" roughness={0.95} />
        <Sphere radius={0.022} position={[-0.04, 0.22, 0]} color="#E5D5C0" roughness={0.95} />
        <Sphere radius={0.022} position={[0.04, 0.22, 0]} color="#E5D5C0" roughness={0.95} />
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/** 大型 Monstera：只在最右侧靠墙，不挡两扇窗 */
function Monstera() {
  const leaves: { p: [number, number, number]; r: [number, number, number]; s: number; c: string }[] = [
    { p: [0, 0.95, 0.1], r: [0.2, 0.4, 0.2], s: 1, c: P.plant },
    { p: [0.16, 1.1, -0.08], r: [0.1, -0.5, -0.25], s: 0.9, c: P.plantDark },
    { p: [-0.18, 1.02, -0.02], r: [-0.15, 0.6, 0.3], s: 0.85, c: "#6b9a63" },
    { p: [0.05, 1.24, 0.05], r: [0.3, 0.1, -0.1], s: 0.8, c: P.plant },
    { p: [-0.1, 0.82, 0.16], r: [0.35, -0.3, 0.25], s: 0.75, c: P.plantDark },
    { p: [0.14, 0.78, 0.12], r: [0.25, 0.8, -0.2], s: 0.7, c: "#6b9a63" },
  ];

  return (
    <group position={[4.45, 0, 3.15]}>
      <Cyl args={[0.24, 0.19, 0.42, 20]} position={[0, 0.21, 0]} color="#c07a4a" roughness={0.85} />
      <Cyl args={[0.26, 0.26, 0.04, 20]} position={[0, 0.42, 0]} color="#a9643c" roughness={0.85} />
      <Cyl args={[0.02, 0.025, 0.7, 8]} position={[0, 0.72, 0]} color="#4c7148" roughness={0.9} />
      {leaves.map((leaf, i) => (
        <mesh key={i} position={leaf.p} rotation={leaf.r} scale={[0.2 * leaf.s, 0.26 * leaf.s, 0.05 * leaf.s]} castShadow>
          <sphereGeometry args={[1, 12, 10]} />
          <meshStandardMaterial color={leaf.c} roughness={0.92} />
        </mesh>
      ))}
      <Sphere radius={0.05} position={[0.2, 0.62, 0.1]} color={P.brick} roughness={0.8} />
    </group>
  );
}
