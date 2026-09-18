# Project Handoff / Context Recovery Skill

> 本文件是 **LI SIYU — MY LITTLE STUDIO** 项目的交接 / 上下文恢复文档。
> 它描述「当前实际状态」，不是最初的设计稿。**仓库代码是唯一事实来源**；
> 若本文件与代码冲突，以代码为准，并顺手更正本文件。

---

## ROLE

你接手的是一个**已经开发完成、正在做定向视觉 / 交互迭代**的个人 3D 作品集项目：

**LI SIYU — MY LITTLE STUDIO**

核心原则：

> Inspect → Understand → Minimal Change → Validate

绝不默认：

> Rewrite → Refactor → Redesign

当前阶段：

**定向视觉与交互修正（持续迭代中）** —— 已不是最初的「FINAL QA」，
用户会按轮次提出非常具体的修改；每轮只做该轮要求，禁止顺手改无关内容。

**不要进入 Phase 6，除非用户明确说「进入 Phase 6」。**

---

## 1. 技术栈（来自 package.json，已核实）

- Next.js **14.2.5**（App Router）
- React **18.3.1** / react-dom 18.3.1
- @react-three/fiber **8.16.8** / @react-three/drei **9.108.3**
- three **0.166.1**
- zustand **4.5.4**
- TypeScript **5.5.4**
- Tailwind CSS **3.4.10** + tailwind-merge / clsx / class-variance-authority / tailwindcss-animate
- framer-motion **11.3.24**
- lucide-react、sonner、Radix UI（dialog / label / select / slot / switch / tabs）
- Supabase（@supabase/ssr、@supabase/supabase-js）→ 仅用于 `/cv`、`/admin`

脚本：

```
npm run dev        # next dev
npm run build      # next build
npm run start      # next start
npm run lint       # next lint
npm run typecheck  # tsc --noEmit
npm run seed       # tsx scripts/seed.ts
```

**没有 `npm test`。** 不要擅自引入测试框架。

`next.config.mjs`：`reactStrictMode: true`，`images.remotePatterns` 允许 https。

---

## 2. 路由与结构

- `/` → `src/app/page.tsx` → `src/studio/StudioExperience.tsx`（3D Studio）
- `/cv` → `src/app/cv/page.tsx`（独立 HR 平面简历，Supabase）
- `/admin` → `src/app/admin/page.tsx` + `src/components/AdminPanel.tsx`（独立后台）

三条路由必须互相独立：Studio 的改动不能破坏 `/cv` / `/admin`。

`src/studio/` 主要文件：

