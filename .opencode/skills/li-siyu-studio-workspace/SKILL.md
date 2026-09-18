---
name: li-siyu-studio-workspace
description: LI SIYU MY LITTLE STUDIO 创作工作区执行规范。负责右侧工作区的桌子、电脑、竖直手机、相机、三脚架、两张学术海报、海报木牌与暖光，并彻底删除 TV，将原 TV 的“基本信息”交互迁移到学术海报。保持真实比例、温暖材质、清晰交互边界和现有 Studio 架构。
---

# LI SIYU — MY LITTLE STUDIO
# WORKSPACE SKILL

## 1. SKILL 负责范围

本 Skill 专门负责 Studio 内部的“创作工作区”。

负责以下对象：

- Desk
- Computer
- Phone
- Phone Stand
- Chair
- Camera
- Tripod
- Academic Poster 1
- Academic Poster 2
- Poster Frame
- Poster Plaque
- Poster LED / Pendant Light

本 Skill 同时负责：

- 删除 TV
- 将原 TV 的“基本信息”交互迁移到 Academic Posters

本 Skill 不负责：

- Photography Wall
- 13 个摄影框
- Photography Gallery
- Floating Shelf
- Tall Bookshelf
- Globe
- World Map
- Skill String
- Skill Tags
- Right Wall Windows
- Sofas
- Entry Page
- Mailbox
- Global Camera Architecture

---

# 2. 核心设计目标

工作区应该看起来像：

> 一个真实的人正在这里学习、设计、写作、剪辑、拍摄。

而不是：

> 一组被摆在房间里的 3D 家具模型。

整体关键词：

- warm
- creative
- lived-in
- editorial
- tactile
- realistic
- personal
- handcrafted

避免：

- sterile office
- futuristic laboratory
- gaming room
- neon
- excessive glow
- oversized objects
- toy-like proportions
- floating objects

---

# 3. 修改原则

这是一个已经存在的项目。

在修改之前必须：

1. 检查当前代码结构。
2. 找到现有 Desk。
3. 找到现有 Computer。
4. 找到现有 Phone。
5. 找到现有 Camera。
6. 找到现有 TV。
7. 找到现有 Academic Poster。
8. 找到 InteractiveObject。
9. 找到 Camera Director。
10. 找到 StudioScene / StudioObjects。

优先修改现有组件。

不要因为本 Skill 而重写整个 Studio。

---

# 4. 文件检查

优先检查：

```text
src/studio/
src/studio/objects/
src/studio/scene/
src/studio/camera/
src/studio/ui/
```

同时检查：

```text
package.json
tsconfig.json
```

确认项目当前实际使用：

- React
- Three.js
- React Three Fiber
- Drei
- 当前 CSS / Tailwind 系统

不要假设文件名。

---

# 5. 最重要规则：删除 TV

当前 Studio 中如果存在：

- TV
- TV screen
- television
- TVCorner
- TV interaction

必须检查。

最终结果：

> TV 完全从 Studio 场景中删除。

不是：

- 隐藏
- 缩小
- 透明
- 放到墙后
- disabled
- 不可点击

而是：

> 不再渲染 TV。

---

# 6. TV 交互迁移

原 TV 的功能：

> 基本信息

必须迁移到：

> Academic Posters。

最终交互关系：

```text
Academic Poster 1
        ↓
     基本信息

Academic Poster 2
        ↓
     基本信息
```

两个海报都打开同一个“基本信息”内容。

---

# 7. TV 残留检查

删除 TV 后必须检查：

- StudioObjects
- StudioScene
- TVCorner
- static data
- interaction data
- camera targets
- content mapping

不能留下：

- invisible TV
- dead interaction
- TV camera target
- TV section mapping

如果 TVCorner 只用于 TV：

可以删除或停止引用。

不要留下无意义的旧代码。

---

# 8. 工作区总体布局

工作区应该形成：

```text
       POSTER 1       POSTER 2
          ↑              ↑
       LIGHT           LIGHT

             COMPUTER
        ┌───────────────┐
        │     DESK      │
        └───────────────┘

            CHAIR

      CAMERA + TRIPOD

             PHONE
```

