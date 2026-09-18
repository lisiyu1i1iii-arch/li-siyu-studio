"use client";

import { useEffect, useState } from "react";

import type { DeviceProfile } from "../types";

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    return Boolean(gl);
  } catch {
    return false;
  }
}

function detectMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const coarse = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const small = window.innerWidth < 820;
  return /Android|iPhone|iPad|iPod|Mobile|Windows Phone/i.test(ua) || (coarse && small);
}

/**
 * 设备能力检测：WebGL 是否可用、是否移动端、要不要进入低性能模式。
 * 首帧返回 null，避免 SSR / 客户端不一致。
 */
export function useDeviceProfile(): DeviceProfile | null {
  const [profile, setProfile] = useState<DeviceProfile | null>(null);

  useEffect(() => {
    const webgl = detectWebGL();
    const mobile = detectMobile();

    const cores =
      typeof navigator.hardwareConcurrency === "number"
        ? navigator.hardwareConcurrency
        : 4;
    const memory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const reducedMotion =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    const low = mobile || cores <= 4 || memory <= 4 || reducedMotion;

    setProfile({
      webgl,
      mobile,
      performance: low ? "low" : "high",
    });
  }, []);

  return profile;
}
