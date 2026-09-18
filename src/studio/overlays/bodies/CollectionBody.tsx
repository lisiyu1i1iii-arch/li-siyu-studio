"use client";

import { PHOTOGRAPHY } from "../../data/photography";
import { useStudioStore } from "../../store/studio-store";
import WorksBody from "./WorksBody";

/**
 * 作品集合（MENU 入口）：
 * 统一展示 摄影 / 视觉设计 / 影像 / 推文 四类作品。
 *
 * 复用现有数据与组件，不新增第二套作品数据：
 *   · 摄影   → PHOTOGRAPHY（13 张，点击进入现有 PhotoGallery）
 *   · 视觉设计 / 影像 / 推文 → 现有 WorksBody + WORKS 数据
 */

function BlockHeading({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="flex items-baseline gap-3 border-b border-studio-ink/10 pb-3">
      <h3 className="font-serif text-2xl text-studio-ink">{title}</h3>
      <span className="text-[10px] uppercase tracking-[0.3em] text-studio-ink-soft/60">
        {caption}
      </span>
    </div>
  );
}

export default function CollectionBody() {
  const activatePhoto = useStudioStore((s) => s.activatePhoto);

  return (
    <div className="space-y-10">
      {/* 摄影作品 —— 13 张，点击直接进入现有摄影 Gallery */}
      <section className="space-y-4">
        <BlockHeading title="摄影作品" caption="Photography" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {PHOTOGRAPHY.map((photo, index) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => activatePhoto(photo.id, index)}
              className="group overflow-hidden rounded-xl border border-studio-ink/10 bg-studio-paper/70 p-2 text-left transition-colors hover:border-studio-sun/60 hover:bg-studio-sun/10"
            >
              {photo.thumb || photo.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={(photo.thumb ?? photo.image) as string}
                  alt={photo.title}
                  className="h-28 w-full object-contain"
                />
              ) : (
                <div className="flex h-28 w-full items-center justify-center text-[10px] uppercase tracking-[0.2em] text-studio-ink-soft/60">
                  图片待补充
                </div>
              )}
              <span className="mt-1 block text-[11px] text-studio-ink-soft">
                {photo.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 视觉设计作品（易拉宝 + 公众号视觉设计） */}
      <section className="space-y-4">
        <BlockHeading title="视觉设计作品" caption="Visual Design" />
        <WorksBody filters={["poster", "visual"]} />
      </section>

      {/* 影像作品（2 个视频） */}
      <section className="space-y-4">
        <BlockHeading title="影像作品" caption="Video" />
        <WorksBody filters={["video"]} />
      </section>

      {/* 推文作品（2 篇公众号） */}
      <section className="space-y-4">
        <BlockHeading title="推文作品" caption="Writing" />
        <WorksBody filters={["article"]} />
      </section>
    </div>
  );
}
