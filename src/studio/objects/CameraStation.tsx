"use client";

import { useMemo } from "react";
import * as THREE from "three";

import InteractiveObject from "./InteractiveObject";
import { Box, Cyl, Sphere } from "./primitives";
import { STUDIO_PALETTE as P } from "../data/studio-content";

/**
 * Desk 左侧 · 三脚架相机（WORKS）
 *
 * 真实三脚架结构：central hub —— 三条腿从中心向外张开、接触地面，
 * 形成明显的三角支撑与前后景深。相机机身位于 hub 上方，整体高度约 1.24m。
 */
const HUB_Y = 1.02;
const LEG_FLOOR_RADIUS = 0.4;
const LEG_TOP_RADIUS = 0.03;
const LEG_TOP = new THREE.Vector3(0, 1, 0);

export default function CameraStation() {
  // 随工作区一起右移，仍位于 Desk 左前方；朝向中央生活区（约 0, 0.7）
  const rotY = Math.atan2(0 - 1.15, 0.7 - -2.7);

  return (
    <InteractiveObject id="camera">
      <group position={[1.15, 0, -2.7]} rotation={[0, rotY, 0]}>
        {/* 三条外张的腿 */}
        {[0, 1, 2].map((i) => (
          <TripodLeg key={i} azimuth={(i * Math.PI * 2) / 3} />
        ))}

        {/* central hub */}
        <Cyl args={[0.05, 0.055, 0.16, 14]} position={[0, HUB_Y, 0]} color="#3a3f4b" roughness={0.4} metalness={0.6} />
        {/* hub → camera mount 的中轴 */}
        <Cyl args={[0.022, 0.022, 0.2, 10]} position={[0, HUB_Y + 0.18, 0]} color="#3a3f4b" roughness={0.4} metalness={0.6} />

        {/* 相机机身 */}
        <Box args={[0.3, 0.22, 0.17]} position={[0, 1.24, 0]} color="#2b2f3a" roughness={0.5} metalness={0.2} />
        <Box args={[0.09, 0.07, 0.05]} position={[0, 1.35, 0]} color="#3a3f4b" roughness={0.5} />
        <Cyl
          args={[0.085, 0.085, 0.15, 20]}
          position={[0, 1.23, 0.15]}
          rotation={[Math.PI / 2, 0, 0]}
          color="#1f232c"
          roughness={0.35}
          metalness={0.6}
        />
        <Sphere radius={0.05} position={[0, 1.23, 0.22]} color={P.screen} roughness={0.2} metalness={0.7} />
        <Box args={[0.05, 0.05, 0.03]} position={[0.09, 1.37, 0]} color={P.ember} roughness={0.5} />
      </group>
    </InteractiveObject>
  );
}

/* ------------------------------------------------------------------ */
/** 单条腿：从 hub 中心向外、向下延伸，末端接触地面 y=0 */
function TripodLeg({ azimuth }: { azimuth: number }) {
  const { position, quaternion, length } = useMemo(() => {
    const top = new THREE.Vector3(
      Math.sin(azimuth) * LEG_TOP_RADIUS,
      HUB_Y,
      Math.cos(azimuth) * LEG_TOP_RADIUS,
    );
    const bottom = new THREE.Vector3(
      Math.sin(azimuth) * LEG_FLOOR_RADIUS,
      0,
      Math.cos(azimuth) * LEG_FLOOR_RADIUS,
    );
    const dir = bottom.clone().sub(top);
    const len = dir.length();
    const mid = top.clone().add(bottom).multiplyScalar(0.5);
    const q = new THREE.Quaternion().setFromUnitVectors(
      LEG_TOP,
      dir.clone().normalize(),
    );
    return { position: mid, quaternion: q, length: len };
  }, [azimuth]);

  return (
    <mesh position={position} quaternion={quaternion} castShadow>
      <cylinderGeometry args={[0.017, 0.022, length, 10]} />
      <meshStandardMaterial color="#3a3f4b" roughness={0.45} metalness={0.55} />
    </mesh>
  );
}
