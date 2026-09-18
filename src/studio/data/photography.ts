import type { PhotoId } from "../types";

/**
 * 摄影作品 · 唯一数据源（works-gallery Skill §20 / §41 / §70）
 *
 * 同一份数据同时驱动：
 *   · 墙上 13 个独立相框（PhotoWall）
 *   · Hover 身份 / 点击身份（InteractiveObject）
 *   · 摄影 Gallery（PhotoGallery）
 *   · Camera Director 的每个相框机位（camera-director）
 *
 * 真实照片尚未提供：image 一律为 null，placeholder = true，状态为「后续放」。
 * 不伪造任何照片、标题或拍摄信息。
 */

export const PHOTO_WALL_Z = -3.9;

export interface PhotoFrameDef {
  /** 世界坐标（后墙左区） */
  x: number;
  y: number;
  /** 相框外框宽 / 高（米）——按对应照片真实宽高比设置 */
  w: number;
  h: number;
  /** 轻微旋转（弧度），保持 editorial 的错落感 */
  r: number;
  /** 照片显示方向：顺时针旋转角度（仅右下角照片为 90） */
  rotate?: number;
  /** 整个相框（边框 + 照片）一起旋转的角度（弧度） */
  groupRotate?: number;
}

export interface PhotoWork {
  id: PhotoId;
  /** 索引标题，不编造真实作品名 */
  title: string;
  /** 简短说明 */
  caption: string;
  /** Gallery 展示用地址（网页优化版；原始作品仍保留在 photography/ 目录） */
  image: string | null;
  /** 3D 相框使用的缩略图（性能） */
  thumb: string | null;
  /** 原始宽高比（w / h），用于不变形适配 */
  aspect: number;
  /** 是否仍是占位素材 */
  placeholder: boolean;
  status: "placeholder" | "published";
  frame: PhotoFrameDef;
}

/**
 * 布局基准（米，世界坐标）：
 *   三行 5 / 4 / 4，紧凑摄影展墙，全部同一规格体系（w 0.56–0.68，h 0.54–0.62）。
 *   横向间距 0.20；纵向间距 ≈ 0.09–0.11。
 *   顶部 ≤ 3.04，完全位于彩灯（串灯）下方（彩灯最低 ≈ 3.15）。
 *   底部 ≥ 0.99，位于 LowShelf / Succulents 之上。
 *   x 范围 ≈ -3.53 … 0.43，向右利用墙面，避开 Academic Posters / Desk。
 */
const ROW1_Y = 2.74;
const ROW2_Y = 2.0;
const ROW3_Y = 1.28;

/** 13 张真实摄影作品的原始宽高比（w / h），用于相框内不变形适配 */
const PHOTO_ASPECTS: number[] = [
  1279 / 1706, // 01
  1706 / 1279, // 02
  1279 / 1706, // 03
  1706 / 1279, // 04
  4032 / 3024, // 05
  4032 / 3024, // 06
  4032 / 3024, // 07
  4032 / 2268, // 08
  4032 / 3024, // 09
  4032 / 3024, // 10
  4032 / 3024, // 11
  4032 / 3024, // 12
  4032 / 3024, // 13
];

function work(n: number, frame: PhotoFrameDef): PhotoWork {
  const id = `photo-${String(n).padStart(2, "0")}` as PhotoId;
  const nn = String(n).padStart(2, "0");
  return {
    id,
    title: `摄影作品 ${nn}`,
    caption: "摄影作品",
    // Gallery 使用网页优化版（长边 ≤1600、q82），避免加载 3–7MB 的 12MP 原图
    image: `/assets/portfolio/photography/gallery/photo-${nn}.jpg`,
    thumb: `/assets/portfolio/photography/thumbs/photo-${nn}.jpg`,
    aspect: PHOTO_ASPECTS[n - 1] ?? 1,
    placeholder: false,
    status: "published",
    frame,
  };
}

/**
 * 三行 5 / 4 / 4，13 个相框同一规格体系（无补位小框），紧凑摄影展墙。
 * 横向间距 0.20；纵向间距 ≈ 0.09–0.11。
 * 全部位于彩灯（串灯，最低 ≈ 3.15）下方，且位于 LowShelf / Succulents 上方。
 * 所有相框 bounding box 互不重叠（含 hover 1.035 缩放余量）。
 */
/*
 * 相框尺寸按对应照片真实宽高比设置（竖幅 0.75 / 横幅 1.333 / 宽幅 1.778），
 * 中心坐标与轻微旋转保持原有排版节奏，互不重叠。
 * 右下角 photo-13 按需求将照片顺时针旋转 90°（显示为竖幅）。
 */
export const PHOTOGRAPHY: PhotoWork[] = [
  // Row 1 — 5（y ≈ 2.74）
  work(1, { x: -3.21, y: ROW1_Y, w: 0.45, h: 0.6, r: -0.02 }), // 竖幅 0.75
  work(2, { x: -2.4, y: ROW1_Y + 0.02, w: 0.66, h: 0.495, r: 0.015 }), // 横幅
  work(3, { x: -1.57, y: ROW1_Y - 0.02, w: 0.45, h: 0.6, r: -0.015 }), // 竖幅
  work(4, { x: -0.73, y: ROW1_Y + 0.01, w: 0.66, h: 0.495, r: 0.02 }), // 横幅
  work(5, { x: 0.1, y: ROW1_Y - 0.01, w: 0.66, h: 0.495, r: -0.01 }), // 横幅
  // Row 2 — 4（y ≈ 2.00）
  work(6, { x: -3.0, y: ROW2_Y, w: 0.66, h: 0.495, r: 0.015 }),
  // 第二排第二个：整块相框（边框 + 照片）一起顺时针旋转 90°
  work(7, { x: -2.15, y: ROW2_Y, w: 0.66, h: 0.495, r: -0.02, groupRotate: -Math.PI / 2 }),
  work(8, { x: -1.32, y: ROW2_Y + 0.02, w: 0.68, h: 0.382, r: 0.015 }), // 宽幅 1.778
  work(9, { x: -0.51, y: ROW2_Y - 0.01, w: 0.66, h: 0.495, r: -0.015 }),
  // Row 3 — 4（y ≈ 1.28）
  work(10, { x: -2.67, y: ROW3_Y, w: 0.66, h: 0.495, r: -0.015 }),
  work(11, { x: -1.84, y: ROW3_Y + 0.02, w: 0.66, h: 0.495, r: 0.02 }),
  work(12, { x: -1.03, y: ROW3_Y - 0.02, w: 0.66, h: 0.495, r: -0.015 }),
  // 右下角：照片顺时针旋转 90°（显示为竖幅）
  work(13, { x: -0.24, y: ROW3_Y + 0.01, w: 0.45, h: 0.6, r: 0.015, rotate: 90 }),
];

export const PHOTO_COUNT = PHOTOGRAPHY.length;

export function photoIndexOf(id: PhotoId): number {
  return PHOTOGRAPHY.findIndex((p) => p.id === id);
}

export function photoById(id: string): PhotoWork | undefined {
  return PHOTOGRAPHY.find((p) => p.id === id);
}