这不是精确工程图。

它表示：

> 工作区的空间关系。

---

# 9. 工作区位置

整个工作区应该位于：

> Studio 的右侧 / 右中区域。

桌子：

向右移动。

电脑：

跟随桌子。

椅子：

跟随桌子。

相机：

位于工作区附近。

海报：

位于电脑上方。

---

# 10. 工作区不能占满房间

工作区虽然需要更加明显：

但不能：

- 占据整个房间
- 压住左侧摄影墙
- 压住书柜
- 压住右侧窗户
- 改变房间 footprint

如果太大：

优先调整：

- scale
- spacing
- position

而不是扩大房间。

---

# 11. DESK 桌子

桌子是工作区核心。

需要：

> 一张较长的创作工作桌。

桌面：

- 长方形
- 四角略微圆润
- 有明显厚度
- 有真实桌腿

不要：

- 游戏电竞桌
- 圆桌
- 超现代玻璃桌
- 完全悬浮的桌面

---

# 12. DESK 尺寸

用户要求：

> 桌子进一步放大。

目标：

桌子宽度大约：

> 对应墙面视觉宽度的 1/3。

必须明显比之前的桌子更有存在感。

但：

不能大到压迫整个房间。

---

# 13. DESK 材质

主要材质：

> warm deep brown / light warm wood。

优先使用项目已有木材系统。

如果需要颜色：

```text
#8B5A3B
```

或者与当前 Studio 的深木色保持一致。

材质：

- matte
- rough
- natural

不要：

- 高亮塑料
- 镜面木材
- 金属办公桌

---

# 14. DESK 结构

桌子必须有：

- tabletop
- legs
- support structure

桌面不能看起来像：

> 一个悬浮的矩形 Box。

---

# 15. DESK 与墙面关系

桌子：

靠近工作区墙面。

但：

不能穿墙。

桌后留出：

合理的空间。

电脑位于：

> 桌面后部。

---

# 16. DESK 与海报关系

必须形成：

```text
Academic Posters
        ↓
Computer
        ↓
Desk
        ↓
Chair
```

这条垂直视觉关系必须清晰。

---

# 17. COMPUTER

电脑是工作区第二视觉核心。

需要：

> 一个明显可识别的桌面显示器。

不能：

- 太小
- 像手机
- 像电视
- 悬浮
- 穿桌

---

# 18. COMPUTER 尺寸

用户要求：

> 电脑进一步放大。

因此显示器应该：

> 从 Studio 初始镜头中清楚可见。

但：

不能比海报巨大。

---

# 19. COMPUTER 结构

显示器至少包含：

- monitor body
- bezel
- screen
- stand
- base

可以增加：

- webcam
- small UI details

但不需要制作复杂真实操作系统。

---

# 20. COMPUTER 材质

外壳：

```text
#1E1E22
```

屏幕：

可以使用：

```text
#D8E4F0
```

整体应该是：

> 深色电子设备。

不要使用：

> 彩色 RGB 电竞灯。

---

# 21. COMPUTER 屏幕亮度

屏幕应该：

> 有一点冷色亮度。

但不能：

成为房间最强光源。

不要：

- 巨大 Bloom
- 强烈 emissive
- 霓虹边缘

---

# 22. COMPUTER INTERACTION

Computer 必须继续承担：

> 视觉类设计

点击：

```text
Computer
    ↓
视觉类设计
```

不要因为重新制作工作区而删除这个 Interaction。

---

# 23. PHONE

桌面必须保留：

> 一个竖直手机。

手机不是平放。

必须：

> 竖直放置在 Stand 上。

---

# 24. PHONE STAND

手机支架必须真实存在。

结构：

```text
Desk
 ↓
Phone Stand
 ↓
Phone
```

不能：

> 手机悬浮在桌面上。

---

# 25. PHONE ORIENTATION

手机：

> Portrait / vertical。

略微朝向用户。

不要：

