---
name: li-siyu-studio-interaction
description: LI SIYU MY LITTLE STUDIO 的三维场景交互系统规范。负责所有可交互物体、Hover反馈、点击行为、Camera Director镜头移动、内容弹窗、返回场景、键盘操作、交互优先级以及物体之间的交互隔离。修改场景模型时必须保护已有交互，不允许为了改视觉而破坏交互架构。
---

# LI SIYU — MY LITTLE STUDIO
# INTERACTION SYSTEM SKILL

## 1. CORE PRINCIPLE

这是一个“可探索的个人工作室”，不是普通网页。

核心交互理念：

SPACE = NAVIGATION

用户不是通过传统导航栏浏览全部内容，而是：

看到空间
→ 发现物体
→ Hover
→ 点击
→ Camera Director 平滑靠近
→ 打开 DOM 内容层
→ 阅读
→ 关闭
→ Camera 返回原始浏览位置

交互必须让用户感觉自己是在“探索工作室”。

禁止把整个页面做成普通网页式按钮集合。

---

# 2. EXISTING ARCHITECTURE

项目技术结构：

Three.js / React Three Fiber
负责：

- 3D场景
- 家具
- 工作室物件
- 灯光
- 摄像机
- Hover
- 点击
- Camera Director

React / DOM
负责：

- 内容弹窗
- 项目文字
- 作品展示
- 信息面板
- 快速浏览
- Contact
- Gallery UI

不要改变项目已有的技术架构。

不要因为修改交互而重新设计整个应用。

优先复用现有：

- InteractiveObject
- Camera Director
- Zustand / store
- ContentOverlay
- Quick View
- CameraRig
- 现有scene数据结构

如果已有组件可以复用，不要重新制造一套重复系统。

---

# 3. INTERACTION MAP

必须保持以下交互映射：

## Academic Posters

两个学术海报：

Interaction:
基本信息

点击：

Camera Focus
→ 打开 ABOUT / 基本信息内容

两个海报属于同一个内容入口。

不要给两个海报制造两个不同的内容系统。

---

## Camera

Interaction:

影视作品

点击：

Camera Focus
→ 打开影视作品

作品状态目前可以保留：

“后续给链接”

没有真实视频链接时：

不要伪造视频。

---

## Vertical Phone

Interaction:

文字作品

点击：

Camera Focus
→ 打开文字作品

文字作品包含真实微信公众号链接。

---

## Computer

Interaction:

视觉类设计

点击：

Camera Focus
→ 打开视觉类设计

视觉设计内容可包含：

- 易拉宝
- 平面视觉
- 其他视觉作品

---

## 13 Photo Frames

Interaction:

摄影作品

但是必须特别注意：

13个照片框是13个独立交互对象。

不能：

整个PhotoWall一个Interaction。

不能：

13个照片框共享一个点击区域。

不能：

点击照片墙下面的Shelf导致照片Gallery打开。

必须：

Photo Frame 01
Photo Frame 02
...
Photo Frame 13

分别拥有自己的点击目标。

---

## Left Wall String Tags

Interaction:

技能

点击绳子或标签区域：

Camera Focus
→ 打开 Skills

字符串和标签属于同一个 Skills 入口。

---

## Mailbox

Entry Page：

Mailbox = Contact

点击：

打开Contact Modal

内容：

电话
19213397013

Email
3334206878@qq.com

邮箱必须支持 mailto。

电话可以支持 tel。

---

## Arch Door

Entry Page：

Door = Enter Studio

但是：

门下方的文字不是独立按钮。

不要让文字形成第二个点击区域。

正确结构：

Door Group
→ clickable

Text
→ decorative only

用户点击门本体：

进入 Studio。

---

# 4. HOVER SYSTEM

所有主要可交互物体必须具有轻微Hover反馈。

Hover反馈包括：

- 非常轻微的scale
- 非常轻微的position float
- subtle glow
- cursor pointer
- optional label

但是：

不要做夸张动画。

不要让物体大幅跳动。

不要让家具旋转。

不要让物体突然放大到遮挡场景。

推荐：

scale ≈ 1.02 ~ 1.04

position y ≈ +0.01 ~ +0.03

动画应该：

ease-out
快速进入
缓慢退出

---

# 5. HOVER LABEL

Hover时可以出现：

BASIC INFO
PHOTOGRAPHY
VIDEO
WRITING
VISUAL DESIGN
SKILLS

但是Label必须：

- 小
- 克制
- 不遮挡主体
- 不改变布局
- 不影响点击区域

Label只是提示。

不能代替真正的交互。

---

# 6. CLICK SYSTEM

点击流程必须统一：

Pointer Down
→ 判断是否为InteractiveObject
→ 设置 activeInteraction
→ Camera Director 获得目标
→ smooth camera transition
→ 内容层打开

不要：

点击以后瞬间Teleport。

不要：

直接改变camera position造成突兀跳跃。

---

# 7. CAMERA DIRECTOR

必须继续使用现有Camera Director。

Camera移动：

smooth
cinematic
短距离
有缓动

