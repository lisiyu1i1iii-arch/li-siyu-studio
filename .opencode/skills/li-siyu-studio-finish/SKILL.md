---
name: li-siyu-studio-finish
description: LI SIYU STUDIO — VISUAL FINISH & MATERIAL QUALITY。用于约束整个 3D Studio 的最终视觉完成度，防止程序生成感、几何体堆砌感、廉价游戏场景感、过度规则排列、材质粗糙、光影失真、物体比例失衡与空间层次不自然。任何 Studio 视觉修改后都应读取本 Skill 做最终验收。
---

# LI SIYU — MY LITTLE STUDIO
# VISUAL FINISH & MATERIAL QUALITY SKILL

## 0. 本 Skill 的职责

本 Skill 不是新增功能。

它的作用是防止 3D 场景出现：

- 程序生成感
- 几何体堆砌感
- 廉价游戏场景感
- 过度规则排列
- 材质粗糙
- 光影失真
- 物体比例失衡
- 空间层次不自然

任何后续视觉修改完成后，都必须用本 Skill 做最终验收。

---

# 1. 核心视觉目标

LI SIYU — MY LITTLE STUDIO 不是：

- 游戏地图
- 3D 简历模板
- 展示厅
- 商业地产样板间
- 纯程序化 3D Demo

而应该是：

> 一个真实的人长期工作、创作、阅读、拍摄、生活过的 Cozy Personal Creative Studio。

视觉关键词：

warm
lived-in
editorial
cinematic
natural
personal
slightly imperfect
quiet
creative

所有后续视觉修改都必须优先服务于「真实工作室感」，而不是「增加更多 3D 元素」。

---

# 2. Floor：Herringbone 必须是“平整地面”

这是当前最重要的视觉规则。

当前 Herringbone 地板出现过：

- 远处明显不平整
- 木板像碎片一样堆积
- 黑色缝隙过多
- 远处视觉噪声过大
- 部分木板产生明显高度 / 明暗跳变
- 地板不像一个连续平面

必须修复。

## 正确目标

地板视觉应该是：

> 一个完全平整的地面。

人字拼只是：

> surface pattern

而不是大量凸起的小木块。

视觉上应该：

- 近处：能看见木板纹理
- 中距离：能看见连续的人字拼
- 远处：形成统一、平整的木地面

绝对不能出现：

- 远处像碎木片
- 远处像石子路
- 远处像凹凸砖块
- 远处像棋盘格
- 远处出现大量黑色断缝

## 几何实现原则

优先考虑：

- 单一平整基底 + 人字拼表面几何
- 或者：低厚度 / 近乎共面的 herringbone geometry

不要让每块木板产生明显高度差。

如果继续使用重复木板，必须：

- shared geometry
- shared material
- 合理实例化
- 控制 draw calls
- 控制 geometry 数量

对于大量相同几何，可以使用 InstancedMesh。Three.js 官方文档说明，InstancedMesh 适用于大量使用相同 geometry / material、仅改变 transform 的对象，并可以减少 draw calls。

参考：https://threejs.org/docs/pages/InstancedMesh.html

不要为了“性能优化”反而制造新的视觉问题。

## Floor 参数原则

保持当前 base tone ≈ `#8B5A3B`。

但：

- 不要让每块木板颜色差异过大。
- 允许轻微色差。
- 不允许明显深浅棋盘格。
- 木板之间 gap 应非常小。
- 不要出现黑色沟壑。
- 地板顶部必须基本处于同一平面。

---

# 3. Perspective / Far Distance 检查

任何地板修改完成后，必须从当前默认 Camera，以及左转 / 右转分别检查。

重点观察：

- 墙根附近
- 房间远端
- 桌子下面
- 摄影墙前
- 窗户前

如果远处出现：

- 闪烁
- 黑缝
- z-fighting
- 锯齿状断裂
- 木板高低错觉

必须修复。不能只检查近处。

---

# 4. Pendant Lamp 比例

吊灯仍然是房间的一部分，但不能成为摄影墙前面的视觉障碍。

要求：

- 保留吊灯
- 保留暖色灯罩
- 保留真实光源
- 适当缩小
- 适当提高
- 避免遮挡核心摄影墙

不要删除吊灯，也不要让它完全消失。

目标：

> Environmental object

而不是：

> Hero object

---

# 5. Camera Tripod

三脚架不能表现为「3 根平行竖杆」。应该有真实三脚架结构：

Camera body
↓
central mount
↓
central hub
↓
three legs spread outward

三条腿：

- 从中心向外展开
- 具有明显角度
- 接触地面
- 左右前后形成空间深度

视觉上应该一眼看出「这是摄影三脚架」，而不是「三根黑色棍子」。

保持 Camera 的位置和交互。不要修改 Camera hotspot ID。

---

# 6. Bookcase

书架应该表现为开放式木质书架。

保留：

- 木质立柱
- 层板
- 书籍
- 装饰品

避免完整厚重的木质背板。从正面观察，墙面应该成为书架的视觉背景。

如果仍然存在明显的大面积深色背板：降低其存在感或移除。

但：

- 不要改变书架位置
- 不要改变书架交互

---

# 7. Photo Wall

摄影墙当前已经完成独立 13 相框交互。

本 Skill 不允许重新设计摄影墙。必须保持：