- 横放
- 倒置
- 严重倾斜

---

# 26. PHONE POSITION

手机应该：

位于电脑旁边。

不要：

挡住：

- keyboard
- monitor
- coffee
- desk核心区域

---

# 27. PHONE SCALE

合理比例：

```text
Phone < Computer < Desk
```

手机应该：

明显可识别。

但不能抢掉电脑视觉中心。

---

# 28. PHONE INTERACTION

Phone 必须继续承担：

> 文字作品。

点击：

```text
Phone
  ↓
文字作品
```

不要：

Phone → Contact

不要：

Phone → Basic Information

---

# 29. CHAIR

工作椅：

> brown bamboo chair with woven open back。

整体不是：

> 大型人体工学办公椅。

---

# 30. CHAIR 外观

建议：

- warm brown bamboo
- wood frame
- woven back
- simple seat

可以有：

> cream seat cushion。

---

# 31. CHAIR 方向

椅子：

必须：

> 面向 Desk。

桌椅之间应该有真实使用关系。

不能：

- 背对桌子
- 与桌子垂直
- 穿进桌腿

---

# 32. CHAIR 尺寸

椅子：

与桌子成比例。

不要：

> 巨型椅子。

不要：

> 迷你玩具椅。

---

# 33. CAMERA

工作区需要：

> 一台相机。

相机代表：

> 影视作品。

---

# 34. CAMERA 位置

相机：

放在桌子附近。

可以：

- 桌旁
- 桌面附近
- 工作区前侧

但不要：

塞进桌子。

---

# 35. CAMERA 尺寸

相机需要：

> 明显可发现。

但：

不能比电脑大。

应该：

与桌面物件保持真实比例。

---

# 36. CAMERA BODY

相机至少包含：

- body
- lens
- lens barrel
- grip
- top controls

不要只用一个：

> Box

代表整个相机。

---

# 37. CAMERA LENS

镜头需要：

> 明显的圆形结构。

建议使用：

- 多层圆柱
- 深色玻璃
- 镜头环

可以有轻微反射。

不要：

- 发光
- neon
- 彩色镜头

---

# 38. CAMERA INTERACTION

点击：

```text
Camera
   ↓
影视作品
```

必须保留。

---

# 39. TRIPOD

Camera 必须：

> 安装在三脚架上。

三脚架不能只是：

> 一根竖直杆。

---

# 40. TRIPOD 三条腿

这是硬性要求。

三脚架必须有：

> 三条向外展开的腿。

俯视结构：

```text
          /
         /
        ●
       / \
      /   \
```

中心：

> central hub。

三条腿：

> 从中心向三个方向展开。

---

# 41. TRIPOD LEG ANGLE

三条腿建议：

> 大约 120° 分布。

不要求真实物理模拟。

但必须：

> 从视觉上像真实摄影三脚架。

---

# 42. TRIPOD FLOOR CONTACT

三条腿必须：

> 接触地面。

不能：

- 悬浮
- 插入地板
- 长度明显不同
- 只显示一条腿

---

# 43. TRIPOD LEG MATERIAL

可以使用：

- dark metal
- dark wood
- muted black

推荐：

```text
#26262A
```

材质：

> matte metal。

---

# 44. TRIPOD INTERACTION

Tripod：

不需要单独 Interaction。

Camera：

负责：

> 影视作品。

---

# 45. ACADEMIC POSTERS

电脑上方：

必须有：

> 两张学术海报。

---

# 46. POSTER 数量

必须：

> 2 张。

不能：

- 1 张
- 3 张
- 4 张

---

# 47. POSTER 尺寸

每张海报目标尺寸：

> 1.05m × 0.78m

宽：

```text
1.05m
```

高：

```text
0.78m
```

---

# 48. POSTER 横向比例

海报必须：

> landscape / horizontal。

不能做成竖版海报。

---

# 49. POSTER FRAME

海报使用：

> rounded raw-wood frame。

木框：

- warm
- natural
- slightly imperfect
- matte

推荐：

```text
#6B4A33
```

---

