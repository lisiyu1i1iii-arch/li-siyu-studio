import type {
  AboutContent,
  ContactContent,
  ExperienceContent,
  ProjectContent,
  SectionKey,
  SectionMeta,
  SkillsContent,
  StudioObjectId,
  StudioObjectMeta,
  WorksContent,
} from "../types";
import { photoById } from "./photography";
import { SKILL_CATEGORIES, SKILL_TAGS } from "./skills";

/**
 * 当前阶段（Phase 2A）的静态内容源。
 *
 * 刻意与 /cv、/admin 的 Supabase 数据解耦：这一阶段先把内容与信息架构验证清楚。
 * 后续接入真实数据时，只需替换本文件的导出，UI / 3D 映射无需改动。
 */

/* ------------------------------------------------------------------ */
/* 空间配色                                                            */
/* ------------------------------------------------------------------ */
export const STUDIO_PALETTE = {
  floor: "#9a6b45",
  floorSeam: "#7c5334",
  wall: "#f1e3cf",
  wallBack: "#efe0ca",
  ceiling: "#faf3e7",
  beam: "#6f4b30",
  wood: "#b07c4d",
  woodDark: "#7a5133",
  woodLight: "#c99a68",
  cream: "#f6ecdc",
  fabric: "#e4cfb4",
  fabricDark: "#c2a180",
  sun: "#f0a44a",
  ember: "#d97b2b",
  screen: "#8fd0ff",
  metal: "#9aa3b2",
  plant: "#5f8a5a",
  plantDark: "#4c7148",
  pot: "#c07a4a",
  plum: "#7a3b52",
  sky: "#ffd9a0",
  paper: "#fdf8f0",
  ink: "#2b2118",
  // PHASE 2.7-1 布局重建新增色板
  green: "#2E5B4C",
  wallWarm: "#E8E0D0",
  baseboard: "#F2EDE4",
  floorWood: "#8B5A3B",
  rug: "#EDE6D8",
  rugRing: "#C9BBA6",
  rattan: "#D4A95C",
  brick: "#A85D43",
  deskTop: "#C8A97E",
  deskFrame: "#E8E2D6",
  brass: "#B08D57",
  lampWarm: "#FFE0B0",
  lampBase: "#9A958C",
  deepBrown: "#5A3826",
  posterBg: "#F5F1E8",
  mapGreen: "#A8C6A0",
  bead: "#F2EDE4",
} as const;

/* ------------------------------------------------------------------ */
/* 板块                                                                */
/* ------------------------------------------------------------------ */
export const SECTIONS: SectionMeta[] = [
  { key: "about", label: "关于我", caption: "ABOUT" },
  { key: "projects", label: "项目", caption: "PROJECTS" },
  { key: "experience", label: "经历", caption: "EXPERIENCE" },
  { key: "works", label: "作品", caption: "WORKS" },
  { key: "skills", label: "技能", caption: "SKILLS" },
  { key: "contact", label: "联系", caption: "CONTACT" },
];

/**
 * MENU「作品集合」板块：统一展示摄影 / 视觉设计 / 影像 / 推文。
 * 不放进 SECTIONS，避免影响 QuickView 的板块列表。
 */
export const COLLECTION_SECTION: SectionMeta = {
  key: "collection",
  label: "作品集合",
  caption: "COLLECTION",
};

export function sectionMeta(key: SectionKey): SectionMeta {
  if (key === "collection") return COLLECTION_SECTION;
  return SECTIONS.find((s) => s.key === key) ?? SECTIONS[0];
}

/* ------------------------------------------------------------------ */
/* 物体 → 内容 映射                                                    */
/* ------------------------------------------------------------------ */
export const STUDIO_OBJECTS: StudioObjectMeta[] = [
  // 照片墙 → 摄影作品（13 张真实照片）
  { id: "photoWall", label: "照片墙", hint: "13 张摄影作品", section: "works", displayLabel: "摄影作品", workFilters: ["photo"] },
  // 电脑 → 视觉类设计（易拉宝 + 公众号视觉设计）
  { id: "computer", label: "电脑", hint: "易拉宝 · 公众号视觉", section: "works", displayLabel: "视觉类设计", workFilters: ["poster", "visual"] },
  // 电脑上方的个人展示框 → 个人信息
  { id: "poster", label: "个人展示框", hint: "我的个人小档案", section: "about", displayLabel: "个人信息" },
  // 摄影机 → 影像作品（2 个视频）
  { id: "camera", label: "摄影机", hint: "影像作品", section: "works", displayLabel: "影像作品", workFilters: ["video"] },
  // 手机 → 文字作品（2 篇公众号）
  { id: "phone", label: "手机", hint: "公众号文字作品", section: "works", displayLabel: "推文作品", workFilters: ["article"] },
  // 标签绳 → 技能
  { id: "labelString", label: "标签绳", hint: "我常用的工具与能力", section: "skills", displayLabel: "技能" },
];

