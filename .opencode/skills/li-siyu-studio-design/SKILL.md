---
name: li-siyu-studio-design
description: LI SIYU MY LITTLE STUDIO 项目的总设计规范。用于所有 3D 小屋、空间布局、家具建模、材质、灯光、相机、交互和视觉细节开发。执行任何 Studio 页面修改前，应优先读取本 Skill。
---

# LI SIYU — MY LITTLE STUDIO
# Project Master Design Skill

## 0. Skill 的最高优先级

这是本项目的总设计规范。

任何 Agent 在修改本项目之前，都必须优先理解本 Skill。

本项目不是普通简历网站。

它是一个：

> 可以被探索的个人创意工作室。

核心设计概念：

> SPACE = NAVIGATION

用户不是通过普通网页导航浏览作品，而是通过点击房间中的真实物体进入不同内容。

---

# 1. 项目技术方向

当前项目使用：

- React / Next.js
- Three.js
- React Three Fiber
- Drei
- DOM UI
- CSS
- TypeScript

3D 场景负责：

- 房间
- 家具
- 墙面
- 地面
- 灯光
- 相机
- 物体
- Hover
- Click
- Camera Focus
- 空间探索

DOM UI 负责：

- 内容弹窗
- 文字
- 项目介绍
- 摄影 Gallery
- Contact
- Quick View
- Menu
- Loading
- 状态提示

不要把所有内容直接做进 Three.js Canvas。

---

# 2. 最重要的视觉目标

整体视觉必须接近：

> 温暖、真实、有生活痕迹的创意工作室。

关键词：

- warm
- cozy
- lived-in
- creative
- editorial
- handcrafted
- cinematic
- slightly nostalgic
- sophisticated
- natural
- playful

不要做成：

- 纯白极简办公室
- 冷冰冰的科技展厅
- 默认 Three.js Demo
- 低质量积木房间
- 全部物体都是 BoxGeometry
- 所有家具一个材质
- 所有物体都是简单立方体
- 空荡荡的大房间
- 过度卡通化
- 过度赛博朋克
- 纯游戏 UI

目标不是“模型很多”。

目标是：

> 少量高识别度物体 + 丰富材质 + 合理空间关系 + 温暖光影。

---

# 3. 空间总体原则

不要随意改变当前房间的整体 footprint。

尤其不要因为家具不好放而：

- 拉长房间
- 放大房间
- 改变墙体比例
- 随意移动整个房间
- 增加新的房间
- 删除主要墙体

如果需要解决拥挤问题：

优先：

1. 缩小家具
2. 移动家具
3. 调整角度
4. 调整相机
5. 调整物体之间的间距

最后才考虑改变房间结构。

---

# 4. 空间构图

房间必须具有明显的视觉层级。

不要让所有物体处于同一个深度。

应该形成：

Foreground
→ 中景
→ Background

例如：

Foreground：
- 沙发
- 咖啡桌
- 植物

Midground：
- 桌子
- 椅子
- 摄影机
- 书架

Background：
- 摄影墙
- 学术海报
- 地图
- 窗户
- 墙面

这样才能产生真实空间感。

---

# 5. 家具建模原则

家具禁止只使用简单 BoxGeometry 直接完成。

如果一个物体是：

桌子

至少应该有：

- 桌面
- 桌腿
- 结构连接
- 边缘厚度
- 材质变化
- 阴影

椅子至少应该有：

- 坐垫
- 靠背
- 支撑结构
- 腿
- 材质区别

书柜至少应该有：

- 侧板
- 层板
- 书
- 不同书的方向
- 阴影

相机至少应该有：

- 机身
- 镜头
- 镜头环
- 三脚架
- 三脚架连接点
- 三条真正落地的腿

不要让模型看起来像：

“几个方块拼起来”。

---

# 6. 材质原则

不同材质必须有不同视觉特征。

木材：

- warm brown
- subtle roughness
- 不要完全镜面

浅色墙：

- warm white
- slightly rough

深绿色墙：

- deep muted green

藤编：

- warm tan
- woven feeling
- 不要使用纯黄色塑料质感

布艺：

- roughness higher
- soft colors
- rounded geometry

金属：

- darker
- subtle reflection

纸张：

- matte
- slightly warm
- very low gloss

玻璃：

- subtle transparency
- 不要依赖透明度解决模型穿透问题

---

# 7. 当前核心色彩

主要空间：

Deep Green：

#2E5B4C

Warm White：

#E8E0D0

Cream：

#F2EDE4

Light Oak：

#C8A97E

Dark Wood：

#6B4A33

Rattan：