```
StudioExperience.tsx          # 顶层外壳：Entry(DOM) / 3D Scene 分离
types.ts                      # StudioObjectId / CameraView / WorkItem 等
store/studio-store.ts         # 统一交互状态机（核心）
camera/camera-director.ts     # 机位表 + BROWSE/FOCUS 常量 + resolveView
camera/CameraRig.tsx          # Camera Director 执行者（浏览/聚焦轴心切换 + FOV 过渡）
scene/StudioScene.tsx         # Canvas / OrbitControls
scene/StudioEnvironment.tsx   # 房间、墙、窗、屋顶、RightWall
scene/WindowBackdrop.tsx      # 窗外 2D 平面森林（白天/夜晚）
scene/StudioLighting.tsx      # 昼夜灯光系统 + NIGHT_LAMPS
scene/StudioObjects.tsx       # 物体编排
scene/PlankFloor.tsx          # 地板（单 InstancedMesh）
objects/InteractiveObject.tsx # 统一交互外壳（info / focus / action）
objects/primitives.tsx        # 共享 geometry/material 缓存（Box/Cyl/Sphere）
objects/LeftWall.tsx          # 五层书架 + 树绘挂载 + 标签绳 + 黑板 + 地球仪
objects/WallMural.tsx         # 左墙树木墙绘 + 绿/黄切换 + 树木 hitbox
objects/PhotoWall.tsx         # 13 相框 + 低书架 + 多肉群体蹦跳
objects/DeskStation.tsx       # 工作桌 + 显示器 + 台灯 + 手机 + 桌面水杯热气
objects/LivingZone.tsx        # 地毯 + 茶几(圆桌) + 两沙发 + 坐垫 + 落地灯 + 扫地机器人
objects/Pets.tsx              # 猫 / 柯基
objects/HangingLights.tsx     # 两个藤编吊灯 + 串灯
objects/AcademicPoster.tsx    # 个人展示框（可交互）+ 装饰海报 + 电脑上方黄铜灯
objects/CameraStation.tsx     # 三脚架相机
objects/CeilingFan.tsx        # 吊扇（四阶段速度）
objects/WindowZone.tsx        # 右侧无靠背沙发 + 抱枕/玩偶 + Monstera
objects/Mailbox.tsx           # ⚠️ 保留文件但 Studio 中未使用（Entry 的 Mailbox 在 LoadingScreen 里）
objects/Bookshelf.tsx         # ⚠️ 保留文件但未使用（书架已拆分到 LeftWall / PhotoWall）
overlays/ContentOverlay.tsx   # 居中信息 Overlay（稳定 variants）
overlays/PhotoGallery.tsx     # 摄影 Gallery（居中）
overlays/bodies/*             # About/Projects/Experience/Works/Skills/SkillCategory/Contact
ui/*                          # TopBar / MenuPanel / QuickMenu / QuickViewPanel / FocusExitButton / LoadingScreen / StudioErrorBoundary / EntryContactModal / editorial
hooks/use-device-profile.ts   # WebGL / mobile / performance 检测
data/studio-content.ts        # 内容源 + 物体→内容映射（STUDIO_OBJECTS / EXTRA_OBJECTS / objectMeta）
data/photography.ts           # 13 张摄影作品唯一数据源
data/skills.ts                # SKILL_TAGS / FOCUS_TAGS / SKILL_CATEGORIES
```

全局：

- `src/lib/pointer-guard.ts` → `isRealClick`（区分点击 / 拖拽）
- `src/lib/sound.ts` → WebAudio 合成音效（click/open/close/switch/meow）。**雨声已删除。**
- `src/lib/data.ts`、`src/lib/seed-data.ts`、`src/lib/types.ts` → `/cv`、`/admin`、`scripts/seed.ts` 仍在用，**不要删除**。

---

## 3. 已完成功能（当前实际状态）

### 3.1 空间 / 房间
- 房间、墙、屋顶、地板、窗户、树绘、家具均已实现并多轮迭代。
- 左墙：五层书架 + 地球仪（装饰）+ 树木墙绘 + 标签绳 + 绿色小黑板。
- 后墙：13 相框摄影墙 + 低书架 + 工作桌 + 个人展示框 + 三脚架相机 + 电脑上方黄铜吊灯。
- 中央：大地毯 + 圆桌 + 左休闲椅 + 右藤编扶手椅 + 坐垫 + 落地灯。
- 右侧：三扇拱窗（右墙）+ 两张无靠背沙发（含抱枕/玩偶）+ Monstera。
- 屋顶：木梁 + 持续旋转吊扇（已下移便于看到）。
- 宠物：阿比西尼亚猫（左沙发）+ 柯基；扫地机器人（地毯与左墙之间）。
- 吊灯：两个藤编半球吊灯 + 照片墙上方串灯。

### 3.2 窗外环境（2D 平面森林）
- `WindowBackdrop.tsx` 只使用**平面 Plane + CanvasTexture**，**没有 3D 树**。
- 三层：天空底板 44×22 + 白天森林 24×12 + 夜晚森林覆盖层 24×12，全部 `fog={false}`。
- 夜晚会把白天森林平面本身也压暗，避免任何角度露出白天/白色。
- **无雨、无雨滴、无玻璃水滴、无雨声**（已彻底删除）。

### 3.3 昼夜系统
- 统一 `store.dayNight: "day" | "night"` + `toggleDayNight()`。
- 切换入口（共用同一状态，均不聚焦、不 Overlay、无黄色点）：
  - 落地灯、吊灯 1、吊灯 2、**电脑桌台灯**、**照片墙上方串灯**。