/**
 * 新增的信息物体（右侧沙发 / 三扇窗 / 抱枕 / 玩偶 / 蓝色书 / 多肉 / 桌面纸张）。
 * 复用现有板块内容，不虚构任何个人经历 / 数据；此处只描述物体本身。
 * 不加入 STUDIO_OBJECTS，因此不会出现在底部 QuickMenu。
 */
export const EXTRA_OBJECTS: StudioObjectMeta[] = [
  { id: "sofa", label: "沙发", hint: "客厅的一角", section: "about", displayLabel: "关于我" },
  { id: "window-01", label: "拱窗 · 一", hint: "窗边的光", section: "about", displayLabel: "关于我" },
  { id: "window-02", label: "拱窗 · 二", hint: "窗边的光", section: "about", displayLabel: "关于我" },
  { id: "window-03", label: "拱窗 · 三", hint: "窗边的光", section: "about", displayLabel: "关于我" },
  { id: "pillow-01", label: "抱枕", hint: "沙发上的软装", section: "about", displayLabel: "关于我" },
  { id: "pillow-02", label: "抱枕", hint: "沙发上的软装", section: "about", displayLabel: "关于我" },
  { id: "pillow-03", label: "抱枕", hint: "沙发上的软装", section: "about", displayLabel: "关于我" },
  { id: "pillow-04", label: "抱枕", hint: "沙发上的软装", section: "about", displayLabel: "关于我" },
  { id: "doll-01", label: "玩偶", hint: "陪伴的小家伙", section: "about", displayLabel: "关于我" },
  { id: "doll-02", label: "玩偶", hint: "陪伴的小家伙", section: "about", displayLabel: "关于我" },
  { id: "book-blue-01", label: "蓝色书", hint: "一本经历档案", section: "experience", displayLabel: "经历" },
  { id: "book-blue-02", label: "蓝色书", hint: "一本经历档案", section: "experience", displayLabel: "经历" },
  { id: "succulent-01", label: "多肉", hint: "窗台的小生命", section: "skills", displayLabel: "技能" },
  { id: "succulent-02", label: "多肉", hint: "窗台的小生命", section: "skills", displayLabel: "技能" },
  { id: "succulent-03", label: "多肉", hint: "窗台的小生命", section: "skills", displayLabel: "技能" },
  // 圆桌：聚焦后水杯冒热气，第二次点击打开「联系」Overlay
  { id: "roundTable", label: "圆桌", hint: "坐下来喝杯茶", section: "contact", displayLabel: "联系" },
];

export function objectMeta(id: StudioObjectId): StudioObjectMeta {
  // 13 个摄影相框：标签 / 提示来自 photography 数据源
  const photo = photoById(id);
  if (photo) {
    return {
      id,
      label: photo.title,
      hint: photo.placeholder ? "后续放 · 图片待补充" : photo.caption,
      section: "works",
      displayLabel: "摄影作品",
      workFilters: ["photo"],
    };
  }
  // 信息技能标签：各自打开对应技能类别 Overlay
  const skillTag = SKILL_TAGS.find((t) => t.id === id);
  if (skillTag) {
    const category = SKILL_CATEGORIES[skillTag.category];
    return {
      id,
      label: category.label,
      hint: `${category.items.length} 项能力`,
      section: "skills",
      displayLabel: category.label,
      skillCategory: skillTag.category,
    };
  }
  const extra = EXTRA_OBJECTS.find((o) => o.id === id);
  if (extra) return extra;
  return STUDIO_OBJECTS.find((o) => o.id === id) ?? STUDIO_OBJECTS[0];
}

