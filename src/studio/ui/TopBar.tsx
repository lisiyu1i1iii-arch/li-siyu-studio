"use client";

import { useEffect, useState } from "react";
import { Menu, Volume2, VolumeX, X } from "lucide-react";

import {
  isSoundEnabled,
  playTone,
  setSoundEnabled as persistSoundEnabled,
  startBgm,
  stopBgm,
} from "@/lib/sound";
import { useStudioStore } from "../store/studio-store";

/** 顶部极简 UI：品牌 / MENU / SOUND */
export default function TopBar() {
  const menuOpen = useStudioStore((s) => s.menuOpen);
  const toggleMenu = useStudioStore((s) => s.toggleMenu);
  const soundEnabled = useStudioStore((s) => s.soundEnabled);
  const setSoundEnabled = useStudioStore((s) => s.setSoundEnabled);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 显式赋值同步（幂等）：以 localStorage 的真实开关为准。
    // 不能用 toggleSound()——它是相对切换，StrictMode 下 effect 执行两次会翻转回原值。
    setSoundEnabled(isSoundEnabled());
  }, [setSoundEnabled]);

  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-6">
      <div className="pointer-events-auto flex items-baseline gap-2">
        <span className="font-serif text-lg tracking-[0.18em] text-studio-ink">
          LI SIYU
        </span>
        <span className="hidden text-[10px] uppercase tracking-[0.35em] text-studio-ink-soft/70 sm:inline">
          My Little Studio
        </span>
      </div>

      <div className="pointer-events-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => {
            playTone("click");
            toggleMenu();
          }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-studio-ink transition-colors hover:bg-studio-ink/5"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          <span className="hidden sm:inline">Menu</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            persistSoundEnabled(next);
            if (next) {
              playTone("click");
              startBgm();
            } else {
              stopBgm();
            }
          }}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-studio-ink transition-colors hover:bg-studio-ink/5"
          aria-label={soundEnabled ? "关闭声音" : "打开声音"}
        >
          {mounted && soundEnabled ? (
            <Volume2 className="h-4 w-4" />
          ) : (
            <VolumeX className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Sound</span>
        </button>
      </div>
    </header>
  );
}