- `StudioLighting` 按 night factor 平滑过渡：阳光/环境光/半球光/天窗光大幅降低；
  夜间点亮隐藏点光源（落地灯、两个吊灯、桌面台灯、电脑上方黄铜灯）+ 显示器屏幕光。
- 夜晚灯罩（藤编吊灯、落地灯、台灯）有 emissive 柔光，看不到裸露灯泡。
- 串灯夜间为暖黄微光（共享一个灯泡材质 emissive + 一盏极弱共享 PointLight）。
- `scene.background` / `scene.fog` 由 `#f4ddbd` lerp 到 `#141c26`。

### 3.4 真实作品资源（已接入）
`public/assets/portfolio/`：

```
personal/personal-1..3.jpg (+ thumbs/)        # 个人照片 → 个人展示框（3D 用 thumbs）
photography/photo-01..13.jpg (+ thumbs/)      # 13 摄影作品 → 相框(thumbs) + Gallery(原图)
rollup/rollup-1..2.png (+ thumbs/)            # 易拉宝 → 电脑屏幕(thumbs) + Overlay(原图)
visual/visual-1..2.png                        # 公众号视觉设计（连续 1→2）
video/video-chengkou.mp4                      # 影像作品 1（标题：大展宏图）
video/video-dazhanhongtu.mp4                  # 影像作品 2（标题：城口）
```

- 3D 纹理统一使用缩略图（避免全尺寸占显存）；Overlay / Gallery 使用原图。
- 页面中只引用 `/assets/...`，**不写 Windows 绝对路径**。

### 3.5 交互状态机（核心，已重构）
`store/studio-store.ts` 把「Camera Focus」与「Info Overlay」分离：

```
NORMAL
  ↓ 点击「有信息物品」
FOCUSED_INFO_OPEN      camera focused + overlay open（activateObject / activatePhoto）
  ↓ 关闭信息（关闭按钮 / Esc）
FOCUSED_INFO_CLOSED    camera 保持聚焦，overlay 关闭（closeOverlay 只关 overlay）
  ↓ 再点击当前聚焦物品 / 点击「返回」按钮
NORMAL                 恢复唯一 ENTER_DEFAULT_CAMERA（exitFocus）
```

关键 action：

- `focusObject(id)`：只聚焦（用于无信息的聚焦标签）。
- `activateObject(id)`：**一次点击 = 聚焦 + 打开居中信息**（幂等：已在打开则 return）。
- `activatePhoto(id, index)`：**一次点击 = 聚焦 + 打开 Gallery**。
- `closeOverlay()` / `closePhotoGallery()`：**只关闭信息层，绝不恢复相机**。
- `exitFocus()`：退出聚焦，`cameraTarget="default"`、`cameraOverride=null` → 恢复默认镜头。
- `selectObject(id)`：QuickMenu / MenuPanel 快捷入口，等价于 activateObject。
- `openSection(section)`：打开某板块（无具体物体，不聚焦）。
- `cameraOverride` 字段保留但**始终为 null**。

`InteractiveObject.tsx` 三种模式：

- `info`（默认）：未聚焦 → `activateObject` / `activatePhoto`；已聚焦 → `exitFocus`。
- `focus`：未聚焦 → `focusObject`；已聚焦 → `exitFocus`（不弹信息）。
- `action`：点击直接 `onActivate()`（宠物 / 风扇 / 灯 / 扫地机器人 / 电脑椅 / 黑板）。

Hover：仅轻微放大（1.035）+ 上浮（0.025）+ 光标 pointer，**无文字、无 tooltip、无黄色点**。
点击保护：`isRealClick` + `locked`（overlay 打开或 gallery 打开时锁定 3D 点击）。

### 3.6 Overlay 视觉与动画
- 居中弹出（非侧抽屉、非边缘滑入），`AnimatePresence mode="wait"`。
- 入场动画使用**模块级稳定 variants**：opacity 0→1；scale 0.85→1.04→0.98→1；y 18→-6→3→0；约 0.42s。
- 关闭：opacity→0、scale→0.98，退出动画结束后才 unmount。
- **不能通过点击背景关闭**；Esc / 关闭按钮可关闭（且只关 Overlay）。
- 同一物品打开期间 key 稳定（不重复 mount / 不重播动画）。

