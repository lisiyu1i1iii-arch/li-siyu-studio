import type {
  Award,
  Experience,
  Project,
  Section,
  Setting,
  Skill,
} from "./types";

/**
 * 初始数据：既被 scripts/seed.ts 写入 Supabase，
 * 也作为前端在 Supabase 未配置/读取失败时的降级内容。
 * 这里的 id 用固定值，方便 seed 脚本幂等 upsert。
 */

export const seedSections: Section[] = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    key: "hero",
    title: "李思雨的新媒体运营作品集",
    content: {
      name: "李思雨",
      role: "新媒体运营 / 内容策划",
      city: "重庆",
      slogan: "把每一次传播，做成一次有温度的对话。",
      summary:
        "新闻传播相关专业在读，3 年校园新媒体实战经验：从选题策划、内容生产到数据复盘全流程独立完成，擅长把活动做成可传播的内容。",
    },
    visible: true,
    sort: 0,
  },
  {
    id: "11111111-1111-4111-8111-111111111112",
    key: "about",
    title: "关于我",
    content: {
      paragraphs: [
        "我是李思雨，一个把「运营」当成创作方式的新媒体人。大学三年，我一直在做同一件事：让好内容被更多人看见。",
        "做过视觉传达部的排版与海报，也做过就业心理服务部的部长；策划过满校园跑的「猫捉老鼠」，也陪着一群孩子读完了一本又一本绘本。",
        "我喜欢用数据说话，也相信文字的重量。习惯在复盘表里找规律，也习惯在深夜里改第 8 版标题。",
      ],
      tags: ["内容策划", "视觉设计", "社群运营", "数据复盘", "活动执行"],
      facts: [
        { label: "校园新媒体实战", value: "3 年" },
        { label: "独立策划活动", value: "12+ 场" },
        { label: "累计产出内容", value: "400+ 篇" },
      ],
    },
    visible: true,
    sort: 1,
  },
  {
    id: "11111111-1111-4111-8111-111111111113",
    key: "contact",
    title: "联系方式",
    content: {
      email: "3334206878@qq.com",
      phone: "19213397013",
      wechat: "lisi_yu_2026",
      city: "重庆",
      note: "期待和你聊聊内容、活动，或者一杯咖啡。",
    },
    visible: true,
    sort: 2,
  },
];

export const seedProjects: Project[] = [
  {
    id: "22222222-2222-4222-8222-222222222201",
    title: "碚贝悦读 · 绘本共读新媒体矩阵",
    subtitle: "亲子阅读项目 · 内容主理人",
    description:
      "为社区亲子阅读项目搭建「公众号 + 视频号 + 小红书」三端内容矩阵，负责选题、脚本、拍摄剪辑与发布节奏。以「一本绘本一个亲子任务」为内容模板，把线下共读活动沉淀为可复用的线上内容。",
    tags: ["内容矩阵", "短视频", "亲子阅读", "选题策划"],
    link: "",
    period: "2024.09 - 2025.06",
    visible: true,
    sort: 0,
  },
  {
    id: "22222222-2222-4222-8222-222222222202",
    title: "「猫捉老鼠」校园社交活动传播",
    subtitle: "主策划 · 全案传播",
    description:
      "策划校园大型躲猫猫社交活动，负责全案传播：预热海报、报名 H5、现场直播与赛后回顾推文。用「角色卡 + 实时战报」的玩法设计提升参与感，活动推文成为当季校园阅读量 Top 3。",
    tags: ["活动策划", "海报设计", "社群裂变", "现场执行"],
    link: "",
    period: "2024.04 - 2024.05",
    visible: true,
    sort: 1,
  },
  {
    id: "22222222-2222-4222-8222-222222222203",
    title: "校园公众号常态化运营",
    subtitle: "日常内容运营 · 数据复盘",
    description:
      "负责公众号日常更新：固定栏目排期、热点跟进、图文排版与粉丝互动。建立选题库与复盘表，把「凭感觉发文」变成「按数据迭代」，连续 6 个月保持稳定更新频率与阅读增长。",
    tags: ["公众号运营", "数据复盘", "排版规范", "粉丝互动"],
    link: "",
    period: "2023.09 - 2025.06",
    visible: true,
    sort: 2,
  },
];

