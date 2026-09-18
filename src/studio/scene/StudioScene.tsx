"use client";

import { Suspense, useMemo } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";

import CameraRig from "../camera/CameraRig";
import { BROWSE, ORBIT_LIMITS, STUDIO_VIEWS, orbitTargetFor } from "../camera/camera-director";
import type { DeviceProfile } from "../types";
import StudioEnvironment from "./StudioEnvironment";
import StudioLighting from "./StudioLighting";
import StudioObjects from "./StudioObjects";

export default function StudioScene({
  profile,
  onReady,
}: {
  profile: DeviceProfile;
  /** Canvas / WebGLRenderer 完成可显示初始化后回调（用于 Entry 遮罩解除） */
  onReady?: () => void;
}) {
  const high = profile.performance === "high";

  // 初始虚拟轴心：贴近相机，保证第一帧起就是「室内观察」模型
  const initialTarget = useMemo(
    () => orbitTargetFor(STUDIO_VIEWS.default.position, STUDIO_VIEWS.default.target),
    [],
  );

  return (
    <Canvas
      shadows={high}
      dpr={high ? [1, 1.8] : [1, 1.2]}
      gl={{ antialias: high, alpha: false, powerPreference: "high-performance" }}
      camera={{
        position: STUDIO_VIEWS.default.position,
        // 普通浏览：收窄到 55°，去掉超广角室内感；聚焦时由 CameraRig 平滑切到 68°
        fov: BROWSE.fov,
        near: 0.1,
        // 室内最大视距 ≈ 14；far 收敛到 60 提升深度缓冲精度、降低 z-fighting 风险
        far: 60,
      }}
      onCreated={({ gl, scene }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.background = new THREE.Color("#f4ddbd");
        // 雾效大幅减弱：房间内部（最大视距 ≈ 14）完全清晰，仅远处轻微柔化
        scene.fog = new THREE.Fog("#f4ddbd", 22, 60);
        // 等一帧，确保 Canvas 已完成首次绘制，Entry 遮罩再解除
        if (onReady) requestAnimationFrame(() => onReady());
      }}
    >
      <Suspense fallback={null}>
        <StudioEnvironment />
        <StudioObjects />
      </Suspense>

      <StudioLighting performance={profile.performance} />
      <CameraRig />

      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={ORBIT_LIMITS.dampingFactor}
        rotateSpeed={ORBIT_LIMITS.rotateSpeed}
        minDistance={BROWSE.minDistance}
        maxDistance={BROWSE.maxDistance}
        minPolarAngle={(BROWSE.minPolarDeg * Math.PI) / 180}
        maxPolarAngle={(BROWSE.maxPolarDeg * Math.PI) / 180}
        minAzimuthAngle={(-BROWSE.yawDeg * Math.PI) / 180}
        maxAzimuthAngle={(BROWSE.yawDeg * Math.PI) / 180}
        target={initialTarget}
      />
    </Canvas>
  );
}