### 3.7 直接动画交互（不进入 Focus + Overlay）
这些用**本地 onClick + isRealClick**，无 Overlay、无聚焦、无黄色点：

- **树木墙绘**（`WallMural.tsx`）：点击树叶绿色 ⇄ 黄色平滑切换（两张仅叶色不同的贴图交叉淡入）。
  有**树木专用 hitbox（5.4×3.0）**，不覆盖整面墙；黑板/书架/标签绳各自拦截点击。
- **地毯**（`LivingZone.tsx` RoundRug）：点击米白 ⇄ 柔和植物绿（#8FA57E）平滑切换；只有地毯圆柱响应，
  坐垫 / 两沙发 / 圆桌全部 `stopPropagation`。
- **多肉**（`PhotoWall.tsx` Succulents）：点击任意一盆 → 三盆一起向左蹦跳到书列右侧再蹦回原位，
  每盆有独立 target / jumpH / delay / phase，无重叠。
- **黑板**（`LeftWall.tsx` Blackboard）：独立 `InteractiveObject id="blackboard" mode="action"`；
  点击后中央粉笔字「Hello」淡入 1.0s → 停留 0.6s → 淡出 1.5s；连续点击只重置。
- **串灯**（`HangingLights.tsx` StringLights）：点击 → `toggleDayNight()`。

### 3.8 物体 → 内容映射（已核实，最高优先级）

| 物体 | id | 目标 | 类型 |
|---|---|---|---|
| 照片墙 / 13 相框 | `photoWall` / `photo-01..13` | 摄影作品（Gallery） | info（photo 走 activatePhoto） |
| 电脑 | `computer` | 视觉类设计（易拉宝 poster + 公众号视觉 visual） | info |
| 个人展示框（电脑上方） | `poster` | 个人信息 | info |
| 摄影机 | `camera` | 影像作品（2 视频） | info |
| 手机 | `phone` | 文字作品（2 公众号链接） | info |
| 标签绳 / 4 信息标签 | `labelString` / `skill-*` | 技能 | info |
| 其余 6 个标签 | `focus-tag-*` | 只聚焦（无文字、无 Overlay） | focus |
| 圆桌 | `roundTable` | 联系（聚焦时水杯冒热气） | info |
| 三扇窗 / 抱枕 / 玩偶 | `window-*` / `pillow-*` / `doll-*` | 关于我 | info |
| 五层书架两本蓝书 | `book-blue-01/02` | **只聚焦，不弹信息** | focus |
| 树木 / 地毯 / 多肉 / 黑板 / 串灯 | — | 直接动画 | 本地 handler / action |
| 地球仪 / 电脑桌纸张 | — | 纯装饰，无交互 | — |

**绝对不要对应错**：个人展示框=个人信息；摄影机=影像；手机=文字；照片墙=摄影；电脑=易拉宝；便签=技能。

`data/studio-content.ts` 中 `STUDIO_OBJECTS`（进 QuickMenu 的 6 个）+ `EXTRA_OBJECTS`（其余信息物体）；
`objectMeta(id)` 解析顺序：photo → skill tag → EXTRA_OBJECTS → STUDIO_OBJECTS。

`data/studio-content.ts` 的 `WORKS.items`（WorkLayout = `article | poster | visual | video | photo`）：

- article ×2 → `WORKS_LINKS.wechat`（2 个公众号链接）→ 手机。
- poster ×2 → `rollup/rollup-1|2.png` → 电脑（RollupViewer 前后切换）。
- visual ×1 → `visual/visual-1|2.png`（连续 1→2）→ 电脑。
- video ×2 → `video-chengkou.mp4`（标题「大展宏图」）/ `video-dazhanhongtu.mp4`（标题「城口」）→ 摄影机。

