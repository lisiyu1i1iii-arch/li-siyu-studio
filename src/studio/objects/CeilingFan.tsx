"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import InteractiveObject from "./InteractiveObject";
import { Box, Cyl } from "./primitives";

/**
 * 复古简约木质吊扇：安装在屋顶横梁上（整体下移，默认镜头下清晰可见）。
 *
 * 点击循环（4 阶段）：
 *   初始速度 → 加速 → 更快 → 缓慢减速至停止 → 恢复初始速度 → …
 * 停止状态保持不动，直到下一次点击。电扇本体是 InteractiveObject，
 * 但点击只改变速度，不打开 Overlay、不聚焦。
 */
const INITIAL_SPEED = 0.9;
const SPEEDS = [INITIAL_SPEED, 3.0, 6.5, 0];

export default function CeilingFan() {
  const bladesRef = useRef<THREE.Group>(null);
  const phaseRef = useRef(0);
  const speedRef = useRef(INITIAL_SPEED);

  useFrame((_, delta) => {
    if (!bladesRef.current) return;
    const target = SPEEDS[phaseRef.current];
    // 停止阶段用更小的 lambda → 慢慢停下；加速阶段响应更快
    const lambda = target === 0 ? 1.5 : target > speedRef.current ? 2.4 : 2.8;
    speedRef.current = THREE.MathUtils.damp(speedRef.current, target, lambda, delta);
    bladesRef.current.rotation.y += delta * speedRef.current;
  });

  const advancePhase = () => {
    phaseRef.current = (phaseRef.current + 1) % SPEEDS.length;
  };

  return (
    // 整体下移，使默认镜头下能清楚看到；吊杆加长，顶端仍在横梁之下（不穿模）
    <group position={[0, 3.55, 0]}>
      {/* 吊杆 + 顶座（固定在横梁 / 屋脊），不随交互缩放 */}
      <Cyl args={[0.02, 0.02, 2.25, 10]} position={[0, 1.15, 0]} color="#6b4a33" roughness={0.7} />
      <Box args={[0.18, 0.09, 0.18]} position={[0, 2.28, 0]} color="#6b4a33" roughness={0.7} />

      {/* 电扇本体：可点击，整体放大 1.3 倍（仍远离横梁） */}
      <InteractiveObject id="fan" mode="action" onActivate={advancePhase}>
        <group scale={1.3}>
          {/* 电机外壳 */}
          <Cyl args={[0.15, 0.17, 0.24, 20]} position={[0, 0.02, 0]} color="#5A3826" roughness={0.6} metalness={0.2} />
          <Cyl args={[0.09, 0.09, 0.1, 14]} position={[0, -0.14, 0]} color="#6b4a33" roughness={0.6} />

          {/* 扇叶（随速度循环旋转） */}
          <group ref={bladesRef} position={[0, -0.04, 0]}>
            {[0, 1, 2, 3].map((i) => {
              const a = (i / 4) * Math.PI * 2;
              return (
                <group key={i} rotation={[0, a, 0]}>
                  <mesh position={[0.55, 0, 0]} rotation={[0.12, 0, 0]} castShadow>
                    <boxGeometry args={[0.78, 0.022, 0.2]} />
                    <meshStandardMaterial color="#8a5a3a" roughness={0.82} />
                  </mesh>
                </group>
              );
            })}
          </group>
        </group>
      </InteractiveObject>
    </group>
  );
}
