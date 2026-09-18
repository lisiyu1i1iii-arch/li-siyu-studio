/**
 * MY LITTLE STUDIO — 共享类型
 *
 * 3D 只负责「故事 / 氛围 / 探索」，DOM 负责「信息 / 阅读 / 简历」。
 * 这里定义的是两边都要用到的稳定契约。
 */

/**
 * 13 个独立摄影作品（每个相框一个稳定 ID，interaction §33）
 * photo-01 … photo-13
 */
export type PhotoId =
  | "photo-01"
  | "photo-02"
  | "photo-03"
  | "photo-04"
  | "photo-05"
  | "photo-06"
  | "photo-07"
  | "photo-08"
  | "photo-09"
  | "photo-10"
  | "photo-11"
  | "photo-12"
  | "photo-13";

/**
 * 空间里可以交互的物体（PHASE 2.8 重新映射）
 * - computer      → 视觉类设计
 * - photoWall     → 摄影作品总入口（QuickMenu 用；3D 中不再有父级交互）
 * - photo-01..13  → 摄影作品（13 个独立相框，各自打开摄影 Gallery）
 * - poster        → 基本信息（学术海报）
 * - camera        → 影视作品
 * - phone         → 文字作品
 * - labelString   → 技能（世界地图上方标签绳）
 * （TV / Workbench / Mailbox 已从 Studio 移除）
 */
/** 靠五层书架一侧的 4 个信息技能标签（可交互，打开对应 Skill Overlay） */
export type SkillTagId =
  | "skill-operations"
  | "skill-data"
  | "skill-aigc"
  | "skill-visual";

/** 其余 6 个标签：可点击聚焦，但不显示文字、不打开 Overlay */
export type FocusTagId =
  | "focus-tag-01"
  | "focus-tag-02"
  | "focus-tag-03"
  | "focus-tag-04"
  | "focus-tag-05"
  | "focus-tag-06";

/**
 * 新增的两段式信息物体（第一次点击聚焦，第二次点击打开居中 Overlay）。
 * 复用现有 Camera Director / Interaction Lock / ContentOverlay。
 */
export type ExtraObjectId =
  | "sofa"
  | "window-01"
  | "window-02"
  | "window-03"
  | "pillow-01"
  | "pillow-02"
  | "pillow-03"
  | "pillow-04"
  | "doll-01"
  | "doll-02"
  | "book-blue-01"
  | "book-blue-02"
  | "succulent-01"
  | "succulent-02"
  | "succulent-03"
  | "roundTable";

/** 特殊动作物体：点击直接触发动作，不聚焦、不打开 Overlay */
export type ActionObjectId =
  | "dog"
  | "cat"
  | "fan"
  | "officeChair"
  | "robot"
  | "floorLamp"
  | "pendant1"
  | "pendant2"
  | "deskLamp"
  | "blackboard"
  | "stringLights";

/** 白天 / 夜晚场景状态（统一 source of truth） */
export type DayNightMode = "day" | "night";

/** 4 个技能类别（用于对应 Overlay 内容） */
export type SkillCategoryId =
  | "operations"
  | "data"
  | "aigc"
  | "visual-design";

export type StudioObjectId =
  | "computer"
  | "photoWall"
  | "poster"
  | "camera"
  | "phone"
  | "labelString"
  | PhotoId
  | SkillTagId
  | FocusTagId
  | ExtraObjectId
  | ActionObjectId;

/** Camera Director 的一个机位：站位 + 视线落点（世界坐标） */
export interface CameraView {
  position: [number, number, number];
  target: [number, number, number];
}

/** 内容板块 */
export type SectionKey =
  | "about"
  | "projects"
  | "experience"
  | "works"
  | "skills"
  | "contact"
  /** MENU「作品集合」：统一展示摄影 / 视觉设计 / 影像 / 推文 */
  | "collection";

/** 探索 / 快速浏览 两种模式 */
export type StudioMode = "explore" | "quickview";

/** 相机当前应该看向哪里：房间默认机位，或某个物体 */
export type CameraTarget = "default" | StudioObjectId;

