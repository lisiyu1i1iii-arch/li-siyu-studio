"use client";

import { EXPERIENCE } from "../../data/studio-content";
import {
  BulletList,
  Field,
  Label,
  MetricGrid,
  Rule,
} from "../../ui/editorial";

export default function ExperienceBody() {
  return (
    <div className="space-y-8">
      <p className="border-l-2 border-studio-plum pl-4 font-serif text-lg leading-snug text-studio-ink">
        {EXPERIENCE.headline}
      </p>

      {/* 档案封面 */}
      <section className="rounded-2xl border border-studio-ink/10 bg-studio-paper/70 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-serif text-xl text-studio-ink">{EXPERIENCE.org}</h2>
          <span className="text-xs text-studio-ember">{EXPERIENCE.team}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {EXPERIENCE.honors.map((honor) => (
            <span
              key={honor}
              className="rounded-full bg-studio-moss/15 px-2.5 py-0.5 text-[10px] text-studio-moss"
            >
              {honor}
            </span>
          ))}
        </div>

        <Rule className="my-4" />

        <ul className="space-y-4">
          {EXPERIENCE.roles.map((role) => (
            <li key={role.org} className="grid grid-cols-[1fr_auto] gap-x-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="text-sm font-semibold text-studio-ink">
                    {role.org}
                  </h3>
                  <span className="text-xs text-studio-ember">{role.role}</span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-studio-ink-soft">
                  {role.summary}
                </p>
              </div>
              {role.period && (
                <span className="shrink-0 text-[10px] text-studio-ink-soft/60">
                  {role.period}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* 经历档案：两本「书」 */}
      <div className="space-y-6">
        <Label>Case Files</Label>
        {EXPERIENCE.cases.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-studio-ink/10 bg-studio-paper/70 p-5"
          >
            <header className="space-y-1">
              <h3 className="font-serif text-lg leading-snug text-studio-ink">
                {item.title}
              </h3>
              <p className="text-[11px] uppercase tracking-[0.15em] text-studio-ink-soft/60">
                {item.tagline}
              </p>
            </header>

            <div className="mt-4 space-y-4">
              <Field label="Problem">{item.problem}</Field>
              <Field label="Strategy">
                <BulletList items={item.strategy} />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Materials">
                  <div className="flex flex-wrap gap-1.5">
                    {item.materials.map((m) => (
                      <span
                        key={m}
                        className="rounded-full border border-studio-ink/15 bg-studio-paper px-2 py-0.5 text-[10px] text-studio-ink-soft"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </Field>
                <Field label="Channels">
                  <div className="flex flex-wrap gap-1.5">
                    {item.channels.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-studio-ink/15 bg-studio-paper px-2 py-0.5 text-[10px] text-studio-ink-soft"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </Field>
              </div>
            </div>

            <Rule className="my-4" />

            <MetricGrid metrics={item.metrics} size="md" columns={3} />

            <p className="mt-4 text-sm text-studio-ink">
              <span className="mr-1 text-studio-moss">→</span>
              {item.outcome}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