- 13 frames
- 独立 interaction
- photo IDs
- Gallery
- arrows
- keyboard
- swipe
- ESC
- current string light
- current overall layout

只允许做 very subtle visual polish，例如：

- 轻微 rotation variance
- 极小位置偏差
- 极小尺寸变化

禁止：

- 相框重新排版
- 改成规则网格
- 增加相框
- 删除相框
- 覆盖彩灯
- 改变摄影墙交互

---

# 8. String Light

当前彩灯已经完成位置调整。保持：

- 位于摄影墙上方
- 水平延伸
- 暖白小灯
- 一条灯串

不要增加第二条。不要让相框覆盖灯串。

---

# 9. World Map

当前地图属于装饰元素。不要擅自：

- 下载网络图片
- 替换成真实地图
- 增加复杂纹理
- 添加交互

当前阶段只检查：

- 是否与墙体重叠
- 是否漂浮
- 是否穿模
- 是否比例明显失衡
- 是否出现明显 z-fighting

如果没有结构性问题：保持不动。

---

# 10. Skill Tags

当前左墙技能标签：不要在本 Skill 中进行大规模重构。

只记录未来视觉方向：不是规则矩形 UI 卡片，而应该逐渐接近一条轻微弧形的 studio inspiration string。

要求未来：

- 不完全笔直
- 不像网页 UI
- 不像导航菜单
- 像工作室墙面上的灵感标签

本阶段不要为了这个目标大改代码。

---

# 11. Materials

整体材质必须：

semi-matte
soft
warm

禁止：

- 过度 glossy
- 镜面地板
- 塑料木材
- 强烈金属反射
- 高亮白墙
- 过度 PBR

Wood：roughness 较高。
Wall：matte。
Fabric：soft matte。
Metal：少量反射。

---

# 12. Lighting

Lighting 必须继续保持 Afternoon → Golden Hour，不是 Night Scene。

要求：

- Natural Window Light
- Soft Environment Light
- Warm Pendant Light
- Warm Floor Lamp

形成多层次照明。

禁止通过提高灯光 intensity 把整个房间染成黄色。

尤其检查：

- 白墙
- 摄影墙
- 木地板
- 沙发
- 桌面

必须保持材质颜色。

---

# 13. Fog

Fog 只用于轻微空气感。禁止明显雾感。

默认近处物体清晰，远处轻微柔化。

不要出现：

- 灰蒙蒙
- 白雾
- 游戏地图雾效

---

# 14. Spatial Composition

整个房间必须保持：

前景 → 中景 → 背景

三个空间层次。

- 前景：沙发、茶几、地毯
- 中景：相机、桌子、椅子
- 背景：摄影墙、书架、窗户、海报

任何新物体都不得：

- 堵塞摄影墙
- 堵塞桌面
- 堵塞窗户
- 堵塞主要 Camera view
- 破坏空间纵深

---

# 15. “程序化感”检查

每次视觉修改完成后必须检查：

1. 是否出现大量完全相同的物体？
2. 是否所有东西都排列得过于整齐？
3. 是否出现大量规则矩形？
4. 是否出现大量平行线？
5. 是否出现不自然的几何重复？
6. 是否某个物体因为比例太大成为视觉中心？
7. 是否某个物体像简单 primitive 拼出来？
8. 是否出现明显穿模？
9. 是否出现漂浮？
10. 是否出现 z-fighting？
11. 是否出现不必要的深色缝隙？
12. 是否出现材质颜色跳变？

如果答案为 YES：优先修复视觉问题。

---

# 16. Performance

所有视觉优化必须遵守：

- shared geometry
- shared materials
- controlled DPR
- controlled shadows
- no unnecessary useFrame
- no huge textures

大量重复物体可使用 InstancedMesh，但不要为了使用 InstancedMesh 而破坏：

- 独立交互
- raycasting
- hover
- click

如果物体需要独立交互：优先保持独立 InteractiveObject。

---

# 17. 修改范围原则

每次执行这个 Skill：

先定位问题，然后最小修改。

不要：

- 「发现地板不好看 → 顺便重做整个房间」
- 「发现书架不好看 → 重构所有家具」
- 「发现灯光不好 → 重写 Lighting System」

必须问题驱动。

---

# 18. 最终视觉验收

Studio 默认视角必须同时满足：

- Floor：平整、连续、人字纹自然
- Photo Wall：13 个相框清晰、无重叠、位于彩灯下方
- String Light：完整可见
- Pendant：不遮挡摄影墙
- Tripod：三脚架结构真实
- Bookcase：开放式
- Lighting：下午 → Golden Hour
- Fog：非常轻
- Room：有前中后景

Overall：

- 不像游戏地图
- 不像 3D 简历模板
- 不像程序生成 Demo

而应该像：

> 「一个真的有人工作的温暖个人创作工作室」

---

# 19. 执行原则

执行本 Skill 时：

1. 先读取当前 Studio 实际代码。
2. 针对当前最明显的问题，优先修复 Floor。
3. 然后检查 Pendant / Tripod / Bookcase。
4. 如果这些问题确实存在，再做最小修正。
5. 不要修改：Entry、Contact Modal、PhotoGallery、13 Photo IDs、Works、Resume、Camera Director、OrbitControls。
6. 完成后运行 typecheck / lint / build。

如果某项没有实际问题：明确写「保持不动」。不要为了完成列表强行修改。
