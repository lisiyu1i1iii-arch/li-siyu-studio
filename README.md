# LI SIYU — MY LITTLE STUDIO

一个可以「走进去」的 3D 个人作品集 / Studio。

- `/` —— **3D 可探索工作室**：进入拱门后，在温暖的个人创意工作室里环视、发现、点击物体，获取关于我、项目、经历、作品、技能与联系方式。
- `/cv` —— HR 平面简历页（移动端优先、可打印导出 PDF、SEO 完整）。
- `/admin` —— Supabase Auth 保护的后台，可维护 `sections / projects / experiences / skills / awards / settings`。

技术栈：Next.js 14（App Router）+ TypeScript + Tailwind CSS + React Three Fiber + drei + Three.js + zustand + framer-motion + Supabase。

---

## 3D Studio 概览

### 空间（`src/studio/scene/`）

- `StudioScene` —— R3F `Canvas`：相机、OrbitControls、灯光、场景与相机导演装配；含 ACESFilmic tone mapping、DPR/阴影分档。
- `StudioEnvironment` —— 房间结构：后墙 Deep Green、侧墙 Warm White、开放式木质屋架（椽条 + 横向木梁 + 屋脊）、右墙三扇复古拱形木窗（上短圆拱固定玻璃 + 下两扇向外平开多格窗）。
- `StudioLighting` —— Afternoon → Golden Hour 的自然光 + 吊灯/落地灯/桌面灯局部暖光。
- `PlankFloor` —— 暖蜜糖棕竖向长条实木地板（running-bond 错缝，单个 InstancedMesh）。
- `StudioObjects` —— 家具与装饰：摄影墙、工作区、学术海报、相机、生活区、窗区、吊灯、吊扇、摇摇椅、宠物等。

### 交互（`src/studio/objects/`、`src/studio/store/`）

统一由 `InteractiveObject` 外壳管理，交互契约为：

- **Hover**：仅视觉反馈（轻微放大 / 上浮 / 光点高亮 / cursor），**无任何文字或 Tooltip**。
- **第一次点击**：Camera Director 平滑聚焦（不打开信息），并出现「返回」按钮（`FocusExitButton`）。
- **第二次点击（同一物体）**：从**屏幕中央**打开对应 Overlay（`ContentOverlay`）或摄影 Gallery（`PhotoGallery`）。
- **关闭 / 返回**：恢复进入 Focus 前的 Camera position / orientation，并释放 interaction lock。
- **Interaction Lock**：Overlay / Gallery 打开时锁定 3D 交互，一次只允许一个内容。

交互对象（稳定 ID）：`computer`、`camera`、`phone`、`poster`、`photo-01`…`photo-13`（13 个独立相框）、`skill-operations` / `skill-data` / `skill-aigc` / `skill-visual`（技能标签）。Entry 的拱门（进入 Studio）与信箱（居中 Contact Modal）为 DOM 交互。

- 摄影 Gallery 支持 01/13 计数、上一张/下一张、左右方向键、移动端滑动、Esc 关闭、循环导航，关闭后恢复相机。
- 左墙为整面手绘植物壁画（矮主干大树 + 树冠 + 小鸟 + 底部草花）。
- 生活化角色：蜷缩睡觉的阿比西尼亚猫、可点击绕地毯跑步的柯基；两者均为装饰性角色。

### DOM UI（`src/studio/ui/`、`src/studio/overlays/`）

- Entry（`LoadingScreen`）：品牌 + 拱门 + 信箱 + 进入提示。
- `TopBar` / `MenuPanel` / `QuickMenu` / `QuickViewPanel`（HR 快速浏览）。
- `ContentOverlay`：About / Projects / Experience / Works / Skills / Contact，居中 editorial 卡片。
- `FocusExitButton`、`EntryContactModal`。

### 性能与健壮性

- DPR 分档（high `[1,1.8]` / low `[1,1.2]`）、阴影仅高性能档开启、无后处理、无超大纹理（贴图均为小尺寸程序化 `CanvasTexture`）。
- `primitives`（Box/Cyl/Sphere）共享 geometry 与 material，避免重复创建。
- 地板使用单个 `InstancedMesh`；动画（吊扇、宠物、灯光、相机）均为轻量 `useFrame`。
- `useDeviceProfile` 检测 WebGL / 移动端 / 性能档；WebGL 不可用显示暖色兜底。
- `StudioErrorBoundary`：3D 运行时异常不导致白屏，DOM UI 与 Quick View 仍可用。

---

## 目录结构

```
src/
  app/
    layout.tsx            全局 SEO / 字体 / 主题
    page.tsx              /      3D Studio 入口
    cv/page.tsx           /cv    HR 平面简历（可打印）
    admin/page.tsx        /admin 后台入口
    globals.css           主题变量 + 打印样式
  studio/
    StudioExperience.tsx  顶层外壳：3D Scene 与 DOM UI 分离
    types.ts              共享类型
    scene/                Canvas / 环境 / 灯光 / 地板 / 对象装配
    camera/               camera-director（机位表）+ CameraRig（平滑执行）
    objects/              房间内的所有 3D 物体与 InteractiveObject
    overlays/             ContentOverlay / PhotoGallery / 各内容 Body
    ui/                   TopBar / Menu / QuickMenu / QuickView / Loading / ErrorBoundary
    store/                zustand：交互 / 相机 / Gallery / 氛围状态
    data/                 Studio 静态内容与摄影数据
    hooks/                设备能力检测
  components/             AdminPanel / PrintButton / ui（shadcn 风格基础组件）
  lib/                    数据读取、类型、音效、Supabase、工具
supabase/schema.sql       建表 + RLS + 实时发布
scripts/seed.ts           初始数据写入脚本
```

---

## 本地运行

### 1. 安装依赖

```bash
npm install
```

### 2. （可选）配置 Supabase

`/` 与 `/cv` 无 Supabase 也可运行（前台自动使用 `src/lib/seed-data.ts` 降级数据）；仅 `/admin` 需要。

1. 在 Supabase 新建项目，于 SQL Editor 执行 `supabase/schema.sql`。
2. 复制 `Project URL` 与 `anon public` key。
3. 复制 `.env.example` 为 `.env.local` 并填写：

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # 仅 seed 脚本使用，勿放入前端
```

### 3. （可选）写入初始数据

```bash
npm run seed
```

### 4. 启动

```bash
npm run dev
```

- http://localhost:3000 → 3D Studio
- http://localhost:3000/cv → HR 平面简历
- http://localhost:3000/admin → 后台

---

## 常用脚本

```bash
npm run dev        # 本地开发
npm run typecheck  # tsc --noEmit
npm run lint       # next lint
npm run build      # 生产构建
npm run start      # 启动生产构建
npm run seed       # 写入初始数据（需 Supabase）
```