/* ------------------------------------------------------------------ */
/* PROFILE                                                             */
/* ------------------------------------------------------------------ */
export const STUDIO_PROFILE = {
  name: "LI SIYU",
  nameZh: "李思雨",
  age: "21",
  role: "新媒体运营",
  school: "西南大学",
  schoolEn: "Southwest University",
  education: "教育学",
  period: "2023.09 - 2027.09",
  city: "重庆",
  tagline: "把空间做成导航，把内容做成对话。",
  email: "3334206878@qq.com",
  phone: "19213397013",
  wechat: "lisi_yu_2026",
} as const;

/* ------------------------------------------------------------------ */
/* ABOUT                                                               */
/* ------------------------------------------------------------------ */
export const ABOUT: AboutContent = {
  positioning:
    "教育学在读，把内容当产品做的新媒体运营者。选题、视觉、数据、AI 都在手上。",
  intro: [
    "在西南大学读教育学，却把大部分时间花在内容上：写选题、做海报、剪视频、盯数据。三年里，我把校园里的大小活动，做成了一条条可以被传播的内容。",
    "我习惯先想清楚「谁会看、为什么看」，再决定标题、封面和发布节奏；然后用阅读、点赞、转发去验证判断，再改下一版。",
    "也把 AI 当成日常工具：用 Claude / ChatGPT 拆结构，用即梦 / 剪映 AI 出视觉和成片，把一个人的产能拉到一个小组。",
  ],
  focus: [
    {
      title: "Content",
      caption: "内容",
      items: ["选题策划", "文案写作", "标题优化", "内容矩阵"],
    },
    {
      title: "Visual",
      caption: "视觉",
      items: ["海报设计", "视觉规范", "版式设计", "摄影"],
    },
    {
      title: "Operation",
      caption: "运营",
      items: ["活动策划", "社群运营", "多渠道分发"],
    },
    {
      title: "User Insight",
      caption: "用户洞察",
      items: ["受众痛点", "内容复盘"],
    },
    {
      title: "Data",
      caption: "数据",
      items: ["SPSS", "内容表现分析"],
    },
    {
      title: "AIGC",
      caption: "AI 赋能",
      items: ["ChatGPT", "Claude", "即梦", "剪映 AI"],
    },
  ],
  facts: [
    { value: "30K+", label: "内容总曝光" },
    { value: "9+", label: "外部媒体转载" },
    { value: "1828", label: "单篇最高阅读" },
    { value: "720", label: "项目覆盖儿童" },
    { value: "300+", label: "单场活动触达" },
    { value: "21", label: "岁 · 西南大学" },
  ],
};

