"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 地面拖拽 / 点击统一处理。
 *
 * 「点击是互动，拖拽是改变位置。」
 *   · pointerdown → 记录起点并暂时关闭 OrbitControls（避免相机跟着转）
 *   · 位移超过阈值 → 进入 drag：沿 y = floorY 平面移动，自动限制在房间边界内并
 *     推开家具障碍圆
 *   · 松手时若从未进入 drag → 判定为真实 click，触发 onClick
 *   · drag 期间绝不触发 onClick，也不播放音效
 *
 * 使用 window 级 pointermove / pointerup，保证指针移出物体后仍可继续拖拽，
 * 移动端触摸同样适用。
 */

const CLICK_THRESHOLD = 6;

export interface CircleObstacle {
  x: number;
  z: number;
  r: number;
}

export interface FloorDragConfig {
  /** 拖拽平面高度（默认地面 y = 0） */
  floorY?: number;
  minX?: number;
  maxX?: number;
  minZ?: number;
  maxZ?: number;
  /** 静态数组或实时读取的函数（用于动态障碍，如另一只宠物） */
  obstacles?: CircleObstacle[] | (() => CircleObstacle[]);
  enabled?: boolean;
  onDragStart?: () => void;
  onDragMove?: (x: number, z: number) => void;
  onDragEnd?: (x: number, z: number) => void;
  onClick?: () => void;
  onHoverChange?: (hovered: boolean) => void;
}

export function useFloorDrag(config: FloorDragConfig) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const controls = useThree((s) => s.controls) as unknown as {
    enabled: boolean;
  } | null;

  const cfgRef = useRef(config);
  cfgRef.current = config;

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), -(config.floorY ?? 0)),
    [config.floorY],
  );
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);

  const pressedRef = useRef(false);
  const draggingRef = useRef(false);
  const downRef = useRef({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  /** 把目标点限制在房间内并推出家具障碍圆 */
  const resolve = useCallback((x: number, z: number): [number, number] => {
    const c = cfgRef.current;
    const minX = c.minX ?? -4.5;
    const maxX = c.maxX ?? 4.5;
    const minZ = c.minZ ?? -3.5;
    const maxZ = c.maxZ ?? 3.5;
    let px = THREE.MathUtils.clamp(x, minX, maxX);
    let pz = THREE.MathUtils.clamp(z, minZ, maxZ);

    const obs = typeof c.obstacles === "function" ? c.obstacles() : c.obstacles ?? [];
    for (const o of obs) {
      const dx = px - o.x;
      const dz = pz - o.z;
      const d = Math.hypot(dx, dz);
      if (d < o.r) {
        if (d < 1e-4) {
          px = o.x + o.r;
        } else {
          px = o.x + (dx / d) * o.r;
          pz = o.z + (dz / d) * o.r;
        }
        px = THREE.MathUtils.clamp(px, minX, maxX);
        pz = THREE.MathUtils.clamp(pz, minZ, maxZ);
      }
    }
    return [px, pz];
  }, []);

  const pointToFloor = useCallback(
    (clientX: number, clientY: number): THREE.Vector3 | null => {
      const rect = gl.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;
      ndc.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(ndc, camera);
      return raycaster.ray.intersectPlane(plane, hit) ? hit : null;
    },
    [camera, gl, hit, ndc, plane, raycaster],
  );

  const finish = useCallback(
    (clientX: number, clientY: number) => {
      const wasDragging = draggingRef.current;
      const wasPressed = pressedRef.current;
      pressedRef.current = false;
      draggingRef.current = false;

      if (controls) controls.enabled = true;

      if (wasDragging) {
        setDragging(false);
        const p = pointToFloor(clientX, clientY);
        if (p) {
          const [x, z] = resolve(p.x, p.z);
          cfgRef.current.onDragEnd?.(x, z);
        } else {
          cfgRef.current.onDragEnd?.(NaN, NaN);
        }
      } else if (wasPressed) {
        cfgRef.current.onClick?.();
      }
    },
    [controls, pointToFloor, resolve],
  );

  useEffect(
    () => () => {
      if (controls) controls.enabled = true;
    },
    [controls],
  );

  const onPointerDown = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (e.nativeEvent.button !== undefined && e.nativeEvent.button !== 0) return;
      // 始终拦截，避免点击被拖拽 / 跑动中的宠物穿透到后方物体
      e.stopPropagation();
      if (cfgRef.current.enabled === false) return;

      pressedRef.current = true;
      draggingRef.current = false;
      downRef.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
      // 立即锁定相机，避免按下宠物时 OrbitControls 跟着旋转
      if (controls) controls.enabled = false;

      const onMove = (ev: PointerEvent) => {
        if (!pressedRef.current) return;
        const dist = Math.hypot(
          ev.clientX - downRef.current.x,
          ev.clientY - downRef.current.y,
        );
        if (!draggingRef.current && dist > CLICK_THRESHOLD) {
          draggingRef.current = true;
          setDragging(true);
          cfgRef.current.onDragStart?.();
        }
        if (draggingRef.current) {
          const p = pointToFloor(ev.clientX, ev.clientY);
          if (p) {
            const [x, z] = resolve(p.x, p.z);
            cfgRef.current.onDragMove?.(x, z);
          }
        }
      };

      const onUp = (ev: PointerEvent) => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        finish(ev.clientX, ev.clientY);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [controls, finish, pointToFloor, resolve],
  );

  const onPointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    if (draggingRef.current) return;
    e.stopPropagation();
    cfgRef.current.onHoverChange?.(true);
  }, []);

  const onPointerOut = useCallback(() => {
    if (draggingRef.current) return;
    cfgRef.current.onHoverChange?.(false);
  }, []);

  /**
   * 真实点击动作由上面的 window pointerup 处理（用于 click / drag 区分）。
   * 这里额外拦截 R3F 的 click 事件，防止点击宠物时穿透到身后的物体
   * （例如中央地毯），保证宠物与地毯是彼此独立的 hit target。
   */
  const onClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
  }, []);

  return {
    dragging,
    handlers: { onPointerDown, onPointerOver, onPointerOut, onClick },
  };
}
