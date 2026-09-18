"use client";

import type { ReactNode } from "react";
import * as THREE from "three";

interface BaseProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  roughness?: number;
  metalness?: number;
  emissive?: string;
  emissiveIntensity?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  children?: ReactNode;
}

/**
 * 共享 geometry / material 缓存。
 * 相同参数的 primitive 复用同一份 BufferGeometry / MeshStandardMaterial，
 * 显著减少几何体与材质数量、降低显存与绘制开销。
 * 使用 `dispose={null}` 关闭 R3F 的自动销毁，避免共享资源被单个 mesh 卸载时误销毁。
 */
const geoCache = new Map<string, THREE.BufferGeometry>();
function cachedGeometry(key: string, make: () => THREE.BufferGeometry): THREE.BufferGeometry {
  let geo = geoCache.get(key);
  if (!geo) {
    geo = make();
    geoCache.set(key, geo);
  }
  return geo;
}

const matCache = new Map<string, THREE.MeshStandardMaterial>();
function cachedMaterial(opts: {
  color: string;
  roughness: number;
  metalness: number;
  emissive: string;
  emissiveIntensity: number;
  side?: THREE.Side;
}): THREE.MeshStandardMaterial {
  const key = `${opts.color}|${opts.roughness}|${opts.metalness}|${opts.emissive}|${opts.emissiveIntensity}|${opts.side ?? "front"}`;
  let mat = matCache.get(key);
  if (!mat) {
    mat = new THREE.MeshStandardMaterial({
      color: opts.color,
      roughness: opts.roughness,
      metalness: opts.metalness,
      emissive: opts.emissive,
      emissiveIntensity: opts.emissiveIntensity,
      side: opts.side,
    });
    matCache.set(key, mat);
  }
  return mat;
}

export function Box({
  position,
  rotation,
  color,
  roughness = 0.78,
  metalness = 0.04,
  emissive,
  emissiveIntensity,
  castShadow = true,
  receiveShadow = true,
  args,
}: BaseProps & { args: [number, number, number] }) {
  const geometry = cachedGeometry(`box:${args[0]},${args[1]},${args[2]}`, () => new THREE.BoxGeometry(...args));
  const material = cachedMaterial({
    color,
    roughness,
    metalness,
    emissive: emissive ?? "#000000",
    emissiveIntensity: emissive ? emissiveIntensity ?? 0.6 : 0,
  });
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      dispose={null}
    />
  );
}

export function Cyl({
  position,
  rotation,
  color,
  roughness = 0.6,
  metalness = 0.2,
  emissive,
  emissiveIntensity,
  castShadow = true,
  receiveShadow = true,
  args,
  openEnded = false,
  side,
}: BaseProps & {
  args: [number, number, number, number];
  openEnded?: boolean;
  side?: THREE.Side;
}) {
  const geometry = cachedGeometry(
    `cyl:${args[0]},${args[1]},${args[2]},${args[3]},${openEnded}`,
    () => new THREE.CylinderGeometry(args[0], args[1], args[2], args[3], 1, openEnded),
  );
  const material = cachedMaterial({
    color,
    roughness,
    metalness,
    emissive: emissive ?? "#000000",
    emissiveIntensity: emissive ? emissiveIntensity ?? 0.6 : 0,
    side,
  });
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      dispose={null}
    />
  );
}

export function Sphere({
  position,
  color,
  roughness = 0.85,
  metalness = 0.05,
  emissive,
  emissiveIntensity,
  castShadow = true,
  receiveShadow = true,
  radius = 0.3,
  segments = 20,
}: BaseProps & { radius?: number; segments?: number }) {
  const geometry = cachedGeometry(
    `sphere:${radius},${segments}`,
    () => new THREE.SphereGeometry(radius, segments, segments),
  );
  const material = cachedMaterial({
    color,
    roughness,
    metalness,
    emissive: emissive ?? "#000000",
    emissiveIntensity: emissive ? emissiveIntensity ?? 0.6 : 0,
  });
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={position}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      dispose={null}
    />
  );
}
