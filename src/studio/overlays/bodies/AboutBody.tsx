"use client";

import { ABOUT, STUDIO_PROFILE } from "../../data/studio-content";
import { Label, MetricGrid, Rule } from "../../ui/editorial";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] uppercase tracking-[0.2em] text-studio-ink-soft/60">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm text-studio-ink">{value}</dd>
    </div>
  );
}

/** 个人信息：只保留 姓名 / 年龄 / 学校 / 专业 + Numbers（不含年龄项），不做其他介绍 */
export default function AboutBody() {
  const facts = ABOUT.facts.filter((fact) => fact.label !== "岁 · 西南大学");

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Label>About</Label>
        <h2 className="font-serif text-3xl leading-tight text-studio-ink">
          {STUDIO_PROFILE.nameZh}
          <span className="ml-2 align-middle text-sm tracking-[0.3em] text-studio-ink-soft/60">
            {STUDIO_PROFILE.name}
          </span>
        </h2>
      </header>

      {/* 基本信息（只列已有数据，不虚构） */}
      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-studio-ink/10 bg-studio-paper/70 p-4">
        <InfoRow label="姓名" value={STUDIO_PROFILE.nameZh} />
        <InfoRow label="年龄" value={STUDIO_PROFILE.age} />
        <InfoRow label="学校" value={STUDIO_PROFILE.school} />
        <InfoRow label="专业" value={STUDIO_PROFILE.education} />
      </dl>

      <Rule />

      <section className="space-y-4">
        <Label>Numbers</Label>
        <MetricGrid metrics={facts} size="md" columns={3} />
      </section>
    </div>
  );
}