export const seedExperiences: Experience[] = [
  {
    id: "33333333-3333-4333-8333-333333333301",
    org: "SASA 视觉传达部",
    role: "部员",
    period: "2023.09 - 2024.06",
    description:
      "承担社团活动的视觉物料设计，负责海报、易拉宝、推文封面与活动主视觉的落地。",
    highlights: [
      "累计产出海报 / 封面物料 60+ 张，形成可复用的视觉模板库",
      "统一社团字体与配色规范，物料返工率明显下降",
      "配合活动组完成 8 场大型活动的视觉输出",
    ],
    visible: true,
    sort: 0,
  },
  {
    id: "33333333-3333-4333-8333-333333333302",
    org: "就业心理服务部",
    role: "部长",
    period: "2024.09 - 2025.06",
    description:
      "统筹部门全年工作，负责团队分工、活动排期与对外沟通，主导就业与心理两条内容线。",
    highlights: [
      "管理 15 人团队，建立「策划-执行-复盘」三段式工作流",
      "全年落地 10+ 场就业分享与心理团辅活动",
      "部门内容账号粉丝同比增长约 40%",
    ],
    visible: true,
    sort: 1,
  },
  {
    id: "33333333-3333-4333-8333-333333333303",
    org: "「猫捉老鼠」校园活动",
    role: "主策划",
    period: "2024.04 - 2024.05",
    description:
      "从 0 到 1 策划校园社交活动，负责玩法设计、传播节奏与现场统筹。",
    highlights: [
      "报名人数突破 300 人，实际到场率约 85%",
      "活动话题在校园社群持续发酵，形成二次传播",
      "沉淀出可复制的活动 SOP 与物料包",
    ],
    visible: true,
    sort: 2,
  },
  {
    id: "33333333-3333-4333-8333-333333333304",
    org: "碚贝悦读绘本项目",
    role: "内容运营",
    period: "2024.09 - 2025.06",
    description:
      "负责绘本共读项目的内容生产与账号运营，把线下共读转化为线上内容。",
    highlights: [
      "建立「一本绘本一个亲子任务」内容模板，产出效率翻倍",
      "单篇绘本推文最高阅读量为账号历史 Top 1",
      "维护家长社群，日常答疑与内容分发同步进行",
    ],
    visible: true,
    sort: 3,
  },
  {
    id: "33333333-3333-4333-8333-333333333305",
    org: "校园公众号常态化运营",
    role: "内容运营",
    period: "2023.09 - 2025.06",
    description:
      "负责公众号日常更新与数据复盘，保证内容稳定输出与质量统一。",
    highlights: [
      "连续 6 个月保持稳定更新，累计产出图文 400+ 篇",
      "搭建选题库与数据复盘表，按数据迭代内容方向",
      "制定排版规范，统一全站视觉风格",
    ],
    visible: true,
    sort: 4,
  },
];

export const seedSkills: Skill[] = [
  { id: "44444444-4444-4444-8444-444444444401", category: "内容运营", name: "选题策划", level: 5, visible: true, sort: 0 },
  { id: "44444444-4444-4444-8444-444444444402", category: "内容运营", name: "文案写作", level: 5, visible: true, sort: 1 },
  { id: "44444444-4444-4444-8444-444444444403", category: "内容运营", name: "社群运营", level: 4, visible: true, sort: 2 },
  { id: "44444444-4444-4444-8444-444444444404", category: "内容运营", name: "活动策划", level: 4, visible: true, sort: 3 },
  { id: "44444444-4444-4444-8444-444444444405", category: "设计剪辑", name: "Photoshop", level: 4, visible: true, sort: 4 },
  { id: "44444444-4444-4444-8444-444444444406", category: "设计剪辑", name: "剪映 / Premiere", level: 4, visible: true, sort: 5 },
  { id: "44444444-4444-4444-8444-444444444407", category: "设计剪辑", name: "版式与视觉规范", level: 4, visible: true, sort: 6 },
  { id: "44444444-4444-4444-8444-444444444408", category: "设计剪辑", name: "Canva / 稿定", level: 5, visible: true, sort: 7 },
  { id: "44444444-4444-4444-8444-444444444409", category: "数据与AI工具", name: "公众号后台数据分析", level: 4, visible: true, sort: 8 },
  { id: "44444444-4444-4444-8444-444444444410", category: "数据与AI工具", name: "Excel / 表格复盘", level: 4, visible: true, sort: 9 },
  { id: "44444444-4444-4444-8444-444444444411", category: "数据与AI工具", name: "ChatGPT / 文心一言", level: 5, visible: true, sort: 10 },
  { id: "44444444-4444-4444-8444-444444444412", category: "数据与AI工具", name: "Midjourney / 即梦", level: 3, visible: true, sort: 11 },
];

export const seedAwards: Award[] = [
  { id: "55555555-5555-4555-8555-555555555501", title: "全国大学生广告艺术大赛 国家级三等奖", issuer: "全国大学生广告艺术大赛组委会", year: "2024", category: "奖项", visible: true, sort: 0 },
  { id: "55555555-5555-4555-8555-555555555502", title: "大学生创新创业训练计划 市级立项", issuer: "重庆市教育委员会", year: "2024", category: "奖项", visible: true, sort: 1 },
  { id: "55555555-5555-4555-8555-555555555503", title: "校级奖学金（两次）", issuer: "所在学院", year: "2023 / 2024", category: "奖项", visible: true, sort: 2 },
  { id: "55555555-5555-4555-8555-555555555504", title: "优秀共青团员", issuer: "校团委", year: "2024", category: "荣誉", visible: true, sort: 3 },
  { id: "55555555-5555-4555-8555-555555555505", title: "CET-6 大学英语六级", issuer: "教育部考试中心", year: "2024", category: "证书", visible: true, sort: 4 },
  { id: "55555555-5555-4555-8555-555555555506", title: "普通话水平测试 二级甲等", issuer: "国家语言文字工作委员会", year: "2023", category: "证书", visible: true, sort: 5 },
];

export const seedSettings: Setting[] = [
  {
    key: "profile",
    value: {
      name: "李思雨",
      role: "新媒体运营",
      email: "3334206878@qq.com",
      phone: "19213397013",
      city: "重庆",
    },
    visible: true,
    sort: 0,
  },
  {
    key: "room",
    value: {
      title: "李思雨的小屋",
      subtitle: "点一点房间里的东西，看看我做过什么",
      defaultTime: "night",
    },
    visible: true,
    sort: 1,
  },
];
