"use client";

import { SKILL_CATEGORIES } from "../../data/skills";
import type { SkillCategoryId } from "../../types";
import { Label } from "../../ui/editorial";

/**
 * 单个技能类别的 Overlay 内容。
 * 由技能绳最右侧 4 个标签各自触发，分别显示对应类别。
 */
export default function SkillCategoryBody({
  category,
}: {
  category: SkillCategoryId;
}) {
  const data = SKILL_CATEGORIES[category];

  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <Label>Skills</Label>
        <h2 className="font-serif text-2xl text-studio-ink">{data.label}</h2>
      </header>

      <ul className="space-y-3">
        {data.items.map((item, i) => (
          <li
            key={item}
            className="flex items-baseline gap-3 border-b border-studio-ink/5 pb-2.5"
          >
            <span className="studio-nums shrink-0 text-xs text-studio-ink-soft/50">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm leading-relaxed text-studio-ink-soft">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