建议：

duration:
0.8s ~ 1.4s

不要使用：

instant jump

不要因为一个物体的位置变化而重新设计整个Camera系统。

---

# 8. CAMERA FOCUS

每个InteractiveObject都应该拥有：

- focus position
- focus target
- optional focus offset

Focus目标必须根据物体大小自动合理调整。

不要让Camera：

穿墙
穿家具
进入物体内部
贴到模型表面
突然离开房间

---

# 9. NORMAL BROWSING CAMERA

普通浏览状态：

禁止普通Zoom。

OrbitControls：

enableZoom = false

用户可以：

左右环视

允许：

轻微上下观察

但必须限制垂直角度。

不要允许：

无限翻转。

不要允许：

相机跑出房间。

---

# 10. OBJECT FOCUS ≠ NORMAL ZOOM

这是一个核心规则。

普通滚轮：

不能Zoom。

点击物体：

可以Camera Focus。

所以：

Scroll Zoom = OFF

Object Focus = ON

两者必须严格区分。

---

# 11. RETURN TO SCENE

打开内容之后：

用户必须能够返回场景。

支持：

- Close按钮
- ESC
- Back按钮

关闭内容后：

Camera Director 返回之前的浏览位置。

不要：

关闭内容后强制把用户传送到Entry页面。

---

# 12. ESC KEY

ESC优先级：

如果Gallery打开：

ESC
→ 关闭Gallery

如果ContentOverlay打开：

ESC
→ 关闭ContentOverlay

如果没有Overlay：

ESC
→ 不做任何危险操作

不要让ESC导致：

刷新页面
离开网站
返回首页

---

# 13. CLICK OUTSIDE

Overlay打开以后：

点击Overlay之外：

默认不要自动关闭。

因为作品内容可能比较长。

必须使用：

明确Close按钮

或者：

ESC

避免用户误触关闭。

---

# 14. INTERACTION LOCK

当ContentOverlay打开：

3D场景必须进入interaction lock。

即：

Overlay打开时：

禁止继续点击其他3D物体。

禁止同时打开两个内容。

禁止：

点击Camera
→ Camera Focus
→ 又点击Computer
→ 两个内容同时打开。

正确：

一次只允许一个active interaction。

---

# 15. CAMERA LOCK

Camera Focus过程中：

暂时禁止新的InteractiveObject点击。

例如：

Camera正在从：

Main View
→ Computer

此时用户连续点击：

Phone
Camera
Poster

不能产生多个Camera动画叠加。

应该：

等待当前transition完成。

或者：

取消当前transition后开始新的transition。

但绝对不能：

多个动画同时控制camera。

---

# 16. INTERACTION PRIORITY

点击判断优先级：

1. UI
2. Active Overlay
3. InteractiveObject
4. Scene
5. Background

UI层不能被3D场景抢点击。

Overlay打开时：

3D交互必须锁定。

---

# 17. PHOTO FRAME ISOLATION

这是整个网站非常重要的规则。

13个照片框：

Frame01
Frame02
Frame03
Frame04
Frame05
Frame06
Frame07
Frame08
Frame09
Frame10
Frame11
Frame12
Frame13

必须独立。

点击Frame03：

只打开Frame03对应作品。

不能因为PhotoWall是一个Group，就让整个Group拥有点击事件。

---

# 18. PHOTO FRAME AND SHELF MUST BE SEPARATE

照片墙下面有：

Floating Shelf

Shelf的作用：

装饰
书籍
植物

Shelf不是摄影作品入口。

因此：

PhotoFrame interaction
≠
Shelf interaction

两者必须使用不同InteractiveObject。

禁止：

把整个PhotoWall + Shelf包在一个InteractiveObject里面。

---

# 19. SHELF

悬浮长书架：

没有独立作品入口。

除非未来明确增加Interaction，否则：

Shelf = decorative object

书籍：

decorative

植物：

decorative

不要给每一本书添加点击事件。

---

# 20. BOOKCASE

左侧高书柜：

默认：

decorative

不要自动继承旧的：

EXPERIENCE

如果未来需要恢复Experience入口，必须单独指定。

当前架构中：

Experience不应该偷偷绑定到书柜。

---

# 21. WORLD MAP

World Map：

decorative / Skills visual context

真正的Skills Interaction属于：

Left Wall String Tags

不是World Map。

因此：

点击World Map：

不要打开Skills。

---

# 22. DESK / CHAIR

Desk：

decorative

Chair：

decorative

不要给Desk创建新的Interaction。

Computer才是：

视觉类设计

Phone才是：

文字作品

Camera才是：

影视作品

---

# 23. POSTER INTERACTION

两个Academic Posters：

必须成为：

基本信息

入口。

TV已经删除。

不得保留：

TV interaction

TV route

TV camera target

TV data

TV label

TV hover

TV event

TV component

任何残留。

如果项目中存在TVCorner：

应删除或者完全从场景中移除。

---

# 24. NO GHOST INTERACTIONS

删除一个物体时：

必须同时删除：