# 50. POSTER PAPER

纸张：

> cream。

推荐：

```text
#F2EDE4
```

材质：

- matte
- slight roughness

---

# 51. POSTER 位置

用户给出的参考位置：

```text
(0.35, 1.5, -1.48)
```

这是：

> 参考坐标。

必须先检查当前 Studio 坐标系。

不能盲目使用坐标。

最终必须保证：

> 海报真正位于工作区墙面。

---

# 52. POSTER FACING

用户要求：

> facing +Z。

但必须根据当前项目坐标系统确认。

最终效果：

> 用户从 Studio 内部可以看到海报正面。

---

# 53. POSTER TITLE

海报标题：

```text
What Makes Everyday AI Feel Trustworthy?
```

必须：

- bold
- black
- clear
- editorial

标题应该是海报视觉重点之一。

---

# 54. POSTER SUBTITLE

标题下面：

加入：

> gray subtitle。

字幕：

不要比标题更大。

颜色：

> muted gray。

---

# 55. MORANDI STICKY NOTES

每张海报需要：

> 7 个 Morandi pastel sticky-note blocks。

目标：

低饱和。

避免：

> 高饱和糖果色。

---

# 56. STICKY NOTE COLORS

可使用：

- muted purple
- muted magenta
- muted cyan
- muted orange
- muted green
- warm neutral
- dusty accent

这些颜色需要统一。

---

# 57. STICKY NOTE TEXT

每个色块：

加入：

> gray simulated text。

视觉上像：

- research notes
- annotations
- observations
- findings

不需要生成大量真实论文内容。

---

# 58. BAR CHART

海报 lower-middle：

加入：

> 5-bar chart。

五条柱使用：

1. purple
2. magenta
3. cyan
4. orange
5. green

颜色：

保持 Morandi / muted 体系。

---

# 59. PIE CHART

海报同时包含：

> five-color pie chart。

五种颜色：

与 bar chart 保持对应关系。

---

# 60. CHART STYLE

图表应该：

> 简洁、学术、编辑感。

不要：

- 复杂 Dashboard
- 真实软件 UI
- 3D Chart
- neon graph

---

# 61. POSTER PROCEDURAL ART

如果没有真实海报图片：

必须使用：

> Canvas procedural art。

Canvas 生成：

- cream paper
- title
- subtitle
- 7 sticky notes
- simulated text
- bar chart
- pie chart

---

# 62. CANVAS 分辨率

Canvas 必须：

> 足够高分辨率。

防止：

- 标题模糊
- 小字模糊
- 图表像素化

不要使用：

> 很小的 Canvas 然后在 3D 场景中巨大放大。

---

# 63. CANVAS DPR

根据：

> devicePixelRatio

合理设置 Canvas resolution。

不要无限提高 DPR。

需要在：

> 清晰度

和：

> Performance

之间平衡。

---

# 64. POSTER PAPER GRAIN

可以加入：

> 非常轻微的纸张纹理。

目标：

让海报更像：

> printed academic poster。

不要：

> 明显噪点。

---

# 65. POSTER FRAME DEPTH

木框必须有：

> 真实厚度。

不能只是：

> 一个二维 border。

---

# 66. POSTER SHADOW

海报可以产生：

> subtle wall shadow。

阴影应该：

轻微。

不要：

> 黑色重阴影。

---

# 67. POSTER 上方 PLAQUE

每张海报上方：

约：

> 0.25m

放一个：

> dark wood rectangular plaque。

---

# 68. PLAQUE

Plaque：

- dark wood
- slim
- rectangular
- matte

推荐：

```text
#6B4A33
```

---

# 69. PLAQUE LED

Plaque 上：

加入：

> warm white LED strip。

颜色：

```text
#FFE0B0
```

---

# 70. LED 光照

LED 应该：

> 温暖地照亮海报。

不要：

> 强烈照亮整个房间。

不要：

- neon
- giant bloom
- nightclub lighting

---

# 71. BRASS PENDANT

Plaque 下方：

可以加入：

> brass pendant drops。