#D4A95C

Camel：

#E5D5C0

Floor：

#8B5A3B

Brass：

#B88A44

Warm Light：

#FFE0B0

这些颜色可以有明暗变化。

不要所有物体完全使用同一个 HEX。

---

# 8. 地面

地板应该是：

Herringbone wood floor

视觉方向：

- warm brown
- 木质
- 有方向性
- 不要纯色平面

不要做成：

- 灰色地板
- 纯棕色平面
- 棋盘格
- 过度高反光

---

# 9. 灯光

整体是温暖自然光。

优先：

- window light
- warm pendant lights
- floor lamp
- subtle ambient light
- soft shadow

避免：

- 纯白强光
- 过曝
- 所有物体没有阴影
- 所有角落一样亮
- 彩色 RGB 灯
- 赛博朋克灯光

目标：

> 下午到 golden hour 的温暖工作室。

---

# 10. 相机规则

相机是体验的一部分。

进入 Studio 后：

用户第一次看到：

> 完整房间 + 主要家具 + 主要互动对象。

普通滚轮 Zoom：

禁止。

OrbitControls：

- enableZoom = false
- 可以水平旋转
- 垂直旋转范围有限
- 不允许穿墙
- 不允许跑到房间外
- 不允许看到明显错误的背面结构

当前目标：

- 水平约 360°
- 垂直约 ±18°
- 相机始终处于房间内部
- 普通浏览不会自动推进相机

---

# 11. 点击物体后的相机行为

点击物体后：

不是瞬移。

应该：

1. 用户点击物体
2. Camera Director 收到目标
3. 相机平滑移动
4. 相机轻微调整方向
5. 物体成为视觉中心
6. DOM Overlay 出现

动画应该：

- smooth
- cinematic
- short
- controlled

不要：

- 瞬移
- 剧烈旋转
- 大幅拉近
- 相机穿模
- 相机跑到墙外

---

# 12. 当前空间导航映射

这是本项目非常重要的规则。

## 学术海报

功能：

基本信息

---

## 相机

功能：

影视作品

---

## 竖直手机

功能：

文字作品

---

## 电脑

功能：

视觉类设计

---

## 13 个摄影框

功能：

摄影作品

注意：

13 个摄影框必须：

> 每一个都是独立 InteractiveObject。

不能整个 PhotoWall 只有一个 Interaction。

点击其中一个：

进入摄影 Gallery。

Gallery 支持：

- 当前图片放大
- 上一张
- 下一张
- 左右箭头
- 键盘左右键
- 移动端左右滑动
- Esc 关闭

13 张图片必须形成真正的：

0 → 1 → 2 → ... → 12

循环或边界导航。

摄影墙本身不能和下面的书架共享 Interaction。

---

## 左墙标签绳

功能：

技能

绳子必须：

- 自然下垂
- 有弧度
- 两端固定
- 中间有自然 droop

标签必须：

> 真正挂在绳子上。

不要让标签看起来漂浮。

每个标签应该有：

- 小矩形卡片
- 圆孔或挂点
- 小绳/金属夹
- 微小旋转
- 不同高度

---

# 13. Entry 页面

Entry 页面和 Studio 页面分开。

Entry 不应该直接出现完整 3D 房间。

Entry：

- 品牌
- MY LITTLE STUDIO
- 拱门
- Mailbox
- Enter Studio
- 少量状态信息

拱门是主要入口。

文字：

> 不是独立互动对象。

只有：

- 拱门
- Mailbox

可以互动。

点击拱门：

进入 Studio。

---

# 14. Entry Mailbox

Mailbox 位于：

> 拱门旁边。

Mailbox 必须明显存在。

点击 Mailbox：

从页面中心打开 Contact Modal。

显示：

Phone：

19213397013

Email：

3334206878@qq.com

Email 应该支持 mailto。

Modal：

- 居中
- 温暖
- 简洁
- 不遮挡整个页面
- 有关闭按钮
- Esc 可以关闭

---

# 15. Studio 房间主要布局

## Back Wall

主要区域：

- 摄影墙
- 学术海报
- 桌子
- 电脑
- 相机

Back wall：

Deep Green

---

## Left Wall

主要区域：

- 5 层大书柜
- 世界地图
- 技能标签绳

---

## Right Wall

主要区域：

- 两个精致拱形窗
- 两个长凳
- 靠垫
- 玩偶/软装

---

# 16. 摄影墙

摄影墙必须：

> 不是一整块大软木板。

必须是：

13 个独立照片框。

排列：

5
4
3

整体：

