"use client";

import { useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { isRealClick } from "@/lib/pointer-guard";
import { playTone } from "@/lib/sound";
import { photoById, photoIndexOf } from "../data/photography";
import { useStudioStore } from "../store/studio-store";
import type { StudioObjectId } from "../types";

type InteractionMode = "info" | "focus" | "action";

interface InteractiveObjectProps {
  id: StudioObjectId;
  children: ReactNode;
  /**
   * info（默认）→ 两段式：第一次聚焦，第二次打开 Overlay
   * focus         → 只聚焦放大，不打开 Overlay
   * action        → 点击直接触发 onActivate（特殊动作物体），不聚焦、不打开 Overlay
   */
  mode?: InteractionMode;
  /** action 模式的点击回调（真实点击、未锁定时触发） */
  onActivate?: () => void;
}

/**
 * 所有可交互 3D 物体的统一外壳。
 *
 * Hover        → 仅视觉反馈（轻微放大 / 上浮 + pointer），**无文字 / Tooltip / 悬浮光点**
 * info         → 第一次点击只做 Camera Director Focus；第二次点击打开 Overlay
 * focus        → 只聚焦放大，不打开 Overlay
 * action       → 点击直接触发特殊动作（狗 / 猫 / 电扇 / 电脑椅 / 灯具 …）
 *
 * 物体本身只负责「长什么样」，交互行为全部收在这里。
 * 注：按需求已移除所有黄色悬浮点，仅保留 hover 视觉反馈。
 */
export default function InteractiveObject({
  id,
  children,
  mode = "info",
  onActivate,
}: InteractiveObjectProps) {
  const focusObject = useStudioStore((s) => s.focusObject);
  const activateObject = useStudioStore((s) => s.activateObject);
  const activatePhoto = useStudioStore((s) => s.activatePhoto);
  const exitFocus = useStudioStore((s) => s.exitFocus);
  const setHovered = useStudioStore((s) => s.setHovered);
  const hovered = useStudioStore((s) => s.hoveredObject === id);
  const active = useStudioStore((s) => s.activeObject === id);
  const focused = useStudioStore((s) => s.focusedObject === id);
  /** interaction lock：Overlay / Gallery 打开时锁定 3D 交互（复用同一套 store 状态） */
  const locked = useStudioStore(
    (s) => s.galleryIndex !== null || s.overlayOpen,
  );

  const groupRef = useRef<THREE.Group>(null);

  const highlight = !locked && (hovered || active || focused);

  useFrame(() => {
    if (groupRef.current) {
      const targetScale = highlight ? 1.035 : 1;
      const s = THREE.MathUtils.lerp(groupRef.current.scale.x, targetScale, 0.12);
      groupRef.current.scale.setScalar(s);
      const targetY = highlight ? 0.025 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY,
        0.12,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={(e) => {
        if (locked) return;
        e.stopPropagation();
        setHovered(id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        if (locked) return;
        e.stopPropagation();
        setHovered(null);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (locked) return;
        if (!isRealClick(e)) return;

        // 特殊动作物体：点击直接触发，不聚焦、不打开 Overlay
        if (mode === "action") {
          onActivate?.();
          return;
        }

        // 已处于 FOCUSED（信息已关闭）→ 再次点击 = 退出聚焦，恢复默认镜头
        if (focused) {
          playTone("close");
          exitFocus();
          return;
        }

        playTone("open");

        // 聚焦标签（无信息）：只聚焦放大
        if (mode === "focus") {
          focusObject(id);
          return;
        }

        // 有信息的物品：一次点击 = Camera 聚焦 + 居中信息弹出
        const photo = photoById(id);
        if (photo) activatePhoto(id, photoIndexOf(photo.id));
        else activateObject(id);
      }}
    >
      {children}
    </group>
  );
}
