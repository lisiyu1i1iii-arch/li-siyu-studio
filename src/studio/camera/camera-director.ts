import { PHOTO_WALL_Z, PHOTOGRAPHY } from "../data/photography";
import { FOCUS_TAGS, SKILL_TAGS, tagCenter } from "../data/skills";
import type {
  ActionObjectId,
  CameraTarget,
  CameraView,
  ExtraObjectId,
  FocusTagId,
  PhotoId,
  SkillTagId,
} from "../types";

export type { CameraView };

/**
 * 室内观察模型（Camera Director 的机位表）。
 * position = 观察者站位（室内），target = 视线落点。
 * 机位机制未变，仅随 PHASE 2.8 新布局更新坐标。
 */
export const STUDIO_VIEWS: Record<
  Exclude<
    CameraTarget,
    PhotoId | SkillTagId | FocusTagId | ExtraObjectId | ActionObjectId
  >,
  CameraView
> = {
  // 入场第一视角：站在入口稍后、视线略高、轻微俯视。
  // 配合较窄 FOV（55°）与略近站位，让家具形成紧凑的空间聚落，不再显得空旷。
  default: {
    position: [0.2, 2.3, 5.2],
    target: [0, 0.9, -1.6],
  },
  // 后墙右中 · 桌面显示器（已随工作区右移到海报下方）→ 视觉类设计
  computer: {
    position: [1.7, 1.5, -2.3],
    target: [2.9, 1.25, -3.7],
  },
  // 后墙左 · 13 个大相框 → 摄影作品
  photoWall: {
    position: [-1.9, 1.8, -2.2],
    target: [-3.1, 1.8, -3.9],
  },
  // 后墙右上 · 左侧海报（唯一可交互）→ 个人信息
  poster: {
    position: [2.45, 2.0, -2.3],
    target: [2.45, 2.28, -3.9],
  },
  // Desk 左前 · 三脚架相机（已随工作区右移）→ 影视作品
  camera: {
    position: [0.1, 1.4, -1.8],
    target: [1.15, 1.2, -2.7],
  },
  // 桌面 · 竖立手机（已随工作区右移）→ 文字作品
  phone: {
    position: [2.6, 1.3, -2.4],
    target: [3.65, 0.9, -3.5],
  },
  // 左墙 · 世界地图上方标签绳 → 技能
  labelString: {
    position: [-3.4, 2.3, 0.6],
    target: [-4.8, 2.7, 0.6],
  },
};

/**
 * 13 个相框各自的机位：从相框正前方略高一点看过去。
 * 由同一份 photography 数据生成，不新增第二套相机状态。
 */
export const PHOTO_VIEWS = Object.fromEntries(
  PHOTOGRAPHY.map((photo) => [
    photo.id,
    {
      position: [photo.frame.x, photo.frame.y + 0.08, PHOTO_WALL_Z + 1.75],
      target: [photo.frame.x, photo.frame.y, PHOTO_WALL_Z],
    } satisfies CameraView,
  ]),
) as Record<PhotoId, CameraView>;

/**
 * 技能绳最右侧 4 个标签的机位：由同一份 skills 数据生成。
 * 站在标签正前方（室内），略微俯视标签。
 */
export const SKILL_VIEWS = Object.fromEntries(
  SKILL_TAGS.map((tag) => {
    const [x, y, z] = tagCenter(tag.t);
    return [
      tag.id,
      {
        position: [x + 1.55, y + 0.08, z],
        target: [x, y, z],
      } satisfies CameraView,
    ];
  }),
) as Record<SkillTagId, CameraView>;

/**
 * 6 个“无文字”聚焦标签的机位：由同一份数据生成。
 * 只聚焦放大，不打开 Overlay。
 */
export const FOCUS_TAG_VIEWS = Object.fromEntries(
  FOCUS_TAGS.map((tag) => {
    const [x, y, z] = tagCenter(tag.t);
    return [
      tag.id,
      {
        position: [x + 1.55, y + 0.08, z],
        target: [x, y, z],
      } satisfies CameraView,
    ];
  }),
) as Record<FocusTagId, CameraView>;

/**
 * 新增信息物体的机位表（右侧沙发 / 三扇窗 / 抱枕 / 玩偶 / 蓝色书 / 多肉 / 纸张）。
 * 与 STUDIO_VIEWS 同一套“站位 + 视线落点”机制。
 */
export const OBJECT_VIEWS: Record<ExtraObjectId, CameraView> = {
  // 所有机位均保持在 ±18° 俯仰限制内，避免 OrbitControls 恢复时被 clamp 跳变
  sofa: { position: [0.2, 1.1, 2.6], target: [1.05, 0.6, 0.95] },
  "window-01": { position: [3.2, 1.7, -2.2], target: [5.0, 1.7, -2.2] },
  "window-02": { position: [3.2, 1.7, 0.6], target: [5.0, 1.7, 0.6] },
  "window-03": { position: [3.2, 1.7, 3.0], target: [5.0, 1.7, 3.0] },
  "pillow-01": { position: [3.4, 1.0, -2.62], target: [4.68, 0.72, -2.62] },
  "pillow-02": { position: [3.4, 1.0, -2.12], target: [4.68, 0.71, -2.12] },
  "pillow-03": { position: [3.4, 1.0, 0.18], target: [4.68, 0.72, 0.18] },
  "pillow-04": { position: [3.4, 1.0, 0.68], target: [4.68, 0.71, 0.68] },
  "doll-01": { position: [3.4, 0.9, -1.68], target: [4.65, 0.6, -1.68] },
  "doll-02": { position: [3.4, 0.9, 1.12], target: [4.65, 0.6, 1.12] },
  "book-blue-01": { position: [-3.3, 0.6, -2.6], target: [-4.72, 0.24, -2.6] },
  "book-blue-02": { position: [-3.3, 1.65, -2.6], target: [-4.72, 1.4, -2.6] },
  "succulent-01": { position: [0.2, 1.15, -2.2], target: [0.2, 0.78, -3.72] },
  "succulent-02": { position: [0.5, 1.15, -2.2], target: [0.5, 0.78, -3.72] },
  "succulent-03": { position: [0.8, 1.15, -2.2], target: [0.8, 0.78, -3.72] },
  // 圆桌：聚焦到桌面水杯附近（俯仰保持在 ±18° 内）
  roundTable: { position: [0.05, 1.0, 2.3], target: [0.05, 0.42, 0.35] },
};