### 3.9 摄影墙
- 13 个独立相框，每个是独立 `InteractiveObject`；尺寸按各自照片真实宽高比（竖 0.75 / 横 1.333 / 宽 1.778）。
- 相框内用缩略图 `contain`（不拉伸、不裁切）；Gallery 用原图，支持上一张/下一张/键盘 ←→/Esc/移动端滑动/循环。
- **photo-07（第二排第二个）**：整块相框（边框+照片）一起顺时针旋转 90°（`frame.groupRotate = -π/2`）。
- **photo-13（右下角）**：仅照片顺时针旋转 90°（`frame.rotate = 90`）。
- 其余 11 个相框未做整体旋转。

### 3.10 相机（Camera Director）
- 默认机位 `STUDIO_VIEWS.default`：position `[0.2, 2.3, 5.2]`，target `[0, 0.9, -1.6]`。
- 浏览（default）FOV = **55**；聚焦 FOV = **68**（CameraRig 平滑过渡）。
- 浏览模式：OrbitControls 轴心放到房间内部（`BROWSE.pivot` = 默认 target），
  左右拖动沿**矮 U 型浅弧**横向移动；`BROWSE.yawDeg = 27`、polar `[73, 84]`、distance `[0.2, 30]`、rotateSpeed 0.3。
- 聚焦模式：轴心贴近相机（`LOOK_RADIUS = 0.2`）原地环视；azimuth ±90（`LOOK_YAW_DEG`）、polar ±18、rotateSpeed 0.6。
- `exitFocus` / `closeOverlay` 后统一恢复 **ENTER_DEFAULT_CAMERA**（= `STUDIO_VIEWS.default` + `BROWSE.fov` + 浏览 limits），
  **不是「差不多的位置」**；`ENTER_DEFAULT_CAMERA === RESTORE_CAMERA`。
- `enableZoom=false`（无自由缩放）；`enablePan=false`；有 damping。

### 3.11 桌面水杯热气
- `DeskStation.tsx` 的 `DeskSteam`：当 `focusedObject ∈ [camera, computer, phone]` 时，桌面水杯冒热气（白/半透明粒子）。
- `LivingZone.tsx` 的 `CupSteam`：当 `focusedObject === "roundTable"` 时，圆桌水杯冒热气。
- 两者均为少量 Points、单一 `useFrame`、复用 geometry/material，无逐帧对象创建。

### 3.12 错误 / 加载
- `StudioErrorBoundary` 存在：3D 运行失败显示暖色兜底，DOM UI / QuickView 仍可用。
- Entry 为纯 DOM；点击 Door 后 `dynamic` 加载 3D chunk（`EnteringBackdrop` 过渡）。

---

## 4. 最近修改过的代码与文件（本轮交接前）

最近若干轮主要改动（均已通过 typecheck/lint/build）：

- `scene/WindowBackdrop.tsx`：删除 3D 森林与雨系统，改为纯 2D 平面森林 + 夜晚压暗 + `fog=false` + 更大覆盖。
- `scene/StudioLighting.tsx`：昼夜灯光 + NIGHT_LAMPS + 背景/雾 lerp。
- `scene/StudioScene.tsx`：FOV 55、OrbitControls 浏览 limits。
- `camera/camera-director.ts`：BROWSE / FOCUS_FOV / FOCUS_LIMITS / OBJECT_VIEWS（含 roundTable）。
- `camera/CameraRig.tsx`：浏览远轴心 / 聚焦近轴心切换 + FOV 过渡。
- `store/studio-store.ts`：交互状态机重构（focus/overlay 分离、activateObject/activatePhoto、close 不恢复相机、exitFocus 恢复默认、幂等）。
- `objects/InteractiveObject.tsx`：移除黄色光点；新增 info/focus/action 三模式与一次性 activate。
- `overlays/ContentOverlay.tsx` / `overlays/PhotoGallery.tsx`：稳定 variants + 稳定 key + 弹跳入场；关闭只关信息。
- `objects/DeskStation.tsx`：显示器屏幕内两张易拉宝（缩小 + 柔和阴影）、屏幕降亮、手机虚拟推文排版、台灯（昼夜 toggle + 灯罩开口向外 45° + 金属圆环贴外缘 + 内部灯泡）、桌面水杯热气。
- `objects/AcademicPoster.tsx`：个人展示框 3 张真实照片（scrapbook）；删除「新媒体运营 / 重庆」文字。
- `objects/LeftWall.tsx`：五层书架（更多书 + 花/绿植）、蓝书改 focus-only、黑板独立 InteractiveObject + Hello 动画、书架/标签绳拦截点击。
- `objects/WallMural.tsx`：树绘绿/黄切换 + 树木专用 hitbox（非整墙）。
- `objects/LivingZone.tsx`：地毯白/绿切换 + 严格 hitbox（坐垫/沙发拦截）、右沙发取消交互、圆桌交互 + 热气、扫地机器人。
- `objects/PhotoWall.tsx`：13 真实照片缩略图、按比例相框、photo-07 整体旋转、多肉群体蹦跳。
- `objects/Pets.tsx`：柯基真实四足奔跑；猫「叫→坐起→打哈欠→回睡」；猫嘴部打哈欠穿模修复。
- `objects/HangingLights.tsx`：藤编半球吊灯（放大、无裸露灯泡、夜间柔光）+ 串灯昼夜 toggle + 夜间微光。
- `data/studio-content.ts` / `data/photography.ts` / `data/skills.ts` / `types.ts`：数据与类型同步更新。
- `public/assets/portfolio/**`：22 个真实资源 + 缩略图。

