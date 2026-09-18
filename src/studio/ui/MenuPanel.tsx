"use client";

import { AnimatePresence, motion } from "framer-motion";

import { playTone } from "@/lib/sound";
import { useStudioStore } from "../store/studio-store";
import type { SectionKey } from "../types";

/**
 * 右上角 MENU：只保留
 *   · 作品集合（统一展示摄影 / 视觉设计 / 影像 / 推文）
 *   · CONNECT
 *   · BACK TO ROOM
 * 排版统一：左侧中文 / 右侧英文。
 */
const MENU_ITEMS: { key: SectionKey; label: string; caption: string }[] = [
  { key: "collection", label: "作品集合", caption: "EXPLORE" },
  { key: "contact", label: "联系我", caption: "CONNECT" },
];

export default function MenuPanel() {
  const menuOpen = useStudioStore((s) => s.menuOpen);
  const openSection = useStudioStore((s) => s.openSection);
  const returnToRoom = useStudioStore((s) => s.returnToRoom);

  const open = (section: SectionKey) => {
    playTone("open");
    openSection(section);
  };

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="absolute right-4 top-[68px] z-40 w-[min(340px,92vw)] overflow-hidden rounded-2xl border border-studio-ink/10 bg-studio-cream/95 shadow-2xl backdrop-blur-xl sm:right-8"
          aria-label="主导航"
        >
          <ul className="divide-y divide-studio-ink/5">
            {MENU_ITEMS.map((item) => (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => open(item.key)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-studio-sun/10"
                >
                  <span className="text-sm font-medium text-studio-ink">
                    {item.label}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-studio-ink-soft/60">
                    {item.caption}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => {
              playTone("click");
              returnToRoom();
            }}
            className="w-full border-t border-studio-ink/10 px-5 py-3 text-left text-[11px] uppercase tracking-[0.25em] text-studio-ink-soft transition-colors hover:bg-studio-sun/10 hover:text-studio-ink"
          >
            BACK TO ROOM
          </button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