材质：

> warm muted brass。

不要：

> 镜面黄金。

---

# 72. POSTER LIGHTING

灯光主要照向：

> Poster paper。

不要让：

> Camera

成为灯光中心。

---

# 73. POSTER 与 COMPUTER 的遮挡关系

这是重要视觉 QA。

电脑不能：

> 遮住海报主体。

如果发生遮挡：

优先调整：

1. Poster 上移
2. Computer 下移
3. Desk 深度
4. Camera 角度

不要：

> 改变房间高度。

---

# 74. POSTER 与 DESK 的空间关系

最终应该像：

```text
Poster
   ↓
Computer
   ↓
Desk
   ↓
Chair
```

形成一个完整工作站。

---

# 75. POSTER INTERACTION

两张海报：

都必须：

> 可点击。

点击：

```text
Poster 1 → 基本信息
Poster 2 → 基本信息
```

---

# 76. POSTER HIT AREA

点击区域应该覆盖：

> 整张海报。

用户不需要精确点击标题。

---

# 77. POSTER HOVER

Hover：

允许：

- slight scale
- subtle shadow
- slight highlight

但：

只影响当前海报。

不要：

> 两张一起动画。

---

# 78. POSTER CAMERA FOCUS

点击海报：

使用现有：

> Camera Director。

执行：

```text
Hover
↓
Click
↓
Smooth Camera Focus
↓
基本信息 Overlay
```

---

# 79. CAMERA FOCUS 禁止事项

不能：

- 瞬移
- 穿墙
- 穿海报
- 穿电脑
- 穿桌子
- 把 Camera 放到房间外

---

# 80. CLOSE / RETURN

关闭基本信息 Overlay：

Camera：

应合理返回 Studio。

不要每次：

> 强制重置到最初位置。

优先恢复点击前状态。

---

# 81. 不恢复普通 Zoom

不要修改当前 Studio 的浏览方式。

如果当前系统已经：

> 禁用普通 Zoom。

必须继续保持：

```text
enableZoom={false}
```

或项目对应的等价实现。

用户通过：

> Rotate

浏览。

点击：

> Object Focus。

---

# 82. 初始镜头

初始 Studio 镜头必须能够看到：

- 两张海报
- Computer
- Desk
- Chair
- Phone
- Camera

至少这些核心元素不能全部被遮挡。

---

# 83. 工作区视觉层级

视觉优先级：

```text
1. Academic Posters
2. Computer
3. Desk
4. Camera
5. Chair
6. Phone
7. Small Props
```

不要让：

> 咖啡杯

比：

> Computer

更突出。

---

# 84. 桌面道具

可以保留适量：

- keyboard
- mouse
- coffee cup
- notebook
- pen
- papers
- small plant
- desk lamp

但：

不要无限增加。

---

# 85. 桌面生活感

目标：

> lived-in but curated。

即：

> 有人在使用。

但不是：

> 杂乱的垃圾桌面。

---

# 86. 物体真实接触

必须检查：

Computer：

```text
Computer
↓
Desk
```

Phone：

```text
Phone
↓
Stand
↓
Desk
```

Camera：

```text
Camera
↓
Tripod
↓
Floor
```

Chair：

```text
Chair
↓
Floor
```

Poster：

```text
Poster
↓
Wall
```

Plaque：

```text
Plaque
↓
Wall
```

---

# 87. 禁止 Floating Objects

不允许：

- floating computer
- floating phone
- floating camera
- floating tripod
- floating chair
- floating poster
- floating plaque

如果出现：

优先检查：

- local position
- parent transform
- scale
- floor height
- wall offset

---

# 88. 材质统一

工作区与整个 Studio 保持统一：

Wood：

> warm / matte

Paper：

> cream / matte

Metal：

> muted

Electronics：

> dark

Brass：

> warm

---

# 89. 工作区灯光

使用现有 Studio Lighting。

不要为了工作区：

> 重写全局 Lighting。

只允许增加：

> Poster 局部暖光。

---

# 90. 性能要求

避免：