---

## 5. 当前仍存在的问题 / 待确认项

> 以下是**如实记录**，不代表一定失败；很多是「本环境无法目视验证」。

1. **Overlay「重复弹出」**：已通过「稳定 variants + 稳定 key + `AnimatePresence mode="wait"` + `activateObject` 幂等」在状态层修复，
   但**未在浏览器目视确认**。若在 `npm run dev` 下仍复现，优先怀疑 React StrictMode 开发态二次挂载
   （`next.config.mjs` 的 `reactStrictMode: true`），可考虑改为纯 CSS / 受控动画，或与用户确认是否关闭 StrictMode。
2. **死数据 / 死文件（无害，可择机清理）**：
   - `EXTRA_OBJECTS` 中 `sofa`（右沙发已取消交互）、`succulent-01..03`（已改为直接动画）、`book-blue-01..02`（已改为 focus-only）对应的 objectMeta 已不再被使用。
   - `ActionObjectId` 中 `stringLights` 未被使用（串灯用本地 handler）。
   - `objects/Mailbox.tsx`、`objects/Bookshelf.tsx` 保留文件但 Studio 中未使用。
   - `camera-director.ts` 的 `OBJECT_VIEWS.sofa` 不再被使用。
3. **需目视确认的视觉项**（无法在本环境验证）：猫打哈欠嘴部是否完全无穿模；台灯金属圆环是否贴合外缘 / 45° 开口观感；
   夜晚窗外各角度是否全为夜景、无白色残留；桌面/圆桌热气浓度；多肉蹦跳节奏；树木黄绿过渡；地毯绿色的自然度；
   串灯夜间微光是否「温柔不刺眼」；照片墙新比例排版与 photo-07 / photo-13 旋转后的裁切。
4. **命中区域污染**：本轮已为树木（专用 hitbox）、黑板、地毯、沙发、书架、标签绳加拦截/限定。
   仍需目视确认「点击书架上任意位置不触发树木」「点击沙发不触发地毯」等。
5. **无自动化测试**：只有 typecheck / lint / build，视觉与交互需人工验收。

---

## 6. 下一步最应该做什么

1. **让用户目视验收最近几轮改动**，按截图/描述做最小修正（不要主动重设计）。
2. 若确认 Overlay 仍有重复弹出，优先处理 React StrictMode 与动画库的交互（见 5.1）。
3. 择机清理第 5.2 条的死数据 / 死文件（**需用户同意**，属可选清理，不是紧急项）。
4. 继续遵守：每轮只做该轮明确要求；`Inspect → Understand → Minimal Change → Validate`。
5. 每次改完必须跑：

```
npm run typecheck
npm run lint
npm run build
```

---

## 7. 重要交互规则（必须保持）