/* ------------------------------------------------------------------ */
/* PROJECTS                                                            */
/* ------------------------------------------------------------------ */
export const PROJECTS: ProjectContent[] = [
  {
    index: "01",
    title: "重庆城口乡村振兴实践传播项目",
    period: "2025.07 - 2025.08",
    role: "入选国家级协同团队 · 内容传播",
    context:
      "入选国家级协同团队，2025 年暑假在重庆城口做乡村振兴实践，负责项目对外的内容传播。",
    goal: "打造实践项目传播矩阵，放大项目公域声量。",
    problem: "实践项目缺少对外内容，校外曝光不足。",
    strategy: [
      "搭建短视频 + 图文 + 专题的组合内容矩阵",
      "统一内容口径，按选题与发布节奏排期",
      "把实践现场素材拆成可复用的短视频与图文",
    ],
    output: [
      "撰写脚本 20 条",
      "独立产出短视频 4 条",
      "公众号推文 3 篇",
    ],
    result: [
      "全渠道总曝光破 3 万",
      "内容被 9+ 校外官方媒体转载",
      "完成公域品牌放大",
    ],
    metrics: [
      { value: "30K+", label: "EXPOSURE" },
      { value: "9+", label: "MEDIA REPOSTS" },
      { value: "20", label: "SCRIPTS" },
      { value: "4", label: "SHORT VIDEOS" },
      { value: "3", label: "ARTICLES" },
      { value: "1125", label: "LIKES / SHARES" },
    ],
    tags: ["内容矩阵", "短视频", "公众号", "公域传播"],
  },
  {
    index: "02",
    title: "STEAM 双语戏剧课赋能西部语言教育项目",
    period: "大学生创新创业训练计划 · 校级铜奖",
    role: "内容传播 · 0-1 冷启动",
    context: "面向西部语言教育的 STEAM 双语戏剧课创业项目，负责项目从 0 到 1 的对外传播。",
    goal: "完成项目冷启动，挖掘潜在受众与合作资源。",
    problem: "项目刚起步，没有现成的受众与内容链路。",
    strategy: [
      "搭建项目内容传播链路",
      "挖掘受众痛点，撰写推文",
      "根据阅读、点赞、转发数据迭代文案",
      "多渠道分发，扩大触达",
    ],
    output: ["产出项目介绍与多轮推文", "沉淀可复用的文案迭代模板"],
    result: ["完成项目从概念到对外传播落地"],
    metrics: [
      { value: "0→1", label: "COLD START" },
      { value: "4", label: "CONTENT ROUNDS" },
      { value: "校铜", label: "大创项目" },
    ],
    tags: ["0-1 冷启动", "用户洞察", "文案迭代"],
  },
  {
    index: "03",
    title: "STEAM + 外语教育智慧学习环境设计与开发项目",
    period: "IACN 大赛 · 国家级三等奖",
    role: "项目成员",
    context: "参与 STEAM + 外语教育智慧学习环境的设计与开发。",
    goal: "以内容与产品视角参与智慧学习环境的设计与对外表达。",
    problem: "教育产品概念抽象，需要被清楚地讲述。",
    strategy: ["参与项目设计与内容表达", "沉淀可复用的项目叙事"],
    output: ["完成项目设计与对外表达材料"],
    result: ["IACN 大赛国家级三等奖"],
    metrics: [
      { value: "国三", label: "IACN AWARD" },
      { value: "STEAM", label: "教育产品" },
    ],
    tags: ["教育产品", "项目叙事", "国三"],
  },
];

