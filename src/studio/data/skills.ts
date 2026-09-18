import type { FocusTagId, SkillCategoryId, SkillTagId } from "../types";

/**
 * 技能绳数据（唯一数据源）
 *
 * · 靠五层书架一侧（t 小）的 4 个标签 = 信息技能标签，独立 InteractiveObject
 * · 其余 6 个标签 = 可点击聚焦，但**不显示文字、不打开 Overlay**
 * · 绳子本身无交互
 *
 * 内容全部来自用户提供的真实能力清单，不虚构任何经历 / 成果 / 数据。
 */

export const SKILL_CATEGORIES: Record<
  SkillCategoryId,
  { label: string; caption: string; items: string[] }
> = {
  operations: {
    label: "运营能力",
    caption: "OPERATIONS",
    items: [
      "公众号图文排版",
      "短视频剪辑",
      "海报设计",
      "选题策划",
      "标题优化",
      "流量复盘",
      "内容矩阵搭建",
    ],
  },
  data: {
    label: "数据分析",
    caption: "DATA",
    items: ["Office", "SPSS 数据分析"],
  },
  aigc: {
    label: "AIGC 能力",
    caption: "AIGC",
    items: ["Claude", "ChatGPT", "即梦", "剪映 AI", "Vibe Coding"],
  },
  "visual-design": {
    label: "视觉设计能力",
    caption: "VISUAL",
    items: ["海报视觉设计", "图文视觉呈现", "基础视觉创意与版式表达"],
  },
};

export interface SkillTagDef {
  id: SkillTagId;
  category: SkillCategoryId;
  /** 在绳上的归一化位置 0→1 */
  t: number;
  /** 3D 标签上的短文字 */
  label: string;
  bg: string;
}

/** 靠五层书架一侧（t 小）的 4 个信息标签（可交互，打开对应 Skill Overlay） */
export const SKILL_TAGS: SkillTagDef[] = [
  { id: "skill-operations", category: "operations", t: 0.0, label: "运营", bg: "#EFE3B8" },
  { id: "skill-data", category: "data", t: 0.111, label: "数据", bg: "#DCE8D0" },
  { id: "skill-aigc", category: "aigc", t: 0.222, label: "AIGC", bg: "#D6E2EE" },
  { id: "skill-visual", category: "visual-design", t: 0.333, label: "视觉", bg: "#F0D9D6" },
];

export interface FocusTagDef {
  id: FocusTagId;
  t: number;
  bg: string;
}

/** 其余 6 个标签（可点击聚焦，不显示文字、不打开 Overlay） */
export const FOCUS_TAGS: FocusTagDef[] = [
  { id: "focus-tag-01", t: 0.444, bg: "#E2D8EC" },
  { id: "focus-tag-02", t: 0.556, bg: "#F5F1E8" },
  { id: "focus-tag-03", t: 0.667, bg: "#EFE3B8" },
  { id: "focus-tag-04", t: 0.778, bg: "#F0D9D6" },
  { id: "focus-tag-05", t: 0.889, bg: "#DCE8D0" },
  { id: "focus-tag-06", t: 1.0, bg: "#D6E2EE" },
];

/**
 * 绳子世界坐标（左墙）。
 * z0/z1 调整后让 10 个放大标签有足够间距，且左端避开五层书架、右端不出墙。
 */
export const SKILL_STRING = {
  x: -4.88,
  y: 2.75,
  z0: -1.5,
  z1: 3.7,
  sag: 0.18,
  segs: 30,
};

export function stringCurveY(t: number): number {
  return -SKILL_STRING.sag * (1 - Math.pow(2 * t - 1, 2));
}

/** 绳子上某点的世界坐标 */
export function stringPoint(t: number): [number, number, number] {
  return [
    SKILL_STRING.x,
    SKILL_STRING.y + stringCurveY(t),
    SKILL_STRING.z0 + (SKILL_STRING.z1 - SKILL_STRING.z0) * t,
  ];
}

export function tagDrop(t: number): number {
  return 0.13 + (t % 0.3) * 0.06;
}

export function tagRotation(t: number): number {
  return (t - 0.5) * 0.12;
}

/** 标签纸张中心的世界坐标（供 Camera Director 使用） */
export function tagCenter(t: number): [number, number, number] {
  const [x, y, z] = stringPoint(t);
  return [x, y - 0.02 - tagDrop(t) - 0.095, z];
}