- 超高面数相机
- 超高面数三脚架
- 巨型 Canvas
- 每个零件都创建独立复杂材质
- 不必要的实时灯光

可以：

- 复用 geometry
- 复用 material
- 使用简单 primitives
- 控制 Canvas 分辨率

---

# 91. 组件结构

推荐逻辑结构：

```text
Workspace
├── Desk
│   ├── Computer
│   ├── Phone
│   └── Props
│
├── Chair
│
├── CameraStation
│   ├── Camera
│   └── Tripod
│
└── AcademicPosterWall
    ├── Poster 1
    ├── Poster 2
    ├── Plaque 1
    ├── Plaque 2
    ├── Light 1
    └── Light 2
```

具体文件名根据当前项目实际结构决定。

---

# 92. 不创建重复组件

修改前检查已有：

- DeskStation
- CameraStation
- TVCorner
- Poster
- Computer
- Phone

如果已有：

> 修改。

不要创建：

- DeskV2
- CameraV2
- PosterFinal
- PosterFinal2
- TVHidden
- TVBackup

---

# 93. TV 删除后代码结构

最终应该：

```text
Workspace
├── Desk
├── Computer
├── Phone
├── Chair
├── Camera
├── Tripod
└── Academic Posters
```

而不是：

```text
Workspace
├── TV
├── Hidden TV
├── Old TV
└── Academic Posters
```

---

# 94. Interaction 总表

最终必须满足：

| Object | Interaction |
|---|---|
| Academic Poster 1 | 基本信息 |
| Academic Poster 2 | 基本信息 |
| Computer | 视觉类设计 |
| Phone | 文字作品 |
| Camera | 影视作品 |
| Tripod | 无独立 Interaction |
| Desk | 无独立 Interaction |
| Chair | 无 Interaction |
| TV | 不存在 |

---

# 95. Interaction 隔离

必须保证：

Academic Poster：

> 基本信息

Computer：

> 视觉类设计

Phone：

> 文字作品

Camera：

> 影视作品

它们之间不能互相继承。

例如：

不能因为：

```text
Workspace
└── InteractiveObject
```

导致：

> 点击桌子也打开视觉类设计。

如果当前项目使用父级 Interaction：

必须检查实际 hit target。

---

# 96. Common Failure — TV 只是隐藏

如果 TV 只是：

```ts
visible={false}
```

不算完成。

必须检查：

> TV 是否仍然参与 Scene / Interaction。

---

# 97. Common Failure — 海报被电脑挡住

解决顺序：

1. Poster 上移
2. Computer 下移
3. Desk 调整
4. Camera 微调

不要：

> 缩小海报。

---

# 98. Common Failure — 海报太小

如果远景看不到：

检查：

- 实际米制尺寸
- camera distance
- frame thickness
- wall placement

不要只增加：

> emissive。

---

# 99. Common Failure — 海报像普通图片

如果海报看起来只是：

> 一张图片贴墙。

增加：

- raw wood frame
- paper depth
- matte surface
- subtle shadow
- plaque
- warm light

---

# 100. Common Failure — 海报像 UI 截图

降低：

- 高饱和
- 复杂边框
- digital gradients
- excessive widgets

增加：

- paper
- notes
- muted colors
- research poster composition

---

# 101. Common Failure — Camera 像方块

检查：

- lens
- lens rings
- grip
- body depth
- top controls

---

# 102. Common Failure — Tripod 像旗杆

必须检查：

> 三条腿是否真的从中心向外展开。

如果只有一根竖杆：

> 不合格。

---

# 103. Common Failure — Tripod 漂浮

检查：

三条腿 endpoint。

必须：

> 接触 floor。

---

# 104. Common Failure — Phone 漂浮

检查：

```text
Phone
↓
Stand
↓
Desk
```

三个结构必须存在。

---

# 105. Common Failure — Desk 像一个 Box

增加：

- tabletop thickness
- legs
- support
- material distinction

不要：

> 用一个 Box 代表完整桌子。

---

# 106. Common Failure — Chair 方向错误