/* ------------------------------------------------------------------ */
/* EXPERIENCE                                                          */
/* ------------------------------------------------------------------ */
export const EXPERIENCE: ExperienceContent = {
  headline: "从书架抽出一本经历档案。",
  org: "西南大学教育学部学生会",
  team: "带领 4 人运营团队",
  honors: ["部门 2 次获评「优秀部门」"],
  roles: [
    {
      org: "就业心理服务部",
      role: "负责人",
      summary:
        "统筹部门内容与活动，负责选题、物料、排期与复盘，把「凭感觉发文」变成「按数据迭代」。",
    },
    {
      org: "视觉传达部",
      role: "部长",
      summary:
        "负责海报、封面与活动主视觉的落地，统一字体与配色规范，形成可复用的视觉模板库。",
    },
  ],
  cases: [
    {
      title: "「猫捉老鼠」校园活动运营",
      tagline: "从宣传分散到多链路引流",
      problem: "活动宣传分散，报名转化低。",
      strategy: [
        "搭建 空间 / 朋友圈 / 社群 的多链路引流体系",
        "配套海报、推文与活动物料，统一传播口径",
      ],
      materials: ["海报", "推文", "活动物料"],
      channels: ["空间", "朋友圈", "社群"],
      metrics: [
        { value: "300+", label: "触达" },
        { value: "52", label: "到场转化" },
      ],
      outcome: "验证了一套内容引流的转化模型。",
    },
    {
      title: "「碚贝悦读」绘本志愿项目运营",
      tagline: "把线下共读做成线上内容",
      problem: "绘本志愿项目缺少稳定的视觉与内容产出。",
      strategy: [
        "搭建成套视觉物料生产线",
        "持续输出传播素材",
        "公众号常态化运营",
      ],
      materials: ["视觉物料", "公众号推文"],
      channels: ["公众号", "线下活动"],
      metrics: [
        { value: "720", label: "名儿童覆盖" },
        { value: "15+", label: "篇推文" },
        { value: "1828", label: "单篇最高阅读" },
      ],
      outcome: "入选西部公共图书馆阅读推广五十强。",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* SKILLS — CREATIVE WORKBENCH                                         */
/* ------------------------------------------------------------------ */
export const SKILLS: SkillsContent = {
  intro: "不是进度条，是我每天真正在用的东西。",
  groups: [
    {
      key: "content",
      label: "Content",
      caption: "内容",
      items: [
        "Content Strategy",
        "Content Writing",
        "Social Media",
        "Topic Planning",
        "Headline Optimization",
      ],
    },
    {
      key: "visual",
      label: "Visual",
      caption: "视觉",
      items: ["Poster Design", "Visual Communication", "Graphic Design", "Photography"],
    },
    {
      key: "media",
      label: "Media",
      caption: "媒介",
      items: ["Video Editing", "Short Video", "WeChat Content"],
    },
    {
      key: "data",
      label: "Data",
      caption: "数据",
      items: ["SPSS", "Data Analysis", "Content Performance Review"],
    },
    {
      key: "ai",
      label: "AI",
      caption: "AI 赋能",
      items: ["ChatGPT", "Claude", "即梦", "剪映 AI"],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* WORKS                                                               */
/* ------------------------------------------------------------------ */
/** 真实作品资源（本地 public/assets/portfolio）与真实链接 */
export const WORKS_LINKS = {
  // 手机 → 文字作品（2 篇公众号）
  wechat: [
    "https://mp.weixin.qq.com/s/T9xBw2muzGy2u8Gzh48ZIQ",
    "https://mp.weixin.qq.com/s/zrai2YZ0aklZH-HTbi3uqw",
  ],
} as const;

export const WORKS: WorksContent = {
  intro:
    "摄影机、手机、电脑和照片墙，分别存着影像、文字、视觉与摄影作品。以下都是真实素材。",
  items: [
    /* --- 手机 → 文字作品（2 篇公众号，链接入口） --- */
    {
      id: "wechat-01",
      type: "WECHAT ARTICLE",
      title: "公众号推文 · 01",
      meta: "图文内容",
      description: "点击打开原文。",
      href: WORKS_LINKS.wechat[0],
      layout: "article",
    },
    {
      id: "wechat-02",
      type: "WECHAT ARTICLE",
      title: "公众号推文 · 02",
      meta: "图文内容",
      description: "点击打开原文。",
      href: WORKS_LINKS.wechat[1],
      layout: "article",
    },

    /* --- 电脑 → 易拉宝（2 张真实图片） --- */
    {
      id: "rollup-01",
      type: "ROLL-UP",
      title: "易拉宝 · 01",
      meta: "视觉物料",
      description: "活动主视觉物料。",
      image: "/assets/portfolio/rollup/rollup-1.png",
      layout: "poster",
    },
    {
      id: "rollup-02",
      type: "ROLL-UP",
      title: "易拉宝 · 02",
      meta: "视觉物料",
      description: "活动主视觉物料。",
      image: "/assets/portfolio/rollup/rollup-2.png",
      layout: "poster",
    },

    /* --- 电脑 → 公众号视觉设计（同一篇内容的连续两屏，1 → 2） --- */
    {
      id: "visual-01",
      type: "VISUAL / WECHAT",
      title: "公众号视觉设计",
      meta: "连续图文",
      description: "同一篇内容的连续两屏，按 1 → 2 顺序浏览。",
      images: [
        "/assets/portfolio/visual/visual-1.png",
        "/assets/portfolio/visual/visual-2.png",
      ],
      layout: "visual",
    },

    /* --- 摄影机 → 影像作品（2 个视频）
       注意：按需求，视频 1 = 大展宏图，视频 2 = 城口（标题与文件名的对应以此为准） --- */
    {
      id: "video-01",
      type: "VIDEO",
      title: "视频号 · 大展宏图",
      meta: "短视频",
      description: "项目短视频。",
      video: "/assets/portfolio/video/video-chengkou.mp4",
      layout: "video",
    },
    {
      id: "video-02",
      type: "VIDEO",
      title: "视频号 · 城口",
      meta: "短视频",
      description: "乡村振兴实践短视频。",
      video: "/assets/portfolio/video/video-dazhanhongtu.mp4",
      layout: "video",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* CONTACT                                                             */
/* ------------------------------------------------------------------ */
export const CONTACT: ContactContent = {
  headline: "LET'S TALK.",
  name: STUDIO_PROFILE.name,
  email: STUDIO_PROFILE.email,
  phone: STUDIO_PROFILE.phone,
  wechat: STUDIO_PROFILE.wechat,
  city: STUDIO_PROFILE.city,
  note: "期待和你聊聊内容、活动，或者一杯咖啡。",
  messageSubject: "来自 MY LITTLE STUDIO 的问候",
};
