"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { preloadBgm, startBgm } from "@/lib/sound";

import { useStudioStore } from "../store/studio-store";
import EntryContactModal from "./EntryContactModal";

/** 纯装饰性的短状态文案，不阻塞入口 */
const MESSAGES = [
  "Preparing the studio...",
  "Making coffee...",
  "Opening the windows...",
];

/**
 * PAGE 1 — ENTRY / LANDING
 *
 * 独立于 PAGE 2 的 3D Studio 初始化：
 * 不读取 profile / WebGL / StudioScene 的任何状态，也不等待它们。
 * 圆拱门与所有文字**首帧即可见、可点**。
 *
 * 本页只有两个 Interactive Object：
 *   · Arch Door → 进入 Studio
 *   · Mailbox   → 打开居中 Contact Modal（不进入 Studio）
 */
export default function LoadingScreen({ ready = true }: { ready?: boolean }) {
  const enter = useStudioStore((s) => s.enter);
  // 点击 ENTER 成功进入小屋后播放唯一 BGM 实例（浏览器拒绝时静默降级）
  const handleEnter = () => {
    startBgm();
    enter();
  };
  const [step, setStep] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const done = step >= MESSAGES.length;

  // 只负责把状态文案走完，不参与任何「能不能进入」的判断
  useEffect(() => {
    if (done) return;
    const timer = window.setTimeout(() => setStep((s) => s + 1), 450);
    return () => window.clearTimeout(timer);
  }, [step, done]);

  // 进入 Studio 前提前缓冲 BGM，避免点击 ENTER 后才开始下载导致的播放卡顿
  useEffect(() => {
    preloadBgm();
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-5 overflow-hidden bg-studio-paper px-6 text-center"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* 墙面纹理 + 暖光 */}
      <div
        className="studio-grain pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(240,164,74,0.22),transparent_62%)]"
        aria-hidden
      />

      {/* 品牌 */}
      <div className="relative space-y-2">
        <p className="text-[11px] uppercase tracking-[0.5em] text-studio-ink-soft/70">
          My Little Studio
        </p>
        <h1 className="font-serif text-3xl tracking-tight text-studio-ink sm:text-4xl">
          LI SIYU
        </h1>
      </div>

      {/* 圆拱门 —— 唯一进入 Studio 的入口（首帧可见、可点）；旁边是 CONTACT 信箱 */}
      <div className="relative">
        <ArchDoor onEnter={handleEnter} ready={ready} />
        <EntryMailbox onOpenContact={() => setContactOpen(true)} />
      </div>

      {/* 状态 / 提示（纯文字，不是交互对象） */}
      <div className="relative flex h-6 items-center">
        <p className="text-sm text-studio-ink-soft">
          {done
            ? ready
              ? "点击门，进入工作室"
              : "正在准备工作室…"
            : MESSAGES[step]}
        </p>
      </div>

      {/* 居中的联系方式 Modal（Entry 专属；不进入 Studio） */}
      <EntryContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/** 圆拱形木门：门框 + 门板 + 黄铜把手 + 暖光 + 门口绿植 */
function ArchDoor({ onEnter, ready }: { onEnter: () => void; ready: boolean }) {
  return (
    <button
      type="button"
      onClick={onEnter}
      disabled={!ready}
      aria-disabled={!ready}
      aria-label="进入工作室"
      className={`group relative h-[236px] w-[148px] outline-none transition-transform duration-300 sm:h-[296px] sm:w-[186px] ${
        ready
          ? "hover:-translate-y-1 active:scale-[0.99]"
          : "cursor-wait opacity-80"
      }`}
    >
      {/* 门后的暖光 */}
      <span
        className="pointer-events-none absolute -inset-12 rounded-full bg-[radial-gradient(circle,rgba(240,164,74,0.42),transparent_68%)] opacity-70 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />

      {/* 门框（深木） */}
      <span className="absolute inset-0 rounded-t-full bg-[#4a3121] shadow-[0_18px_40px_-12px_rgba(43,33,24,0.6)]" />
      <span className="absolute inset-[7px] rounded-t-full bg-[#5c3f2c]" />

      {/* 门板 */}
      <span className="absolute inset-[14px] overflow-hidden rounded-t-full bg-gradient-to-b from-[#7a5540] via-[#6B4A33] to-[#543a28]">
        {/* 木纹 */}
        <span
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(0,0,0,0.5) 0 1px, transparent 1px 18px)",
          }}
          aria-hidden
        />
        {/* 横档 */}
        <span className="absolute inset-x-0 top-[36%] h-[9px] bg-[#4a3121]/70" aria-hidden />
        <span className="absolute inset-x-0 top-[66%] h-[9px] bg-[#4a3121]/70" aria-hidden />
        {/* 门缝暖光（hover 变宽） */}
        <span
          className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-transparent via-[#f0a44a]/70 to-transparent transition-all duration-500 group-hover:w-[9px]"
          aria-hidden
        />
        <span className="absolute inset-x-0 bottom-0 h-[4px] bg-[#f0a44a]/60 blur-[1px]" aria-hidden />
      </span>

      {/* 黄铜把手 */}
      <span
        className="absolute right-[20px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#B08D57] shadow-[0_0_0_3px_rgba(176,141,87,0.22),0_2px_4px_rgba(0,0,0,0.4)] sm:right-[26px]"
        aria-hidden
      />
      <span
        className="absolute right-[14px] top-1/2 h-[2px] w-4 -translate-y-1/2 rounded-full bg-[#B08D57]/70 sm:right-[19px]"
        aria-hidden
      />

      {/* 门口绿植 */}
      <span className="pointer-events-none absolute -right-4 bottom-0 hidden sm:block" aria-hidden>
        <Plant />
      </span>

      {/* 门槛阴影 */}
      <span
        className="absolute -bottom-2 left-1/2 h-2 w-[118%] -translate-x-1/2 rounded-full bg-[#3a2a1c]/20 blur-[2px]"
        aria-hidden
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/** 门口信箱：Entry 第二个交互对象，打开居中 Contact Modal（不进入 Studio） */
function EntryMailbox({ onOpenContact }: { onOpenContact: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpenContact}
      aria-label="打开联系方式"
      className="group absolute -left-24 bottom-3 flex flex-col items-center outline-none"
    >
      <span className="relative block h-20 w-16">
        {/* 立柱 */}
        <span className="absolute bottom-0 left-1/2 h-12 w-1.5 -translate-x-1/2 rounded bg-[#6B4A33]" aria-hidden />
        {/* 箱体 */}
        <span className="absolute left-1/2 top-1 h-9 w-14 -translate-x-1/2 rounded-md bg-[#A85D43] shadow-[0_6px_14px_-6px_rgba(43,33,24,0.6)] transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
        <span className="absolute left-1/2 top-1 h-2 w-14 -translate-x-1/2 rounded-t-md bg-[#8f4a36]" aria-hidden />
        {/* 投信口 */}
        <span className="absolute left-1/2 top-4 h-1 w-6 -translate-x-1/2 rounded bg-[#3a2a1c]" aria-hidden />
        {/* 小红旗 */}
        <span className="absolute left-2 top-1 h-4 w-[2px] bg-[#d05a47]" aria-hidden />
        <span className="absolute left-2 top-1 h-2 w-3 rounded-sm bg-[#d05a47]" aria-hidden />
      </span>
      <span className="mt-1 text-[9px] uppercase tracking-[0.25em] text-studio-ink-soft/60 transition-colors group-hover:text-studio-ember">
        Mail
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/** 极简盆栽（纯 SVG，不加载资源） */
function Plant() {
  return (
    <svg viewBox="0 0 60 80" className="h-20 w-14">
      <ellipse cx="30" cy="34" rx="5" ry="14" fill="#4c7148" transform="rotate(42 30 48)" />
      <ellipse cx="30" cy="34" rx="5" ry="14" fill="#6b9a63" transform="rotate(22 30 48)" />
      <ellipse cx="30" cy="34" rx="5" ry="14" fill="#5f8a5a" />
      <ellipse cx="30" cy="34" rx="5" ry="14" fill="#6b9a63" transform="rotate(-22 30 48)" />
      <ellipse cx="30" cy="34" rx="5" ry="14" fill="#4c7148" transform="rotate(-42 30 48)" />
      <rect x="16" y="50" width="28" height="6" rx="2" fill="#a9643c" />
      <path d="M18 56 L42 56 L39 76 L21 76 Z" fill="#c07a4a" />
    </svg>
  );
}