检查：

Chair forward vector。

最终：

> Chair faces Desk。

---

# 107. Common Failure — 工作区过大

不要扩大房间。

优先：

- reduce scale
- reduce spacing
- move objects

---

# 108. Common Failure — 工作区过小

优先：

- enlarge Desk
- enlarge Computer
- enlarge Posters
- enlarge Camera slightly

确保：

> 从初始镜头可以识别。

---

# 109. Common Failure — Poster Canvas 模糊

检查：

- Canvas resolution
- DPR
- texture size
- filtering

不要：

> 用低分辨率 Canvas。

---

# 110. Common Failure — LED 太亮

降低：

- intensity
- bloom
- emissive strength

目标：

> warm accent。

不是：

> room floodlight。

---

# 111. Common Failure — 工作区太像办公室

增加：

- wood
- paper
- camera
- research posters
- personal desk props

减少：

- corporate UI
- sterile furniture
- excessive symmetry

---

# 112. Common Failure — 工作区太乱

删除：

> 不必要 props。

保留：

- keyboard
- mouse
- coffee
- notebook
- papers
- small plant

不要堆满。

---

# 113. 实施顺序

严格按照：

## STEP 1

检查当前工作区代码。

## STEP 2

找到并删除 TV。

## STEP 3

清理 TV Interaction。

## STEP 4

把 Basic Information Interaction 迁移到 Academic Posters。

## STEP 5

调整 Desk 位置。

## STEP 6

调整 Desk 尺寸。

## STEP 7

调整 Computer。

## STEP 8

调整 Phone + Stand。

## STEP 9

调整 Chair。

## STEP 10

调整 Camera。

## STEP 11

修正 Tripod 三腿结构。

## STEP 12

制作 / 修改两张 Academic Posters。

## STEP 13

制作 Canvas procedural art。

## STEP 14

添加 raw wood frames。

## STEP 15

添加 plaques。

## STEP 16

添加 warm LED / brass pendant。

## STEP 17

修正 Poster / Computer 遮挡。

## STEP 18

检查 Camera Focus。

## STEP 19

检查全部 Interaction。

## STEP 20

视觉 QA。

## STEP 21

Interaction QA。

## STEP 22

Typecheck。

## STEP 23

Lint。

## STEP 24

Build。

---

# 114. Visual QA

完成后必须检查：

### TV

- [ ] TV 完全删除
- [ ] 没有隐藏 TV
- [ ] 没有 TV Interaction
- [ ] 没有旧 TV Camera Target

### Posters

- [ ] 2 张
- [ ] 1.05 × 0.78m
- [ ] 横向
- [ ] raw wood frame
- [ ] cream paper
- [ ] 正确标题
- [ ] gray subtitle
- [ ] 7 个 Morandi 色块
- [ ] simulated gray text
- [ ] 5-bar chart
- [ ] five-color pie chart
- [ ] 上方 plaque
- [ ] warm LED
- [ ] brass pendant

### Desk

- [ ] 更大
- [ ] 向右
- [ ] 长桌
- [ ] 四角结构合理
- [ ] 桌腿真实
- [ ] 没有漂浮

### Computer

- [ ] 清晰可见
- [ ] 在桌面上
- [ ] 显示器有厚度
- [ ] 有 stand
- [ ] Interaction = 视觉类设计

### Phone

- [ ] 竖直
- [ ] 有 stand
- [ ] 在桌面
- [ ] Interaction = 文字作品

### Camera

- [ ] 清晰可见
- [ ] 有 lens
- [ ] 有 tripod
- [ ] Interaction = 影视作品

### Tripod

- [ ] 三条腿
- [ ] 从中心展开
- [ ] 大约 120° 分布
- [ ] 接触地面

### Chair

- [ ] 棕色竹编
- [ ] 开放式靠背
- [ ] 面向 Desk
- [ ] 接触地面

---

# 115. Interaction QA

逐个测试：

```text
Poster 1
→ 基本信息

Poster 2
→ 基本信息

Computer
→ 视觉类设计

Phone
→ 文字作品

Camera
→ 影视作品
```

