"use client";

import { SKILLS } from "../../data/studio-content";
import { Label } from "../../ui/editorial";

const DOT_COLORS = [
  "bg-studio-ember",
  "bg-studio-plum",
  "bg-studio-moss",
  "bg-studio-sun",
  "bg-studio-screen",
  "bg-studio-ink-soft",
];

export default function SkillsBody() {
  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <Label>Creative Workbench</Label>
        <p className="text-sm leading-relaxed text-studio-ink-soft">
          {SKILLS.intro}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {SKILLS.groups.map((group, gi) => (
          <section
            key={group.key}
            className="rounded-2xl border border-studio-ink/10 bg-studio-paper/70 p-4"
          >
            <div className="flex items-baseline justify-between gap-2 border-b border-studio-ink/10 pb-2">
              <h3 className="font-serif text-base text-studio-ink">
                {group.label}
              </h3>
              <span className="text-[10px] text-studio-ink-soft/50">
                {group.caption}
              </span>
            </div>

            <ul className="mt-3 space-y-2">
              {group.items.map((item, i) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      DOT_COLORS[(i + gi) % DOT_COLORS.length]
                    }`}
                  />
                  <span className="text-sm text-studio-ink-soft">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