- 不要机械网格
- 但必须平衡
- 间距统一到视觉合理
- 顶部高度接近学术海报挂点
- 占据左侧主要墙面
- 相框明显可见

照片框应该比之前更大。

不要做得像：

邮票。

---

# 17. 摄影框视觉

每个框可以有：

- 木质框
- 米白边框
- 图片
- 轻微阴影
- 小挂钩
- 不同图片内容

图片可以先使用 procedural placeholder。

但是：

> 框架和 Interaction 必须先完整建立。

未来替换真实照片时，不应该重新设计整个组件。

---

# 18. 摄影墙下面的悬浮书架

这是一个：

> 长、扁、悬浮式单层书架。

不是传统落地书柜。

结构：

- 长横向 shelf
- 左侧竖向支撑板
- 右侧竖向支撑板
- 支撑板向下延伸
- shelf 本身悬浮在墙上

不要：

- 做成完整柜子
- 做成多层架
- 直接贴地

书籍：

只放少量。

主要集中在左侧。

右侧：

放约 3 个小型多肉植物。

重要：

这个 Shelf：

> 不拥有摄影墙 Interaction。

---

# 19. 左侧 5 层大书柜

必须与摄影墙下面的悬浮书架区分开。

它是：

> 高大的 5 层开放式书柜。

特点：

- 高度约为墙高的 5/6
- 宽
- 5 层
- 约 60% 被书填充
- 40% 留白
- 书有不同方向
- 横放
- 竖放
- 小组排列
- 不要每层完全一样

顶部：

放一个 Globe。

非常重要：

> 不要给书柜增加完整木质背板。

后面直接看到墙。

这样才能像真正的开放式书架。

---

# 20. 世界地图

左墙书柜旁边：

放：

> Pale Green World Map

必须明显。

用户提供的目标图片：

https://i.pinimg.com/1200x/0f/93/b7/0f93b71d7a4866ad0c41de00b75546c9.jpg

目标：

- 清晰
- 较大
- 填充左墙下部
- 不要模糊成一块绿色
- 不要缩得很小

如果远程图片作为 texture 出现：

- CORS
- 加载失败
- 模糊
- 空白

优先把图片保存为：

public/assets/world-map.jpg

然后使用本地 texture。

不要在最终版本中留下明显的 broken image。

---

# 21. Desk

桌子：

- Light Oak
- 长桌
- 四角结构
- 大约占墙宽 1/3
- 不要过小
- 不要占满整面墙

桌子：

应该位于学术海报下面。

桌面：

可以有：

- Computer
- Phone
- Notebook
- Pen
- Coffee
- small plant
- desk lamp

但不要堆满。

---

# 22. Computer

电脑是：

> 视觉类设计 Interaction。

必须明显。

视觉：

- rounded monitor
- dark bezel
- screen
- stand
- base

不要做成黑色方砖。

点击电脑：

Camera focus

然后：

Visual Design Overlay

---

# 23. Phone

手机：

- vertical
- on a stand
- clearly visible
- slightly angled toward user

功能：

文字作品。

不要把手机直接平放在桌面。

---

# 24. Camera

Camera：

影视作品。

必须有：

- camera body
- lens
- lens rings
- top details
- tripod head
- 3 tripod legs

三脚架最重要：

三条腿必须：

> 从中心连接点向三个方向真正张开。

形成稳定三角结构。

三条腿：

- 起点接近 tripod center
- 终点接近 floor
- 形成明显 triangular stance
- 必须落地

不能：

- 三条腿平行
- 从侧面悬浮
- 只画三根竖直柱子

---

# 25. Academic Posters

TV Screen：

> 删除。

不要保留 TV。

不要保留：

- TVCorner interaction
- TV marker
- Screen interaction
- 隐藏 TV
- 透明 TV

删除整个 TV Screen。

原来的 TV interaction：

> 转移给 Academic Posters。

---

## Academic Poster 位置

位于：

> Computer 上方。

参考位置：

(0.35, 1.5, -1.48)

facing：

+Z

但是：

如果现有坐标系统与此不同：

> 以当前场景坐标系为准进行转换。

海报需要：

> 向上移动到电脑不会遮挡的位置。

---

## 两块海报

每块：

约：

1.05m × 0.78m

圆角原木框。

材质：

- raw wood
- matte paper

背景：

cream

---

## Poster 内容

标题：

"What Makes Everyday AI Feel Trustworthy?"

标题：

- bold
- black
- academic
- clear

副标题：

gray

下面：

7 个 Morandi pastel sticky-note blocks。

每个 block：

- 不同柔和颜色
- gray simulated text
- slight variation
- small rotation

