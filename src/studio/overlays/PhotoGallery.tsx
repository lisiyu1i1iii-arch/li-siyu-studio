"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { PHOTO_COUNT, PHOTOGRAPHY } from "../data/photography";
import { useStudioStore } from "../store/studio-store";
import { CoverPlaceholder, Label, PaperGrain } from "../ui/editorial";

/*
 * 模块级稳定 variants：避免重复播放「弹出」动画。
 * 进入动画为单次、单向、无回弹（fade + 轻微放大上浮到位）：
 * 不再使用 `scale: [0.85, 1.04, 0.98, 1]` 关键帧回弹，
 * 因为「放大超过 1 → 回缩 → 再到 1」在视觉上会被读成“弹了两次”。
 * 这与 ContentOverlay 的进入动画保持一致，摄影作品不再出现双层/两次弹出观感。
 */
const GALLERY_BACKDROP = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};
const GALLERY_CARD = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 8 },
};
const GALLERY_TRANSITION = { duration: 0.28, ease: "easeOut" } as const;

/**
 * 模块级图片预加载缓存：同一 URL 只创建一次 Image，
 * 切换上一张/下一张时直接命中浏览器缓存，避免重复请求与解码压力。
 */
const preloadCache = new Map<string, HTMLImageElement>();
function preloadImage(src: string | null) {
  if (typeof window === "undefined" || !src || preloadCache.has(src)) return;
  const img = new Image();
  img.decoding = "async";
  img.src = src;
  preloadCache.set(src, img);
}

/**
 * 摄影 Gallery（works-gallery Skill）
 *
 * · 由 13 个相框各自的 ID 打开，直接定位到对应索引（photo-07 → 07）
 * · 01 / 13 计数、上一张 / 下一张、左右箭头、键盘 ← →、Esc、移动端滑动
 * · 循环导航：13 → 01，01 → 13
 * · 相机由 Camera Director 负责；关闭时回到打开前机位（store.cameraOverride）
 * · 打开期间锁定 3D 交互
 *
 * 真实照片尚未提供：统一显示「图片待补充 / 后续放」占位，不伪造作品。
 */
export default function PhotoGallery() {
  const galleryIndex = useStudioStore((s) => s.galleryIndex);
  const closePhotoGallery = useStudioStore((s) => s.closePhotoGallery);
  const setGalleryIndex = useStudioStore((s) => s.setGalleryIndex);

  const touchX = useRef<number | null>(null);
  /** 已加载完成的图片 src：切换时立即失效，避免白块 */
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  const go = useCallback(
    (delta: number) => {
      const current = useStudioStore.getState().galleryIndex;
      if (current === null) return;
      setGalleryIndex((current + delta + PHOTO_COUNT) % PHOTO_COUNT);
    },
    [setGalleryIndex],
  );

  useEffect(() => {
    if (galleryIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closePhotoGallery();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [galleryIndex, go, closePhotoGallery]);

  // 预加载当前 / 下一张 / 上一张：切换时命中缓存，不再临时下载 3–7MB 大图
  useEffect(() => {
    if (galleryIndex === null) return;
    const n = PHOTO_COUNT;
    [galleryIndex, (galleryIndex + 1) % n, (galleryIndex - 1 + n) % n].forEach(
      (i) => preloadImage(PHOTOGRAPHY[i].image),
    );
  }, [galleryIndex]);

  const open = galleryIndex !== null;
  const current = open ? PHOTOGRAPHY[galleryIndex] : null;
  /** 当前图是否已加载完成（用 src 比对，切换瞬间即为 false） */
  const isLoaded = Boolean(current?.image) && loadedSrc === current?.image;
  const counter = open
    ? `${String(galleryIndex + 1).padStart(2, "0")} / ${String(PHOTO_COUNT).padStart(2, "0")}`
    : "";

  return (
    <AnimatePresence>
      {open && current && (
        <motion.div
          key="photo-gallery"
          variants={GALLERY_BACKDROP}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-studio-ink/40 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="摄影作品"
        >
          <motion.div
            variants={GALLERY_CARD}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={GALLERY_TRANSITION}
            className="relative flex w-full max-w-[760px] flex-col overflow-hidden rounded-3xl border border-studio-ink/15 bg-studio-cream/95 shadow-2xl sm:flex-row"
          >
            <PaperGrain />

            {/* 图片区 */}
            <div
              className="relative flex min-h-[260px] flex-1 items-center justify-center bg-studio-paper p-5 sm:min-h-[440px] sm:p-8"
              onTouchStart={(e) => {
                touchX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                const start = touchX.current;
                touchX.current = null;
                if (start === null) return;
                const end = e.changedTouches[0]?.clientX ?? start;
                const dx = end - start;
                if (Math.abs(dx) < 40) return;
                go(dx < 0 ? 1 : -1);
              }}
            >
              {/* 低清缩略图作为占位（已随 3D 相框加载，命中缓存），
                  大图加载完成后淡入，切换时不出现白块 */}
              {current.thumb && !isLoaded && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.thumb}
                  alt=""
                  aria-hidden
                  className="pointer-events-none absolute inset-0 m-auto max-h-[62vh] w-auto max-w-full rounded-sm object-contain opacity-70 blur-md"
                />
              )}
              {current.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={current.id}
                  src={current.image}
                  alt={current.title}
                  decoding="async"
                  onLoad={() => setLoadedSrc(current.image)}
                  onError={() => setLoadedSrc(current.image)}
                  className={`max-h-[62vh] w-auto max-w-full rounded-sm object-contain shadow-sm transition-opacity duration-300 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              ) : (
                <CoverPlaceholder
                  index={String(galleryIndex + 1).padStart(2, "0")}
                  caption="图片待补充"
                  className="w-full max-w-[420px]"
                />
              )}

              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="上一张"
                className="absolute left-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-studio-ink/15 bg-studio-cream/85 text-studio-ink transition-colors hover:bg-studio-sun/20 sm:left-3"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="下一张"
                className="absolute right-2 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-studio-ink/15 bg-studio-cream/85 text-studio-ink transition-colors hover:bg-studio-sun/20 sm:right-3"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* 信息区 */}
            <div className="relative flex w-full shrink-0 flex-col justify-between gap-6 border-t border-studio-ink/10 p-6 sm:w-[260px] sm:border-l sm:border-t-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <Label>Photography</Label>
                  <span className="studio-nums text-xs text-studio-ink-soft/70">
                    {counter}
                  </span>
                </div>
                <h2 className="font-serif text-2xl leading-tight text-studio-ink">
                  {current.title}
                </h2>
                <p className="text-sm leading-relaxed text-studio-ink-soft">
                  {current.caption}
                </p>
                {current.placeholder && (
                  <span className="inline-flex rounded-full border border-studio-ink/15 bg-studio-paper/70 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.2em] text-studio-ink-soft/70">
                    后续放
                  </span>
                )}
              </div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-studio-ink-soft/50">
                ← → 切换 · Esc 关闭
              </p>
            </div>

            {/* 关闭 */}
            <button
              type="button"
              onClick={closePhotoGallery}
              aria-label="关闭"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-studio-ink/15 bg-studio-cream/85 text-studio-ink transition-colors hover:bg-studio-ink/5"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
