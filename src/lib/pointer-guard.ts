"use client";

/**
 * 区分「点击」和「拖拽旋转」：拖拽结束时不弹卡片。
 * 全局记录 pointerdown 坐标，点击时比较位移。
 */

let downX = 0;
let downY = 0;
let installed = false;
const THRESHOLD = 6;

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener(
    "pointerdown",
    (e) => {
      downX = e.clientX;
      downY = e.clientY;
    },
    true,
  );
}

install();

export function isRealClick(e: {
  nativeEvent?: { clientX?: number; clientY?: number };
}): boolean {
  const native = e?.nativeEvent;
  if (!native || typeof native.clientX !== "number" || typeof native.clientY !== "number") {
    return true;
  }
  return Math.hypot(native.clientX - downX, native.clientY - downY) < THRESHOLD;
}