下半部分：

Bar Chart：

5 bars

颜色：

- purple
- magenta
- cyan
- orange
- green

旁边：

5-color Pie Chart。

目标：

> 看起来像真实设计师制作的研究海报。

不是：

> 一个纯色矩形贴在墙上。

---

# 26. Poster 上方灯具

每块海报上方约：

0.25m

放：

dark wood rectangular plaque

上面：

warm white LED strip

再加入：

brass pendant drop

warm light。

灯光不能过强。

---

# 27. Seating

当前两个主要休闲座椅：

必须：

> 缩小到和其他家具比例协调。

不要让沙发/座椅成为房间里最大的物体。

两个座椅：

- 不要平行
- 不要全部朝正前
- 都略微向外旋转
- 形成自然 conversation area

大约：

20°–30°

朝向可以略微不同。

---

# 28. Round Rug

中心：

Round woven rug。

尺寸：

约 2.2m diameter

厚度：

约 0.02m

颜色：

#EDE6D8

边缘：

#C9BBA6

可以有：

- woven rings
- subtle radial pattern

不要做成：

- 发光圆盘
- 塑料圆盘

---

# 29. Rattan Chair

藤椅：

- rattan frame
- cream cushion
- green pillow
- brick pillow

与 lounge chair：

约 90°关系。

---

# 30. Coffee Table

Round coffee table：

直径约：

0.7m

高度：

0.35m

材质：

Dark Wood

#6B4A33

---

# 31. Right Wall Windows

删除旧的单一普通 Window。

改成：

> 两个 refined arched windows。

两个窗：

- 拱形
- 木框
- warm trim
- glass
- soft outdoor light

不要做成：

- 普通矩形浏览器窗口
- 巨大玻璃墙

---

# 32. Window Benches

每个窗下面：

一个长 bench。

特点：

- armless
- dark wooden round legs
- dark green upholstery
- white bead-like circular pattern

Bench 上：

只允许：

- pillows
- toys

不要放：

- 邮箱
- 书
- 花盆
- 电脑
- 其他杂物

Mailbox 属于 Entry 页面。

---

# 33. 空间生活感

房间需要有生活感。

可以使用：

- 植物
- 书
- 杯子
- 笔
- 纸
- 小装饰
- 抱枕
- 玩偶
- 篮子
- 小灯
- 轻微不规则摆放

但是：

> 生活感 ≠ 杂乱。

每一个装饰物都必须服务于构图。

---

# 34. Hover

互动物体 Hover：

可以出现：

- subtle scale
- tiny float
- soft glow
- cursor feedback
- small label

不要：

- 巨大放大
- 强烈发光
- 彩色边框
- 游戏 UI 感

---

# 35. Interaction 原则

任何互动对象必须：

1. 明确
2. 可点击
3. 有 hover feedback
4. 点击后 camera focus
5. 打开对应 DOM Overlay
6. 可以关闭
7. Esc 可以返回

不要出现：

> 看起来能点，但实际上点不到。

也不要出现：

> 一个大父级 InteractiveObject 把多个独立物体全部包进去。

尤其：

13 个摄影框必须独立。

---

# 36. DOM Overlay

Overlay：

- 不应该遮满整个屏幕
- 保留 3D 场景
- 宽度适中
- editorial
- warm paper
- subtle grain
- readable typography

推荐：

最大宽度约：

560px

不要做成：

传统后台管理面板。

---

# 37. Typography

整体偏：

editorial / magazine / portfolio。

标题可以：

- serif
- strong
- elegant

正文：

- readable sans serif

避免：

- 默认浏览器字体
- 游戏字体
- 科技感字体
- 过度装饰字体

---

# 38. Animation

动画应该：

> subtle + cinematic。

可以：

- door glow
- object hover float
- camera ease
- overlay fade
- image slide
- light intensity transition

不要：

- 高频弹跳
- 大幅旋转
- 复杂粒子
- 到处都是动画

动画必须服务于：

> 引导用户探索空间。

---

# 39. Performance

必须考虑：

- low-poly where appropriate
- instancing
- lazy loading
- compressed textures
- reasonable DPR
- avoid excessive shadows
- avoid unnecessary postprocessing
- avoid hundreds of unique heavy geometries

如果性能下降：

优先减少：

1. geometry complexity
2. texture resolution
3. shadow cost
4. postprocessing

不要首先破坏：

> 核心交互。

---

# 40. Mobile

移动端：

不要求完整复制桌面空间。

允许：

- simplified camera
- fewer decorations
- Quick View
- reduced motion

但核心内容必须可访问：

