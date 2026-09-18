"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import { playTone } from "@/lib/sound";
import { useStudioStore } from "../store/studio-store";

/**
 * 放大状态下的【退出放大 / 返回】按钮。
 * 仅在第一次点击聚焦后出现；点击后恢复进入放大前的视角。
 */
export default function FocusExitButton() {
  const focusedObject = useStudioStore((s) => s.focusedObject);
  const overlayOpen = useStudioStore((s) => s.overlayOpen);
  const galleryIndex = useStudioStore((s) => s.galleryIndex);
  const exitFocus = useStudioStore((s) => s.exitFocus);

  const visible = Boolean(focusedObject) && !overlayOpen && galleryIndex === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="focus-exit"
          type="button"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          onClick={() => {
            playTone("close");
            exitFocus();
          }}
          className="absolute left-1/2 top-5 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full border border-studio-ink/15 bg-studio-cream/90 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.22em] text-studio-ink shadow-lg backdrop-blur-xl transition-colors hover:bg-studio-sun/20"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回
        </motion.button>
      )}
    </AnimatePresence>
  );
}
