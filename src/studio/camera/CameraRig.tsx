"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import {
  BROWSE,
  FOCUS_FOV,
  FOCUS_LIMITS,
  LOOK_RADIUS,
  STUDIO_VIEWS,
  resolveView,
} from "./camera-director";
import { useStudioStore } from "../store/studio-store";

interface OrbitLike {
  target: THREE.Vector3;
  enabled: boolean;
  update: () => void;
  minAzimuthAngle: number;
  maxAzimuthAngle: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  minDistance: number;
  maxDistance: number;
  rotateSpeed: number;
}

const DEG = Math.PI / 180;

/**
 * Camera Director 的执行者。
 *
 * · 聚焦（点击物体）：相机平滑送到对应站位，轴心贴近相机 → 原地环视。
 * · 浏览（default）：轴心放到房间内部观察中心 → 左右拖动时相机沿浅 U 型轨迹移动，
 *   房间内部始终居中，不会转到没有墙的一面。
 *
 * 两种模式共用同一套 Camera Director / OrbitControls，互不覆盖。
 */
export default function CameraRig() {
  const cameraTarget = useStudioStore((s) => s.cameraTarget);
  const cameraTick = useStudioStore((s) => s.cameraTick);
  const cameraOverride = useStudioStore((s) => s.cameraOverride);

  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as OrbitLike | null;

  const desiredPosition = useRef(
    new THREE.Vector3(...STUDIO_VIEWS.default.position),
  );
  const desiredLook = useRef(new THREE.Vector3(...STUDIO_VIEWS.default.target));
  const lookPoint = useRef(new THREE.Vector3(...STUDIO_VIEWS.default.target));
  const flying = useRef(false);

  useEffect(() => {
    // cameraOverride 优先：用于关闭 Overlay / Gallery 后回到打开前的机位
    const view = cameraOverride ?? resolveView(cameraTarget);
    desiredPosition.current.set(...view.position);
    desiredLook.current.set(...view.target);
    flying.current = true;
  }, [cameraTarget, cameraTick, cameraOverride]);

  useFrame((_, delta) => {
    if (!flying.current) return;

    const dt = Math.min(delta, 0.05);
    const k = 1 - Math.exp(-7 * dt);
    const browse = cameraTarget === "default";
    const targetFov = browse ? BROWSE.fov : FOCUS_FOV;

    if (controls) controls.enabled = false;

    camera.position.lerp(desiredPosition.current, k);
    lookPoint.current.lerp(desiredLook.current, k);
    camera.lookAt(lookPoint.current);
    // FOV 随浏览 / 聚焦平滑切换，不破坏聚焦取景
    const persp = camera as THREE.PerspectiveCamera;
    persp.fov = THREE.MathUtils.lerp(persp.fov, targetFov, k);
    persp.updateProjectionMatrix();

    if (camera.position.distanceTo(desiredPosition.current) < 0.012) {
      camera.position.copy(desiredPosition.current);
      camera.lookAt(desiredLook.current);
      persp.fov = targetFov;
      persp.updateProjectionMatrix();

      if (controls) {

        if (browse) {
          // 浅 U 型浏览：轴心放到房间内部观察中心，左右拖动产生横向位移
          controls.target.set(...BROWSE.pivot);
          controls.minAzimuthAngle = -BROWSE.yawDeg * DEG;
          controls.maxAzimuthAngle = BROWSE.yawDeg * DEG;
          controls.minPolarAngle = BROWSE.minPolarDeg * DEG;
          controls.maxPolarAngle = BROWSE.maxPolarDeg * DEG;
          // 远轴心每度位移更大，降低灵敏度以保持顺滑的拖拽手感
          controls.rotateSpeed = 0.3;
        } else {
          // 聚焦：轴心贴近相机，原地环视
          controls.target
            .copy(desiredLook.current)
            .sub(desiredPosition.current)
            .normalize()
            .multiplyScalar(LOOK_RADIUS)
            .add(desiredPosition.current);
          controls.minAzimuthAngle = FOCUS_LIMITS.minAzimuthAngle;
          controls.maxAzimuthAngle = FOCUS_LIMITS.maxAzimuthAngle;
          controls.minPolarAngle = FOCUS_LIMITS.minPolarAngle;
          controls.maxPolarAngle = FOCUS_LIMITS.maxPolarAngle;
          controls.rotateSpeed = 0.6;
        }

        controls.minDistance = BROWSE.minDistance;
        controls.maxDistance = BROWSE.maxDistance;

        controls.update();
        controls.enabled = true;
      }

      flying.current = false;
    }
  });

  return null;
}
