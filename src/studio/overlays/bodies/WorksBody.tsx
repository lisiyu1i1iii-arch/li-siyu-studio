"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

import { WORKS } from "../../data/studio-content";
import { Label } from "../../ui/editorial";
import type { WorkItem, WorkLayout } from "../../types";

/**
 * filter（filters）：只显示对应 layout 的作品。
 *   phone   → article（公众号链接）
 *   camera  → video（2 个真实视频）
 *   computer→ poster（易拉宝图片）+ visual（公众号视觉设计，连续图）
 *   照片墙   → photo（由 PhotoGallery 单独处理）
 */
export default function WorksBody({ filters }: { filters?: WorkLayout[] } = {}) {
  const items =
    filters && filters.length
      ? WORKS.items.filter((i) => filters.includes(i.layout))
      : WORKS.items;

  const articles = items.filter((i) => i.layout === "article");
  const rollups = items.filter((i) => i.layout === "poster");
  const visuals = items.filter((i) => i.layout === "visual");
  const videos = items.filter((i) => i.layout === "video");

  return (
    <div className="space-y-9">
      {articles.length > 0 && (
        <section className="space-y-4">
          <Label>Articles</Label>
          <div className="space-y-3">
            {articles.map((item, i) => (
              <ArticleCard key={item.id} item={item} index={i + 1} />
            ))}
          </div>
        </section>
      )}

      {rollups.length > 0 && (
        <section className="space-y-4">
          <Label>Roll-up</Label>
          <RollupViewer items={rollups} />
        </section>
      )}

      {visuals.length > 0 && (
        <section className="space-y-4">
          <Label>Visual Design</Label>
          {visuals.map((item) => (
            <div key={item.id} className="space-y-3">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-studio-ink">
                  {item.title}
                </h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-studio-ink-soft/60">
                  {item.meta}
                </span>
              </div>
              {item.images?.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`${item.title} ${i + 1}`}
                  className="h-auto w-full rounded-lg border border-studio-ink/10"
                />
              ))}
            </div>
          ))}
        </section>
      )}

      {videos.length > 0 && (
        <section className="space-y-5">
          <Label>Video</Label>
          {videos.map((item) => (
            <VideoCard key={item.id} item={item} />
          ))}
        </section>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
function ArticleCard({ item, index }: { item: WorkItem; index: number }) {
  return (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-start gap-4 rounded-2xl border border-studio-ink/10 bg-studio-paper/70 p-4 transition-colors hover:border-studio-sun/60 hover:bg-studio-sun/10"
    >
      <span className="studio-nums shrink-0 font-serif text-2xl text-studio-sun">
        {String(index).padStart(2, "0")}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-studio-ink-soft/60">
            {item.type}
          </span>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-studio-ink-soft/50 transition-colors group-hover:text-studio-ember" />
        </div>
        <h3 className="mt-1 text-sm font-semibold text-studio-ink">
          {item.title}
        </h3>
        <p className="mt-0.5 text-xs text-studio-ink-soft">{item.description}</p>
      </div>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/** 易拉宝：真实图片，前后切换，保持原始比例（不拉伸） */
function RollupViewer({ items }: { items: WorkItem[] }) {
  const [index, setIndex] = useState(0);
  const item = items[index];
  const go = (delta: number) =>
    setIndex((prev) => (prev + delta + items.length) % items.length);

  return (
    <div className="space-y-3">
      <div className="relative flex items-center justify-center rounded-xl border border-studio-ink/10 bg-studio-paper p-4">
        {item.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[52vh] w-auto max-w-full object-contain"
          />
        )}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="上一个"
              className="absolute left-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-studio-ink/15 bg-studio-cream/85 text-studio-ink transition-colors hover:bg-studio-sun/20"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="下一个"
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-studio-ink/15 bg-studio-cream/85 text-studio-ink transition-colors hover:bg-studio-sun/20"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
      <div className="flex items-center justify-between text-[11px] text-studio-ink-soft">
        <span>
          {item.title} · {item.meta}
        </span>
        <span className="studio-nums">
          {index + 1} / {items.length}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function VideoCard({ item }: { item: WorkItem }) {
  return (
    <div className="space-y-2">
      {item.video && (
        <video
          src={item.video}
          controls
          preload="metadata"
          playsInline
          className="w-full rounded-xl border border-studio-ink/10 bg-black"
        />
      )}
      <div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-studio-ink-soft/60">
          {item.type}
        </p>
        <h3 className="mt-0.5 text-sm font-semibold text-studio-ink">
          {item.title}
        </h3>
        <p className="mt-0.5 text-xs text-studio-ink-soft">{item.description}</p>
      </div>
    </div>
  );
}
