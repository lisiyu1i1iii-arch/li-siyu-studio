"use client";

import { useEffect, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { playTone } from "@/lib/sound";
import { objectMeta, sectionMeta } from "../data/studio-content";
import { useStudioStore } from "../store/studio-store";
import type { SectionKey } from "../types";
import { PaperGrain } from "../ui/editorial";
import AboutBody from "./bodies/AboutBody";
import CollectionBody from "./bodies/CollectionBody";
import ContactBody from "./bodies/ContactBody";
import ExperienceBody from "./bodies/ExperienceBody";
import ProjectsBody from "./bodies/ProjectsBody";
import SkillCategoryBody from "./bodies/SkillCategoryBody";
import SkillsBody from "./bodies/SkillsBody";
import WorksBody from "./bodies/WorksBody";

const BODIES: Record<SectionKey, () => ReactElement> = {
  about: AboutBody,
  projects: ProjectsBody,
  experience: ExperienceBody,
  works: WorksBody,
  skills: SkillsBody,
  contact: ContactBody,
  collection: CollectionBody,
};

/**
 * 入场动画使用【模块级稳定 variants】：
 * 避免每次 render 生成新的 animate 对象导致 Framer Motion 重播动画。
 * 每次真正打开只播放一次；关闭只播一次退出。
 *
 * 进入动画为**单次、单向、无回弹**的过渡（fade + 轻微放大上浮到位）：
 * 不再使用 `scale: [0.85, 1.04, 0.98, 1]` 这类关键帧回弹，
 * 因为「放大超过 1 → 回缩 → 再到 1」在视觉上会被读成“弹了两次”。
 *
 * 另外不使用 `mode="wait"`：Overlay 同一时刻只存在一个子节点。
 * `presenceAffectsLayout={false}`：Overlay 是绝对定位、不影响同级布局，
 * 关闭 presence 对布局的随机 context 刷新，减少无谓重渲染。
 */
const BACKDROP_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const CARD_VARIANTS = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 8 },
};

const BACKDROP_TRANSITION = { duration: 0.24, ease: "easeOut" } as const;
const CARD_TRANSITION = { duration: 0.28, ease: "easeOut" } as const;

/**
 * DOM 内容层：3D 是故事，这里是信息。
 *
 * 所有信息页从【屏幕中央】出现（fade + scale / center reveal），
 * 不是右侧 Side Panel、也不从左右滑入。关闭后由 store 恢复点击前机位。
 */
export default function ContentOverlay() {
  const overlayOpen = useStudioStore((s) => s.overlayOpen);
  const activeSection = useStudioStore((s) => s.activeSection);
  const activeObject = useStudioStore((s) => s.activeObject);
  const closeOverlay = useStudioStore((s) => s.closeOverlay);

  useEffect(() => {
    if (!overlayOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlayOpen, closeOverlay]);

  const meta = activeSection ? sectionMeta(activeSection) : null;
  const object = activeObject ? objectMeta(activeObject) : null;
  const Body = activeSection ? BODIES[activeSection] : null;

  // 稳定的 key：同一物品打开期间不变 → 不会 remount → 不会重复播放动画；
  // 切换到另一物品时 key 改变 → A 退出、B 进入一次。
  const overlayKey = `overlay-${activeObject ?? activeSection ?? "none"}`;

  return (
    <AnimatePresence presenceAffectsLayout={false}>
      {overlayOpen && activeSection && meta && Body && (
        <motion.div
          key={overlayKey}
          variants={BACKDROP_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={BACKDROP_TRANSITION}
          className="absolute inset-0 z-40 flex items-center justify-center bg-studio-ink/35 p-4 backdrop-blur-sm"
        >
          <motion.aside
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={CARD_TRANSITION}
            className="relative flex max-h-[86vh] w-full max-w-[560px] flex-col overflow-hidden rounded-3xl border border-studio-ink/15 bg-studio-cream/95 shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label={meta.label}
          >
            <PaperGrain />

            <header className="relative z-10 flex items-start justify-between gap-4 border-b border-studio-ink/10 px-6 py-5">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.4em] text-studio-ink-soft/60">
                  {meta.caption}
                </p>
                <h3 className="mt-1 font-serif text-2xl text-studio-ink">
                  {object?.displayLabel ?? meta.label}
                </h3>
                {object && (
                  <p className="mt-0.5 text-xs text-studio-ember">{object.hint}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  playTone("close");
                  closeOverlay();
                }}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-studio-ink/15 text-studio-ink transition-colors hover:bg-studio-ink/5"
                aria-label="关闭"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="no-scrollbar relative z-10 flex-1 overflow-y-auto px-6 py-6">
              {activeSection === "works" ? (
                <WorksBody filters={object?.workFilters} />
              ) : activeSection === "skills" && object?.skillCategory ? (
                <SkillCategoryBody category={object.skillCategory} />
              ) : (
                <Body />
              )}
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