- ABOUT
- PROJECTS
- EXPERIENCE
- WORKS
- SKILLS
- CONTACT

---

# 41. 禁止事项

Agent 修改项目时禁止：

- 随意重写整个 Studio
- 删除已经正常工作的 Camera Director
- 恢复普通 Zoom
- 改变房间 footprint
- 删除互动系统
- 把所有物体变成 BoxGeometry
- 把所有材质变成同一个颜色
- 把照片墙做成一整块板
- 把摄影框合并成一个 Interaction
- 把摄影墙和书架绑定成同一个 Interaction
- 保留 TV Screen
- 保留旧 TV interaction
- 把标签做成漂浮文字
- 把绳子做成僵硬直线
- 给开放式书柜增加背板
- 把悬浮书架做成落地柜
- 把世界地图缩成很小
- 使用明显模糊的地图
- 把窗口做成普通矩形
- 在 bench 上堆放无关物体
- 用透明度解决穿模问题
- 用巨大 UI 遮住整个 3D 场景
- 未经要求改变已有真实内容
- 使用虚假的项目数据
- 修改用户真实简历数字
- 为了“看起来好看”虚构作品或经历

---

# 42. 修改代码之前必须做的事情

每一个任务开始前：

1. 阅读本 Skill。
2. 检查当前项目结构。
3. 找到现有相关组件。
4. 判断当前功能是否已经存在。
5. 尽量修改现有组件。
6. 不要无意义创建重复系统。
7. 保留已经正常工作的功能。

如果一个组件已经实现：

> 优先增量修改。

不要直接重写整个项目。

---

# 43. 执行任务的方式

一次只完成一个明确阶段。

不要同时：

- 改空间
- 改相机
- 改互动
- 改 UI
- 改性能
- 改内容

如果任务要求多个修改：

拆成独立阶段。

每个阶段结束后：

1. typecheck
2. lint
3. build

如果项目已有对应检查命令：

使用项目现有命令。

---

# 44. 每次修改后的报告

完成任务后必须告诉用户：

## Changed

修改了哪些文件。

## Implemented

实现了什么。

## Preserved

哪些已有功能没有动。

## Validation

- typecheck
- lint
- build

## Known Limitations

还有什么暂时没有实现。

不要声称：

> 已完成

如果实际只是 placeholder。

---

# 45. 视觉检查优先级

如果用户提供截图并说：

“看起来不对”。

不要马上重写代码。

先判断属于哪一类：

1. 比例问题
2. 空间位置问题
3. 深度问题
4. 材质问题
5. 光照问题
6. 相机问题
7. Interaction 问题
8. UI 问题

只修改对应层。

例如：

“照片墙太小”

不要顺便：

- 改书架
- 改相机
- 改灯光
- 改整个房间。

只解决照片墙。

---

# 46. 最重要的视觉判断

每次完成 3D 修改后，Agent 应主动检查：

### 第一眼

用户是否能看到：

- 房间
- 主要家具
- 摄影墙
- 桌子
- 学术海报
- 书柜
- 窗户
- 沙发

### 第二眼

是否能感受到：

> 这是一个人的工作室。

### 第三眼

是否会产生：

> 我想点一下看看。

如果答案不是：

> 是

继续调整构图。

---

# 47. 当前最终交互地图

必须保持：

Academic Posters
→ 基本信息

Camera
→ 影视作品

Vertical Phone
→ 文字作品

Computer
→ 视觉类设计

13 Photo Frames
→ 摄影作品

Left Wall Tags
→ 技能

Mailbox
→ Entry Contact

Arch Door
→ Enter Studio

---

# 48. 最终体验

用户进入网站：

ENTRY

看到：

> LI SIYU  
> MY LITTLE STUDIO

以及：

> 一个温暖、有生命感的拱门。

点击：

> Door

进入 Studio。

进入之后：

看到完整小屋。

用户可以：

旋转视角。

发现：

- 海报
- 相机
- 手机
- 电脑
- 摄影作品
- 技能标签

点击物体：

> Camera moves closer

然后：

> Editorial overlay appears

用户关闭：

> Camera returns

整个网站应该像：

> 进入一个属于设计师/新媒体创作者的私人工作室。

而不是：

> 浏览一个普通网页。

---

# 49. Agent 的最终原则

永远遵循：

> 不追求“模型多”。

追求：

> 形体准确 + 比例真实 + 材质丰富 + 光影自然 + 空间有层次 + 交互有意义。

最终目标：

> Make the room feel inhabited.

> Make every object tell part of LI SIYU's story.

> Make space become navigation.