/** 一天中的光线阶段（Phase 1 只做 afternoon → golden） */
export type LightPhase = "afternoon" | "golden";

export interface StudioObjectMeta {
  id: StudioObjectId;
  /** 物体在空间里的名字（Hover 浮标 / 菜单） */
  label: string;
  /** 一句话提示，告诉用户这里藏着什么 */
  hint: string;
  /** 点击后打开的内容板块 */
  section: SectionKey;
  /** 新交互的显示名称（覆盖 section 标题），例如「影视作品」 */
  displayLabel?: string;
  /** WORKS 板块下的细分过滤（可包含多个 layout） */
  workFilters?: WorkLayout[];
  /** SKILLS 板块下的细分过滤（只显示对应技能类别） */
  skillCategory?: SkillCategoryId;
}

export interface SectionMeta {
  key: SectionKey;
  label: string;
  /** 英文副标题，用于 UI 排版 */
  caption: string;
}

export interface DeviceProfile {
  webgl: boolean;
  mobile: boolean;
  /** high：正常阴影 / dpr；low：关闭阴影、降低 dpr */
  performance: "high" | "low";
}

/* ------------------------------------------------------------------ */
/* 通用：数据点                                                        */
/* ------------------------------------------------------------------ */
export interface Metric {
  value: string;
  label: string;
}

/* ------------------------------------------------------------------ */
/* ABOUT                                                               */
/* ------------------------------------------------------------------ */
export interface AboutFocus {
  title: string;
  caption: string;
  items: string[];
}

export interface AboutContent {
  positioning: string;
  intro: string[];
  focus: AboutFocus[];
  facts: Metric[];
}

/* ------------------------------------------------------------------ */
/* PROJECTS                                                            */
/* ------------------------------------------------------------------ */
export interface ProjectContent {
  index: string;
  title: string;
  period: string;
  role: string;
  context: string;
  goal: string;
  problem: string;
  strategy: string[];
  output: string[];
  result: string[];
  metrics: Metric[];
  tags: string[];
}

/* ------------------------------------------------------------------ */
/* EXPERIENCE                                                          */
/* ------------------------------------------------------------------ */
export interface ExperienceRole {
  org: string;
  role: string;
  period?: string;
  summary: string;
}

export interface ExperienceCase {
  title: string;
  tagline: string;
  problem: string;
  strategy: string[];
  materials: string[];
  channels: string[];
  metrics: Metric[];
  outcome: string;
}

export interface ExperienceContent {
  headline: string;
  org: string;
  team: string;
  honors: string[];
  roles: ExperienceRole[];
  cases: ExperienceCase[];
}

/* ------------------------------------------------------------------ */
/* SKILLS                                                              */
/* ------------------------------------------------------------------ */
export interface SkillGroup {
  key: string;
  label: string;
  caption: string;
  items: string[];
}

export interface SkillsContent {
  intro: string;
  groups: SkillGroup[];
}

/* ------------------------------------------------------------------ */
/* WORKS                                                               */
/* ------------------------------------------------------------------ */
export type WorkLayout = "article" | "poster" | "visual" | "video" | "photo";

export interface WorkItem {
  id: string;
  /** 作品类别标签，例如 WECHAT ARTICLE */
  type: string;
  title: string;
  meta: string;
  description: string;
  /** 真实链接；没有素材时留空 */
  href?: string;
  /** 单张真实图片（易拉宝等） */
  image?: string;
  /** 连续多张图片（同一篇作品的连续图，按顺序展示） */
  images?: string[];
  /** 视频地址 */
  video?: string;
  /** 明确标记的 placeholder，不伪造内容 */
  placeholder?: boolean;
  layout: WorkLayout;
}

export interface WorksContent {
  intro: string;
  items: WorkItem[];
}

/* ------------------------------------------------------------------ */
/* CONTACT                                                             */
/* ------------------------------------------------------------------ */
export interface ContactContent {
  headline: string;
  name: string;
  email: string;
  phone: string;
  wechat: string;
  city: string;
  note: string;
  messageSubject: string;
}