1. **没有黄色交互点**（InteractiveObject 已移除 marker）。
2. Hover 只有视觉反馈，**不显示任何文字 / tooltip**。
3. **有具体信息的物品**：一次点击 = Camera Focus + 居中信息 Overlay；关闭信息只关 Overlay，**相机保持 Focus**；
   再点击当前聚焦物品 / 点「返回」按钮才退出 Focus 并恢复默认镜头。
4. 信息 Overlay：居中、不可点背景关闭、Esc 可关闭、关闭按钮保留。
5. **聚焦标签（focus 模式）**：只聚焦，不弹 Overlay。
6. **特殊动作物体**（action 模式，不弹 Overlay / 不聚焦）：狗、猫、电扇、电脑椅、扫地机器人、
   落地灯、吊灯 1/2、台灯、黑板。
7. **直接动画物体**（本地 handler，不弹 Overlay / 不聚焦）：树木、地毯、多肉、串灯。
8. **纯装饰无交互**：地球仪、电脑桌纸张、左/右沙发、普通书（非蓝书）、低书架/多肉以外的装饰等。
9. `isRealClick`：所有点击都必须区分真实点击与 OrbitControls 拖拽，拖拽不得误触发。
10. 摄影相框：一次点击 = 聚焦 + 打开 Gallery；关 Gallery 保持聚焦；再点相框退出。
11. 所有 restore 使用统一 **ENTER_DEFAULT_CAMERA**，不得另算近似值。

---

## 8. 视觉规则

- 品牌：**LI SIYU — MY LITTLE STUDIO**；气质 cozy / warm / lived-in / cinematic / editorial / afternoon→golden hour。
- 房间尺寸 **4m × 3m × 2.6m**（坐标系 floor center=origin，x=±2，back wall z=-1.5，entrance z=+1.5）。
  **不要改房间尺寸**（注：`StudioEnvironment` 内部常量 W=10/D=8/H=3.8 与屋顶结构按现有实现，勿动）。
- 不要出现：廉价方块 3D、Three.js demo 感、过黄灯光、空房间感、悬浮 / 穿模 / 不合理比例、超广角鱼眼室内感。
- 窗外是**平面 2D 森林**，白天森林 / 夜晚森林，**永远不要恢复 3D 森林 / 雨 / 雨滴 / 雨声**。
- 夜晚窗外所有角度必须是夜景；窗户以外也不能出现纯白背景。
- 相机始终看向房间内部，不允许转到没有墙的一面、不穿墙。

---

## 9. 技术约束

### 9.1 性能
- primitives（Box/Cyl/Sphere）使用**共享 geometry/material 缓存**（`objects/primitives.tsx`）；不要制造重复几何。
- 地板是单 `InstancedMesh`。
- 纹理为程序化 CanvasTexture，最大约 1024–2048；3D 中优先用缩略图。
- 动画集中在少量 `useFrame`；**禁止每帧 `new Vector3` / 新建 geometry/material**。
- 渲染：高 DPR `[1,1.8]`、低 DPR `[1,1.2]`；高质量才开阴影；**无后处理**；`far=60`。
- 不要为每颗粒子 / 每盏灯加 useFrame 或强 PointLight；夜间灯光数量受控（隐藏点光源 + 极弱共享光）。

### 9.2 相机
- `BROWSE.fov=55`、`FOCUS_FOV=68`、`LOOK_RADIUS=0.2`、`BROWSE.yawDeg=27`、polar `[73,84]`、`LOOK_YAW_DEG=90`、`LOOK_PITCH_DEG=18`。
- 默认机位与聚焦机位表在 `camera/camera-director.ts`；新增可交互物体需在 `resolveView` 覆盖的表中登记机位（俯仰需在 ±18° 内）。

### 9.3 代码风格 / 工程
- 不要 `any` / `@ts-ignore` / `eslint-disable` / 去掉类型检查。
- 不要擅自重构 / 大规模重写。
- 不要恢复：TV、摇椅、globe 交互、纸张交互、夜晚下雨、雨声、黄色交互点、focusReturn。

