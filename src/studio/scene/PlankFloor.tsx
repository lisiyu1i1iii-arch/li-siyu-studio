"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { STUDIO_PALETTE as P } from "../data/studio-content";

/**
 * 暖棕色长条实木地板（running-bond / 错缝工字拼，程序化，无外部图片）。
 *
 * 与上一版 Herringbone 不同：这里使用**长条板材 + 逐行错缝**（工字拼），
 * 板面平整、连续、无碎片感。
 *
 * 平整原则：
 *   · 单一连续木质基底（StudioEnvironment 地台，顶面 y = 0）
 *   · 板材为**无厚度 PlaneGeometry**，全部位于 y = 0.001，近乎共面，无高低差
 *   · 板缝仅 4mm，露出略深的同色基底，形成均匀、清晰的细缝，而非黑色沟壑
 *
 * 性能：1 个共享 PlaneGeometry + 1 个共享 MeshStandardMaterial（含 1 张小尺寸
 * 程序化直纹木纹贴图），全部板材合并为单个 InstancedMesh（1 次 draw call）。
 */

const ROOM_W = 10;
const ROOM_D = 8;

const PLANK_L = 1.3; // 板长
const PLANK_W = 0.17; // 板宽
const GAP = 0.004; // 均匀细缝
const SURFACE_Y = 0.001; // 近乎共面
const SHADE_AMP = 0.018; // ±1.8% 轻微色差

interface Plank {
  x: number;
  z: number;
  shade: number;
}

/**
 * 竖向长条板 + 错缝（running-bond）：
 * 木板长边沿世界 Z（入口 → 房间深处），逐列沿 X 错缝半块板。
 */
function buildPlanks(): Plank[] {
  const planks: Plank[] = [];
  const halfW = ROOM_W / 2;
  const halfD = ROOM_D / 2;
  const cols = Math.ceil(ROOM_W / PLANK_W) + 2;
  const rows = Math.ceil(ROOM_D / PLANK_L) + 3;

  for (let c = -1; c < cols; c++) {
    const x = -halfW + (c + 0.5) * PLANK_W;
    if (Math.abs(x) > halfW + PLANK_W) continue;
    const offset = c % 2 === 0 ? 0 : PLANK_L / 2;
    for (let k = -2; k < rows; k++) {
      const z = -halfD + k * PLANK_L + offset + PLANK_L / 2;
      if (Math.abs(z) > halfD + PLANK_L) continue;
      planks.push({ x, z, shade: ((c * 7 + k * 13) % 5) - 2 });
    }
  }
  return planks;
}

const PLANKS = buildPlanks();
const BASE_COLOR = new THREE.Color(P.floorWood);

/** 小尺寸程序化直纹木纹（白底 + 深浅细纹，沿板长方向） */
function makeGrainTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const S = 256;
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, S, S);

  // 深色直纹
  for (let i = 0; i < 90; i++) {
    const y = Math.random() * S;
    const h = 0.6 + Math.random() * 1.8;
    ctx.fillStyle = `rgba(70,42,24,${0.03 + Math.random() * 0.07})`;
    ctx.fillRect(0, y, S, h);
  }
  // 少量浅色高光纹
  for (let i = 0; i < 50; i++) {
    const y = Math.random() * S;
    ctx.fillStyle = `rgba(235,205,165,${0.03 + Math.random() * 0.05})`;
    ctx.fillRect(0, y, S, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  return tex;
}

export default function PlankFloor() {
  const ref = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(
    () => new THREE.PlaneGeometry(PLANK_L - GAP, PLANK_W - GAP),
    [],
  );
  const material = useMemo(() => {
    const map = makeGrainTexture();
    return new THREE.MeshStandardMaterial({
      color: "#ffffff",
      map: map ?? undefined,
      roughness: 0.84,
      metalness: 0.02,
    });
  }, []);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    PLANKS.forEach((plank, index) => {
      dummy.position.set(plank.x, SURFACE_Y, plank.z);
      // 放平（法线 +Y），长边沿世界 Z（入口 → 房间深处）
      dummy.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(index, dummy.matrix);

      color.copy(BASE_COLOR).offsetHSL(0, 0, plank.shade * SHADE_AMP);
      mesh.setColorAt(index, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, []);

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, PLANKS.length]}
      receiveShadow
    />
  );
}