- mesh
- group
- interaction
- click handler
- hover handler
- camera target
- content mapping
- data
- label
- old route
- unused imports

不能：

视觉上删除了TV，
但点击空气仍然触发TV。

这叫Ghost Interaction。

绝对禁止。

---

# 25. CONTENT OVERLAY

内容Overlay：

不要覆盖整个屏幕。

应该保留：

20% ~ 35%

的3D场景可见区域。

让用户知道自己仍然在Studio里。

Overlay可以：

半透明
纸张感
轻微grain
圆角
柔和阴影

但不要变成普通后台管理界面。

---

# 26. OVERLAY OPEN ANIMATION

打开：

fade
+ slight translate
+ camera movement

关闭：

reverse

不要：

突然出现。

不要：

大幅缩放。

---

# 27. ACCESSIBILITY

所有交互必须尽量支持：

鼠标
键盘

ESC关闭。

InteractiveObject可以有：

aria-label

如果DOM中有对应按钮：

必须可Tab。

---

# 28. MOBILE

移动端：

不要求完整复刻桌面交互。

可以：

减少3D物体数量
减少阴影
减少粒子
降低DPR
限制Camera旋转

但是：

核心内容入口必须保留。

如果3D性能不足：

显示Quick View。

---

# 29. QUICK VIEW

Quick View是备用导航。

它不能取代Studio探索。

Quick View可以直接打开：

ABOUT
PROJECTS
EXPERIENCE
WORKS
SKILLS
CONTACT

但默认Studio体验仍然是：

空间探索。

---

# 30. REDUCED MOTION

如果：

prefers-reduced-motion

则：

减少Camera动画
减少Hover浮动
减少页面transition

但不要删除功能。

---

# 31. PERFORMANCE

不要为Hover创建大量React state。

优先：

shared interaction system

避免：

每一帧React rerender。

不要：

大量setInterval。

不要：

无限requestAnimationFrame。

---

# 32. DATA-DRIVEN INTERACTION

优先使用数据定义：

id
label
type
contentKey
position
focusPosition
focusTarget

例如：

{
  id: "academic-poster",
  label: "基本信息",
  contentKey: "about",
  interactionType: "content"
}

不要在几十个组件里硬编码重复逻辑。

---

# 33. INTERACTION IDS

建议：

poster-basic-info
camera-video
phone-writing
computer-visual
photo-01
photo-02
photo-03
photo-04
photo-05
photo-06
photo-07
photo-08
photo-09
photo-10
photo-11
photo-12
photo-13
skills-string
entry-door
entry-mailbox

ID必须稳定。

不要因为改模型位置而改变ID。

---

# 34. DO NOT BREAK EXISTING CONTENT

修改3D模型时：

不得删除：

- content overlay
- works data
- about data
- skills data
- contact data

除非用户明确要求。

视觉层和内容层应该分离。

---

# 35. WHEN MODIFYING EXISTING CODE

先检查：

1. InteractiveObject
2. camera-director
3. store
4. content mapping
5. scene object
6. overlay

然后再修改。

不要直接重写整个interaction system。

---

# 36. VALIDATION

每次交互修改后必须验证：

- npm run typecheck
- npm run lint
- npm run build

然后检查：

Entry：

Door可以点击
Mailbox可以点击
Door文字不可单独点击

Studio：

Poster可以点击
Camera可以点击
Phone可以点击
Computer可以点击
13个PhotoFrame分别可以点击
Skills String可以点击

检查：

Shelf不能打开Photography。

Bookcase不能意外打开Experience。

World Map不能意外打开Skills。

Desk不能意外打开Visual Design。

---

# 37. FINAL INTERACTION CHECKLIST

完成后必须确认：

[ ] 普通Zoom关闭
[ ] 左右环视正常
[ ] Camera不会跑出房间
[ ] Hover反馈轻微
[ ] 点击后Camera平滑移动
[ ] Overlay正常打开
[ ] ESC正常关闭
[ ] Close正常关闭
[ ] Overlay打开时3D交互锁定
[ ] 一次只打开一个内容
[ ] TV完全删除
[ ] Poster接管基本信息
[ ] Camera = 影视作品
[ ] Phone = 文字作品
[ ] Computer = 视觉类设计
[ ] 13 PhotoFrame独立点击
[ ] PhotoFrame与Shelf完全隔离
[ ] String Tags = 技能
[ ] Door = Enter Studio
[ ] Door文字不可单独点击
[ ] Mailbox = Contact
[ ] npm run typecheck通过
[ ] npm run lint通过
[ ] npm run build通过

---

# 38. IMPORTANT

不要为了让交互“看起来更酷”而加入：

- 大幅镜头摇晃
- 无限Zoom
- 自动旋转
- 强烈发光
- 巨大文字
- 满屏弹窗
- 大面积UI
- 游戏式血条
- 不必要的粒子

设计目标：

quiet
cinematic
discoverable
physical
editorial
warm

用户应该感觉：

“我发现了一个东西。”

而不是：

“网页一直在弹东西给我。”

END OF SKILL