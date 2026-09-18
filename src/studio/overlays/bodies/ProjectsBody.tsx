"use client";

import { PROJECTS } from "../../data/studio-content";
import {
  BulletList,
  Chip,
  CoverPlaceholder,
  Field,
  Label,
  MetricGrid,
  Rule,
} from "../../ui/editorial";

export default function ProjectsBody() {
  return (
    <div className="space-y-10">
      <p className="text-sm leading-relaxed text-studio-ink-soft">
        电脑里存着我做过的项目。每个都按 CONTEXT → GOAL → PROBLEM → STRATEGY →
        OUTPUT → RESULT 拆开，先看数字，再看方法。
      </p>

      {PROJECTS.map((project) => (
        <article key={project.index} className="space-y-5">
          <header className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Project {project.index}</Label>
              <span className="text-[10px] uppercase tracking-[0.15em] text-studio-ink-soft/60">
                {project.period}
              </span>
            </div>
            <h3 className="font-serif text-xl leading-snug text-studio-ink">
              {project.title}
            </h3>
            <p className="text-xs text-studio-ember">{project.role}</p>
          </header>

          <CoverPlaceholder index={project.index} caption="现场素材 · 待替换" />

          <MetricGrid metrics={project.metrics} size="md" columns={3} />

          <Rule />

          <div className="space-y-4">
            <Field label="Context">{project.context}</Field>
            <Field label="Goal">{project.goal}</Field>
            <Field label="Problem">{project.problem}</Field>
            <Field label="Strategy">
              <BulletList items={project.strategy} />
            </Field>
            <Field label="Output">
              <BulletList items={project.output} />
            </Field>
            <Field label="Result" accent>
              <BulletList items={project.result} tone="moss" />
            </Field>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