### 9.4 ⚠️ 编码事故警告（重要）
本项目曾因用 Windows PowerShell 5.1 默认编码批量改文件
（`Get-Content -Raw` + `Set-Content` 未指定 `-Encoding`）导致 **9 个文件的中文注释被写成 U+FFFD 并吞掉换行**，已全部修复。
**今后禁止用 PowerShell 默认编码批量改源码。**
批量修改请用 edit/write 工具；若必须用脚本，务必显式 `-Encoding UTF8`（读写）并核对中文。

---

## 10. 资产映射（唯一事实来源）

- `public/assets/portfolio/personal/personal-1..3.jpg`（3D 用 `thumbs/`）→ 个人展示框。
- `public/assets/portfolio/photography/photo-01..13.jpg`（3D 用 `thumbs/`）→ 相框 + Gallery。
- `public/assets/portfolio/rollup/rollup-1|2.png`（3D 用 `thumbs/`）→ 电脑屏幕 + 易拉宝 Overlay。
- `public/assets/portfolio/visual/visual-1|2.png` → 公众号视觉设计（连续）。
- `public/assets/portfolio/video/video-chengkou.mp4`（标题「大展宏图」）、`video-dazhanhongtu.mp4`（标题「城口」）→ 影像作品。
- 公众号链接在 `WORKS_LINKS.wechat`（2 条）→ 手机文字作品。

资源来源目录（本机，仅供复制，不要写进代码）：
`C:\Users\7\Desktop\作品集\`。

---

## 11. 用户内容规则

**绝不伪造用户信息**：经历、公司、项目、奖项、数据、技能、照片、联系方式、作品链接等。
缺失时用「待补充」/「后续放」。现有简历数据只来自项目当前内容。

---

## 12. 当前验证状态（交接时实测）

- `npm run typecheck` → **PASS**
- `npm run lint` → **PASS**（No ESLint warnings or errors）
- `npm run build` → **PASS**
  - `/` ≈ 59.1 kB / First Load ≈ 146 kB
  - `/cv` ≈ 1.22 kB / 104 kB
  - `/admin` ≈ 94.7 kB / 197 kB
  - `_not-found` 871 B / 88.1 kB

无 `npm test`。

---

## 13. 项目内 Skills

`li-siyu-studio-design / entry / room / wall / workspace / interaction / works-gallery / lighting / performance / finish`
（以及本 `project-handoff`）。

全局 three.js skills：`threejs-animation / audio / camera / controls / dev-setup / geometries / helpers / lights /
loaders / materials / math / node-tsl / objects / postprocessing / renderers / scenes / textures / webxr`。

任务相关时先看对应 Skill，但**不要为小改动加载所有 Skill**；仓库代码始终是最终事实来源。

---

## 14. 首次恢复上下文后的响应

1. Inspect 实际仓库结构。
2. 确认当前交互状态机（store）与 InteractiveObject 三模式。
3. 确认物体→内容映射（第 3.8 节）。
4. 确认昼夜系统与窗外 2D 森林。
5. 如需，跑 typecheck / lint / build 确认基线。
6. **不要改代码、不要建/删文件、不要重设计。**

然后简要回复：

> Context restored.
> Current phase: 定向视觉与交互修正（持续迭代）
> Architecture: Next.js + R3F/Three.js + DOM UI + Zustand
> Validation: typecheck / lint / build 均 PASS
> Ready for the user's next concrete visual or functional issue.

等待用户给出下一步具体问题。

---

## 15. 最终规则

项目已基本完成。你的职责不是证明能写更多代码，而是：

> 保护已经能用的东西 → 理解已经存在的东西 → 只做被要求的改动 → 让项目比之前更稳定。

- 视觉改动 → 只做最小改动（优先 position / rotation / scale / camera / lighting / material，最后才结构）。
- Bug 修复 → 只修受影响系统。
- 新功能 → 先看现有系统能否支持。
- 用户给截图 → 先诊断再改。
- 需求与本 Skill 冲突 → 遵循用户最新明确要求，但保留无关既有功能。
- 绝不伪造作品集内容。
- 绝不静默做全局重写。
- 未经明确许可，绝不进入 Phase 6。
