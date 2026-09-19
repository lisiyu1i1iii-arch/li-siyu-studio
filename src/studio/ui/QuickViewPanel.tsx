"use client";

import type { ReactElement } from "react";
import { motion } from "framer-motion";
import { ArrowRight, FileText, X } from "lucide-react";

import { SECTIONS, STUDIO_PROFILE } from "../data/studio-content";
import { useStudioStore } from "../store/studio-store";
import type { SectionKey } from "../types";
import AboutBody from "../overlays/bodies/AboutBody";
import CollectionBody from "../overlays/bodies/CollectionBody";
import ContactBody from "../overlays/bodies/ContactBody";
import ExperienceBody from "../overlays/bodies/ExperienceBody";
import ProjectsBody from "../overlays/bodies/ProjectsBody";
import SkillsBody from "../overlays/bodies/SkillsBody";
import WorksBody from "../overlays/bodies/WorksBody";
import { Label, PaperGrain } from "./editorial";

// 注意：collection 不在 SECTIONS 中，因此不会出现在 QuickView 的板块列表里；
// 这里补全 Record 类型所需条目。
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
 * QUICK VIEW：给 HR / Recruiter 的快速通道。
 * 不探索 3D，也能在 30 秒内读完 Who / What / Results / Contact。
 */
export default function QuickViewPanel() {
  const setMode = useStudioStore((s) => s.setMode);

  return (
    <motion.div
      className="absolute inset-0 z-40 overflow-y-auto bg-studio-paper/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <PaperGrain />

      <div className="relative mx-auto w-full max-w-3xl px-6 pb-28 pt-24 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Label>Quick View</Label>
            <h2 className="mt-2 font-serif text-3xl text-studio-ink sm:text-4xl">
              {STUDIO_PROFILE.name}
            </h2>
            <p className="mt-1 text-sm text-studio-ink-soft">
              {STUDIO_PROFILE.role} · {STUDIO_PROFILE.schoolEn}
            </p>
            <p className="text-xs text-studio-ink-soft/70">
              {STUDIO_PROFILE.education} · {STUDIO_PROFILE.period} ·{" "}
              {STUDIO_PROFILE.city}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode("explore")}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-studio-ink/15 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-studio-ink transition-colors hover:bg-studio-ink/5"
          >
            <X className="h-3.5 w-3.5" /> Close
          </button>
        </div>

        <p className="mt-6 max-w-xl border-l-2 border-studio-sun pl-4 font-serif text-lg leading-snug text-studio-ink">
          {STUDIO_PROFILE.tagline}
        </p>

        <div className="mt-12 space-y-16">
          {SECTIONS.map((section) => {
            const Body = BODIES[section.key];
            return (
              <section key={section.key} id={section.key} className="scroll-mt-24">
                <div className="flex items-baseline gap-3 border-b border-studio-ink/10 pb-3">
                  <h3 className="font-serif text-2xl text-studio-ink">
                    {section.label}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-studio-ink-soft/60">
                    {section.caption}
                  </span>
                </div>
                <div className="mt-6">
                  <Body />
                </div>
              </section>
            );
          })}
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          <a
            href="/cv"
            className="inline-flex items-center gap-2 rounded-full bg-studio-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-studio-cream transition-colors hover:bg-studio-ember"
          >
            <FileText className="h-4 w-4" /> HR 平面简历
          </a>
          <button
            type="button"
            onClick={() => setMode("explore")}
            className="inline-flex items-center gap-2 rounded-full border border-studio-ink/15 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-studio-ink transition-colors hover:bg-studio-ink/5"
          >
            回到工作室 <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
