"use client";

import { Camera, Images, Info, Monitor, Smartphone, Tags } from "lucide-react";

import { playTone } from "@/lib/sound";
import { STUDIO_OBJECTS } from "../data/studio-content";
import { TOTAL_EXPLORED, useStudioStore } from "../store/studio-store";
import type { StudioObjectId } from "../types";

/** 摄影相框（photo-XX）不单独出现在快捷导航里，由「照片墙」入口代表 */
const ICONS: Partial<Record<StudioObjectId, typeof Monitor>> = {
  photoWall: Images,
  computer: Monitor,
  poster: Info,
  camera: Camera,
  phone: Smartphone,
  labelString: Tags,
};

/**
 * 底部指引栏的显示名称（仅 UI 文案）。
 * 不改动 object ID、数据结构、图标、点击逻辑，也不改 3D 对象名称。
 */
const DISPLAY_NAMES: Partial<Record<StudioObjectId, string>> = {
  photoWall: "摄影作品",
  computer: "视觉设计作品",
  poster: "个人信息",
  camera: "影像作品",
  phone: "推文作品",
  labelString: "个人技能",
};

/** 底部指引栏显示顺序（仅 UI 顺序，不改数据 / ID / 交互） */
const DISPLAY_ORDER: StudioObjectId[] = [
  "photoWall",
  "computer",
  "camera",
  "phone",
  "poster",
  "labelString",
];

/** 底部快捷导航：8 个物件圆点，点击 = 把镜头送过去并打开内容 */
export default function QuickMenu() {
  const selectObject = useStudioStore((s) => s.selectObject);
  const activatePhoto = useStudioStore((s) => s.activatePhoto);
  const explored = useStudioStore((s) => s.explored);
  const activeObject = useStudioStore((s) => s.activeObject);
  const overlayOpen = useStudioStore((s) => s.overlayOpen);

  const objects = DISPLAY_ORDER.map((id) =>
    STUDIO_OBJECTS.find((o) => o.id === id),
  ).filter((o): o is (typeof STUDIO_OBJECTS)[number] => Boolean(o));

  if (overlayOpen) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-30 flex flex-col items-center gap-2 px-4">
      <p className="hidden text-[10px] uppercase tracking-[0.3em] text-studio-ink-soft/70 sm:block">
        拖动环视 · 点击物件 · {explored.length}/{TOTAL_EXPLORED}
      </p>

      <nav
        aria-label="工作室快捷导航"
        className="pointer-events-auto flex w-[min(720px,96vw)] items-center justify-center gap-1 rounded-2xl border border-studio-ink/10 bg-studio-cream/85 px-2 py-2 shadow-xl backdrop-blur-xl"
      >
        {objects.map((object) => {
          const Icon = ICONS[object.id] ?? Images;
          const label = DISPLAY_NAMES[object.id] ?? object.label;
          const visited = explored.includes(object.id);
          const isActive = activeObject === object.id;

          return (
            <button
              key={object.id}
              type="button"
              onClick={() => {
                playTone("open");
                // 摄影作品：直接打开 13 张照片 Gallery（无介绍页）
                if (object.id === "photoWall") activatePhoto(object.id, 0);
                else selectObject(object.id);
              }}
              title={`${label} · ${object.hint}`}
              className={`group relative flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors ${
                isActive ? "bg-studio-sun/20" : "hover:bg-studio-ink/5"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                  visited
                    ? "border-studio-moss/60 bg-studio-moss/15 text-studio-moss"
                    : "border-studio-ink/15 bg-studio-paper text-studio-ink-soft"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="hidden text-[10px] text-studio-ink-soft sm:block">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