同时测试：

```text
TV
→ 不存在
```

---

# 116. Camera QA

检查：

- [ ] 初始镜头能看到工作区
- [ ] 无普通 Zoom
- [ ] Poster 可以平滑 Focus
- [ ] Camera 不穿墙
- [ ] Camera 不穿桌子
- [ ] Camera 不穿 Poster
- [ ] Close 后正常返回 Studio

---

# 117. Responsive QA

Desktop：

完整展示工作区。

Tablet：

可以适当减少小道具。

Mobile：

优先保证：

- Poster
- Computer
- Phone
- Camera

仍然可识别。

---

# 118. Validation

先读取：

```text
package.json
```

确认项目已有的 scripts。

如果存在：

```text
npm run typecheck
npm run lint
npm run build
```

则运行对应命令。

不要自行发明不存在的命令。

---

# 119. Build 不等于完成

即使：

```text
typecheck PASS
lint PASS
build PASS
```

也不能直接认为完成。

还必须确认：

- TV 真删除
- Poster 真可点击
- Poster 真指向 Basic Information
- Computer Interaction 正确
- Phone Interaction 正确
- Camera Interaction 正确
- Tripod 三腿正确
- Poster 没被 Computer 遮住

---

# 120. 最终报告

完成后必须报告：

## Changed Files

列出实际修改文件。

## TV

明确说明：

> TV 已从场景删除。

## Academic Posters

明确说明：

> 2 张 Academic Posters → 基本信息。

## Desk

说明：

> Desk 已放大并移动到右侧工作区。

## Computer

说明：

> Computer → 视觉类设计。

## Phone

说明：

> Vertical Phone → 文字作品。

## Camera

说明：

> Camera → 影视作品。

## Tripod

说明：

> 三条腿已从中心向外展开并接触地面。

## Validation

报告：

- typecheck
- lint
- build

## Known Issues

只写实际存在的问题。

不要虚构：

> “已完美完成”。

---

# 121. 最终视觉目标

用户进入 Studio 后：

右侧应该像一个真正的：

> Creator Workspace。

上方：

```text
[ Academic Poster ] [ Academic Poster ]
```

海报上方：

```text
[ Wood Plaque + Warm Light ]
```

中间：

```text
Computer
```

下面：

```text
Long Desk
```

前面：

```text
Brown Bamboo Chair
```

旁边：

```text
Vertical Phone
```

附近：

```text
Camera
   ↓
Tripod
 / | \
```

整体应该让用户产生：

> “这里真的有人每天工作。”

而不是：

> “这里放了几个 3D 模型。”

---

# 122. ABSOLUTE RULES

以下规则优先级最高：

1. TV 必须彻底删除。
2. 不允许留下隐藏 TV。
3. 不允许留下 TV Interaction。
4. Basic Information 必须迁移到 Academic Posters。
5. Academic Posters 必须是 2 张。
6. 每张尺寸目标为 1.05 × 0.78m。
7. 海报必须横向。
8. 海报使用 cream paper。
9. 海报使用 raw wood frame。
10. 海报使用 Canvas procedural art。
11. 海报包含 7 个 Morandi 色块。
12. 海报包含 5-bar chart。
13. 海报包含 five-color pie chart。
14. 每张海报上方有 dark wood plaque。
15. 每张海报有 warm LED / brass pendant。
16. Desk 必须放大。
17. Desk 必须向右移动。
18. Computer 必须在 Desk 上。
19. Computer → 视觉类设计。
20. Phone 必须竖直放在 Stand 上。
21. Phone → 文字作品。
22. Camera 必须有 tripod。
23. Tripod 必须有三条向外展开的腿。
24. 三脚架三条腿必须接触地面。
25. Camera → 影视作品。
26. 两张 Academic Posters → 基本信息。
27. 不得恢复普通 Zoom。
28. 不得修改房间 footprint。
29. 不得破坏左墙 Skill 的摄影交互。
30. 不得重写整个 Studio。