/** 统一解析机位：摄影 → PHOTO_VIEWS，标签 → SKILL/FOCUS，新增物体 → OBJECT_VIEWS，其余 → STUDIO_VIEWS。 */
export function resolveView(target: CameraTarget): CameraView {
  if (target.startsWith("photo-")) {
    return PHOTO_VIEWS[target as PhotoId] ?? STUDIO_VIEWS.default;
  }
  if (target.startsWith("skill-")) {
    return SKILL_VIEWS[target as SkillTagId] ?? STUDIO_VIEWS.default;
  }
  if (target.startsWith("focus-tag-")) {
    return FOCUS_TAG_VIEWS[target as FocusTagId] ?? STUDIO_VIEWS.default;
  }
  if (target in OBJECT_VIEWS) {
    return OBJECT_VIEWS[target as ExtraObjectId];
  }
  return (
    STUDIO_VIEWS[target as keyof typeof STUDIO_VIEWS] ?? STUDIO_VIEWS.default
  );
}

/**
 * 旋转轴心半径。
 * OrbitControls 只负责环视：轴心放在相机正前方 LOOK_RADIUS 处。
 */
export const LOOK_RADIUS = 0.2;

/** 上下视角限制：约 ±18°（OrbitControls 极角 = 90° + 俯仰角） */
export const LOOK_PITCH_DEG = 18;

/**
 * 左右旋转边界：±90°。
 * 0° = 正对后墙；±90° = 正对左右两侧墙（墙的端点）。
 * 不允许继续向后旋转看到没有墙的入口一面。
 */
export const LOOK_YAW_DEG = 90;

export const ORBIT_LIMITS = {
  lookRadius: LOOK_RADIUS,
  minDistance: LOOK_RADIUS,
  maxDistance: LOOK_RADIUS,
  minPolarAngle: Math.PI / 2 - (LOOK_PITCH_DEG * Math.PI) / 180,
  maxPolarAngle: Math.PI / 2 + (LOOK_PITCH_DEG * Math.PI) / 180,
  minAzimuthAngle: -(LOOK_YAW_DEG * Math.PI) / 180,
  maxAzimuthAngle: (LOOK_YAW_DEG * Math.PI) / 180,
  rotateSpeed: 0.6,
  dampingFactor: 0.08,
};

/**
 * 浏览（default）模式：浅 U 型移动浏览。
 *
 * 关键点：把 OrbitControls 的轴心从「相机正前方 0.2m」换成房间内部的观察中心。
 * 这样左右拖动时相机不再原地自转，而是沿一条半径 ≈ 7.5m 的浅弧横向移动：
 *   中央 = 当前默认构图（u = 0）
 *   左右端 = 偏航 ±yawDeg，对应左右墙尾部安全范围
 * 相机始终看向轴心 → 房间内部永远是视觉中心，不会翻出墙外。
 *
 * 聚焦（点击物体）时仍使用「贴近相机的轴心」原地环视，互不覆盖。
 */
export const BROWSE = {
  /** 浅 U 的轴心 = 默认视线落点 */
  pivot: STUDIO_VIEWS.default.target,
  /** 普通浏览 FOV：收窄到 55°，去掉超广角 / 鱼眼室内感 */
  fov: 55,
  /** 左右最大偏航角（端点），再大就会靠近 / 越过侧墙 */
  yawDeg: 27,
  /** 浏览时的俯仰范围（比聚焦更窄，避免远轴心让镜头穿地/穿顶、保持浅 U） */
  minPolarDeg: 73,
  maxPolarDeg: 84,
  /** 浏览轨道半径的安全范围（缩放已禁用，仅用于 clamp 保护） */
  minDistance: LOOK_RADIUS,
  maxDistance: 30,
};

/** 聚焦（点击物体）时的 FOV：保持原有 68°，不破坏既有聚焦取景 */
export const FOCUS_FOV = 68;

/** 聚焦（非 default）模式：贴近相机的轴心 + 原有 ±90° / ±18° 边界 */
export const FOCUS_LIMITS = {
  minDistance: LOOK_RADIUS,
  maxDistance: 30,
  minPolarAngle: ORBIT_LIMITS.minPolarAngle,
  maxPolarAngle: ORBIT_LIMITS.maxPolarAngle,
  minAzimuthAngle: ORBIT_LIMITS.minAzimuthAngle,
  maxAzimuthAngle: ORBIT_LIMITS.maxAzimuthAngle,
};

/** 由「站位 + 视线落点」算出贴近相机的 OrbitControls 轴心 */
export function orbitTargetFor(
  position: [number, number, number],
  look: [number, number, number],
): [number, number, number] {
  const dx = look[0] - position[0];
  const dy = look[1] - position[1];
  const dz = look[2] - position[2];
  const len = Math.hypot(dx, dy, dz) || 1;
  return [
    position[0] + (dx / len) * LOOK_RADIUS,
    position[1] + (dy / len) * LOOK_RADIUS,
    position[2] + (dz / len) * LOOK_RADIUS,
  ];
}
