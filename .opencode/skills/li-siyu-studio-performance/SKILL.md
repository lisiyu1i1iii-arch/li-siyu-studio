---
name: li-siyu-studio-performance
description: LI SIYU MY LITTLE STUDIO 的性能、加载、3D资源、Texture、DPR、阴影、移动端、WebGL降级和稳定性规范。负责确保高质量3D工作室在桌面与移动设备上保持流畅，避免模型、材质、灯光、图片和动画无限堆叠。任何视觉升级都必须在性能约束内完成。
---

# LI SIYU — MY LITTLE STUDIO
# PERFORMANCE & STABILITY SKILL

## 1. CORE PRINCIPLE

Studio的目标不是：

“模型越多越高级”。

而是：

“在合理性能下获得最高视觉质量”。

必须始终遵守：

VISUAL QUALITY
+
INTERACTION QUALITY
+
PERFORMANCE
+
STABILITY

四者同时成立。

---

# 2. PERFORMANCE PRIORITY

优先级：

1. 页面能稳定打开
2. 3D Canvas正常显示
3. 用户可以环视
4. 交互正常
5. Camera Focus正常
6. 内容Overlay正常
7. 作品图片正常加载
8. 再增加视觉细节

禁止：

为了增加装饰导致：

白屏
卡死
崩溃
严重掉帧

---

# 3. DO NOT REWRITE THE APP

性能优化时：

不要重写整个项目。

优先：

找到真正的性能瓶颈。

然后：

局部优化。

---

# 4. FIRST LOAD

Entry页面应该尽量轻。

进入Entry：

不要加载所有高清摄影作品。

不要加载所有Gallery图片。

不要提前加载大量3D资源。

Entry只需要：

品牌
门
Mailbox
必要的环境

---

# 5. ENTER STUDIO

用户点击Door：

再进入Studio。

Studio资源：

可以分阶段加载。

例如：

Environment
→ Furniture
→ Interactive Objects
→ Images

---

# 6. LOADING SCREEN

加载过程中：

必须有明确Loading状态。

不能：

黑屏等待
白屏等待
没有反馈

可以显示：

ENTERING STUDIO

或者：

LOADING STUDIO

---

# 7. NO FAKE LOADING

Loading百分比：

如果没有真实进度：

不要伪造：

73%
82%
97%

可以使用：

Loading…

或者：

Entering Studio…

---

# 8. 3D MODEL STRATEGY

优先：

low-poly / optimized geometry

不需要：

为了一个普通桌腿使用几万个polygon。

---

# 9. GEOMETRY

避免：

大量高segments圆柱。

例如：

桌腿

不需要：

64 segments

可以使用：

16 ~ 24

具体根据视觉需要调整。

---

# 10. ROUNDED OBJECTS

圆角物体：

优先使用：

合理segments

而不是：

无限细分。

桌子
椅子
沙发
相框
杯子

都应该控制geometry复杂度。

---

# 11. INSTANCING

重复物体优先使用InstancedMesh。

尤其：

Keyboard keys
Books
Fasteners
Photo elements
Repeated labels
Plant leaves
Small decorations

不要：

复制几百个独立Mesh。

---

# 12. BOOKS

书籍很多时：

优先：

instancing

或者：

合并geometry。

不要：

每一本书都创建大量React组件和独立material。

---

# 13. PHOTO FRAMES

13个PhotoFrame：

数量本身不高。

但是：

每个Frame仍然应该：

独立interaction

同时：

共享geometry/material资源。

不要：

为13个Frame创建13套完全相同的geometry。

---

# 14. PHOTO TEXTURES

摄影图片：

不要默认全部使用超大原图。

优先：

optimized web images

合理尺寸。

---

# 15. IMAGE SIZE

如果一个照片在屏幕上：

只显示1000px宽

不要加载：

8000px原图

除非Gallery确实需要。

---

# 16. GALLERY HIGH RES

Gallery可以：

进入时加载更高质量图片。

不要：

Entry页面就全部加载13张高清照片。

---

# 17. LAZY LOADING

Gallery：

优先加载当前图片。

可以预加载：

上一张
下一张

但不要：

一次加载所有超高清图片。

---

# 18. IMAGE FORMAT

优先使用：

WebP
AVIF

如果浏览器兼容性或项目情况不适合：

使用JPEG / PNG。

不要无理由全部使用PNG。

---

# 19. PNG

PNG只适合：

需要透明背景
或者特殊图形

摄影作品：

优先不要PNG。

---

# 20. TEXTURE REUSE

重复材质：

尽量共享Texture。

不要：

相同木纹加载十几遍。

---

# 21. MATERIAL REUSE

相同材质：

共享Material。

例如：

Wood
DarkWood
CreamFabric
DeepGreen
Metal

不要：

每个物体创建完全独立的Material对象。

---

# 22. DRAW CALLS

减少：

draw calls

尤其：

大量重复小物件。

优先：

instancing
geometry merging
material reuse

---

# 23. SMALL DECORATIONS

Studio中的：

杯子
笔
纸
小植物
书
标签

数量必须克制。

它们用于：

生活感

不是：

填满整个场景。

---

# 24. DETAIL DENSITY

每个区域：

应该有视觉重点。

不要：

每平方米都放东西。

---

# 25. PHOTO WALL

13个照片框已经足够形成：

高密度视觉区域。

不要再无限添加：

照片
贴纸
文字
装饰物

---

# 26. SHELF

悬浮Shelf：

只放：

部分书
3个左右succulents

不要：

堆满几十本书。

---

# 27. BOOKCASE

5层Bookcase：

大约60%书籍。

不是：

100%塞满。

留一些空隙。

空白也是设计。

---

# 28. WORLD MAP

World Map：

使用用户指定图片资源时：

不要加载：

超过实际显示需求的大图。

如果地图只是墙面装饰：

优化Texture尺寸。

---

# 29. STRING TAGS

标签：

数量有限。

不要：

几十个DOM标签。

3D标签如果重复：

可以复用geometry/material。

---

# 30. LIGHT COUNT

灯光必须克制。

优先：

1个主要DirectionalLight

+
少量环境光

+
必要的局部灯

不要：

每个家具一个Light。

---

# 31. SHADOW LIGHTS

Shadow-casting lights：

数量必须严格控制。

通常：

主要太阳光负责大范围阴影。

局部灯：

除非视觉确实需要，否则不要开启实时Shadow。

---

# 32. SHADOW MAP

Shadow map：

不要无限增大。

桌面、照片墙、家具：

不需要：

超高分辨率Shadow Map。

---

# 33. CONTACT SHADOW

可以使用：

轻量contact shadow

增强：

家具接地感。

但是：

不要让AO和Contact Shadow都达到非常高强度。

---

# 34. AO

Ambient Occlusion：

适度。

如果出现：

所有家具边缘都是黑色

说明：

AO太强。

---

# 35. POST PROCESSING

后处理必须克制。

优先：

无后处理

或者：

少量后处理。

禁止为了“高级”堆：

Bloom
DOF
Chromatic Aberration
Film Grain
Vignette
Color grading

全部同时开启。

---

# 36. BLOOM

Bloom：

默认关闭或极低。

只允许：

LED
Lamp
Screen

产生轻微Glow。

---

# 37. DOF

景深：

如果使用：

必须非常轻。

不要：

让大量物体模糊。

---

# 38. PARTICLES

粒子：

默认不需要。

如果使用：

数量严格控制。

不要：

几十万粒子。

---

# 39. FLOATING DUST

灰尘粒子：

如果未来增加：

必须是少量。

主要用于：

阳光光束中的氛围。

不能：

让整个房间像下雪。

---

# 40. ANIMATION

动画必须：

必要才存在。

例如：

Hover
Camera
Golden Hour
Pendant微动

不要：

所有植物一直晃。

不要：

所有物体一直浮动。

---

# 41. HOVER ANIMATION

Hover：

轻微。

不要：

持续复杂动画。

---

# 42. CAMERA ANIMATION

Camera Focus：

一次动画。

动画完成：

停止。

不要：

持续Camera animation loop。

---

# 43. ORBIT CONTROLS

普通浏览：

允许左右旋转。

禁止普通Zoom。

必须：

enableZoom = false

---

# 44. CAMERA LIMIT

Camera必须：

限制在Studio内部。

不能：

因为性能或交互修改导致Camera跑出房间。

---

# 45. CAMERA RENDERING

不要：

为了追求极致画质

把Camera：

DPR
Shadow
Postprocessing

全部设置到最大。

---

# 46. DPR

Desktop：

根据设备性能设置合理DPR。

不需要：

强制DPR = 3。

---

# 47. MOBILE DPR

Mobile：

建议降低DPR。

例如：

1 ~ 1.5

具体根据设备性能。

---

# 48. RESPONSIVE PERFORMANCE

可以根据：

device profile

调整：

DPR
shadow
texture quality
light quality
postprocessing

---

# 49. QUALITY LEVELS

建议：

High
Medium
Low

High：

Desktop高性能设备。

Medium：

普通Laptop。

Low：

Mobile / integrated GPU。

---

# 50. HIGH QUALITY

High：

完整Studio
合理Shadow
完整材质
正常Texture

---

# 51. MEDIUM QUALITY

Medium：

降低：

Shadow resolution
DPR
Texture resolution
Postprocessing

保留：

主要模型
主要交互

---

# 52. LOW QUALITY

Low：

降低：

Shadow
DPR
Texture
Decorations

保留：

主要家具
交互物体
Camera
Content

---

# 53. PERFORMANCE FALLBACK

如果WebGL不可用：

不能白屏。

应该显示：

简洁的DOM版本。

至少提供：

ABOUT
PROJECTS
EXPERIENCE
WORKS
SKILLS
CONTACT

---

# 54. WEBGL ERROR

如果3D初始化失败：

捕获错误。

不要：

让整个React应用崩溃。

---

# 55. ERROR BOUNDARY

3D Canvas：

应该有Error Boundary。

如果3D组件异常：

显示：

Studio 3D unavailable

并提供：

Quick View

---

# 56. NO WHITE SCREEN

这是最高优先级之一。

任何情况下：

加载失败
Texture失败
WebGL失败
模型失败

都不能：

出现永久白屏。

---

# 57. ASSET FAILURE

单个图片失败：

不能导致整个Studio失败。

例如：

Photo07加载失败

不能导致：

13张照片全部不显示。

---

# 58. MODEL FAILURE

单个装饰模型失败：

不能导致：

整个场景崩溃。

应该：

fallback placeholder

或者：

跳过该装饰。

---

# 59. SUSPENSE

React Suspense：

可以使用。

但必须：

提供fallback。

不要：

Suspense无限等待。

---

# 60. ASSET PRELOAD

只Preload：

首屏必要资源。

不要：

把整个Portfolio所有资源全部preload。

---

# 61. ROUTE LOAD

Entry：

轻。

Studio：

主要3D资源。

CV：

DOM内容优先。

Admin：

不要影响Studio首屏。

---

# 62. ADMIN

Admin页面：

不要加载完整Studio 3D场景。

---

# 63. CV

CV页面：

不要强制加载：

Three.js场景

除非当前架构确实需要。

---

# 64. CODE SPLITTING

大型组件：

可以lazy load。

例如：

Gallery
Quick View
Admin
CV相关模块

---

# 65. THREE.JS IMPORTS

不要：

无理由引入大量Three.js扩展。

只加载实际使用的模块。

---

# 66. UNUSED CODE

性能优化时：

清理：

unused imports
unused components
unused textures
unused data

尤其：

已经删除TV后：

必须清理TV相关：

component
data
interaction
camera target
imports

---

# 67. TV REMOVAL

TV已经从Studio删除。

性能Skill必须保证：

不存在：

TV mesh
TV texture
TV material
TV interaction
TV camera target
TV data

任何Ghost资源。

---

# 68. OLD CODE

不要：

为了“保险”保留大量旧TV代码。

如果已经确定删除：

删除。

---

# 69. MEMORY

避免：

重复创建大型Texture。

避免：

不断创建Material。

避免：

每次render创建Geometry。

---

# 70. REACT STATE

不要：

把每帧变化数据放进React state。

例如：

camera position

不要：

每一帧setState。

---

# 71. USEFRAME

useFrame：

必须克制。

不要：

几十个组件同时运行复杂useFrame。

---

# 72. EVENT LISTENERS

不要：

每次render重复注册：

mousemove
keydown
resize

必须：

正确cleanup。

---

# 73. TIMER CLEANUP

setTimeout
setInterval

使用后必须：

cleanup。

---

# 74. MEMORY LEAK

任何：

event listener
timer
animation
subscription
resource

都必须：

在unmount时正确清理。

---

# 75. DISPOSE

删除动态Three.js资源时：

正确dispose：

Geometry
Material
Texture

但是：

共享资源不能被错误dispose。

---

# 76. SHARED RESOURCE SAFETY

如果Geometry或Material被多个对象使用：

不要：

某一个组件卸载时直接dispose共享资源。

---

# 77. GALLERY MEMORY

用户连续浏览：

13张照片

不应该：

把13张超高清图片永久保留在内存。

---

# 78. IMAGE CACHE

可以使用浏览器缓存。

但不要：

自己创建无限缓存。

---

# 79. LARGE IMAGES

超过实际显示需求的图片：

应优化。

不要：

把手机原图直接当Web Texture。

---

# 80. TEXTURE FILTERING

Texture：

根据实际需求设置合理：

minFilter
magFilter
anisotropy

不要：

所有Texture都设置最高anisotropy。

---

# 81. ANISOTROPY

地板Texture：

可以适当提高。

小装饰：

没有必要。

---

# 82. FLOOR

Herringbone Floor：

不要使用：

超大8K纹理。

可以：

程序化生成
或者：
合理尺寸Texture。

---

# 83. PROCEDURAL MATERIALS

简单材质：

优先使用：

程序化颜色
简单roughness
轻量noise

不要：

为了每个家具制作巨大Texture。

---

# 84. POSTER

Academic Poster：

Canvas procedural art

优点：

不需要加载外部大图片。

保持：

轻量。

---

# 85. POSTER TEXTURE

如果Canvas生成Poster：

可以生成：

低分辨率CanvasTexture

只要实际显示足够清晰。

---

# 86. WORLD MAP

World Map：

用户指定外部图片。

加载时：

注意：

CORS

如果外部图片无法作为Texture使用：

不要让Studio崩溃。

可以：

fallback placeholder

---

# 87. EXTERNAL IMAGE FAILURE

如果外部Pinterest图片：

无法加载

不要：

无限重试。

不要：

让Canvas崩溃。

---

# 88. EXTERNAL LINK

作品链接：

不会影响3D性能。

打开外部链接：

优先新标签页。

---

# 89. MOBILE PHOTO GALLERY

移动端：

Gallery只加载：

当前
+
下一张

不要：

一次加载13张高清图。

---

# 90. TOUCH PERFORMANCE

移动端：

避免：

复杂Hover。

Touch设备：

不应该运行鼠标Hover动画。

---

# 91. MOBILE 3D

移动端可以：

减少：

小装饰
Shadow
Texture
DPR

但必须保留：

主要家具
13 PhotoFrame
Posters
Desk
Camera
Phone
Bookcase
Windows

---

# 92. MOBILE QUICK VIEW

如果设备性能不足：

提供：

Quick View

但不要：

直接让用户无法访问内容。

---

# 93. FPS TARGET

目标：

Desktop：

接近60fps

普通Laptop：

保持稳定流畅

Mobile：

优先稳定而不是追求60fps。

不要为了数字而牺牲：

加载
交互
稳定性。

---

# 94. FRAME DROP

如果出现：

明显卡顿

首先检查：

1. Shadow
2. Postprocessing
3. Texture
4. Geometry
5. Lights
6. useFrame
7. React rerender

不要直接：

删除整个Studio。

---

# 95. PERFORMANCE DEBUGGING

遇到卡顿：

不要猜。

应该逐项关闭：

Postprocessing
→ Shadows
→ Local Lights
→ High-res Textures
→ Decorations

找到真正瓶颈后：

只优化问题部分。

---

# 96. VISUAL REGRESSION

性能优化：

不能破坏：

PhotoWall
Poster
Desk
Camera
Phone
Bookcase
WorldMap
Windows

---

# 97. INTERACTION REGRESSION

性能优化：

不能破坏：

13 PhotoFrame独立点击
Gallery
Camera Focus
Poster interaction
Computer interaction
Phone interaction
Camera interaction
Skills interaction
Mailbox
Entry Door

---

# 98. LIGHTING REGRESSION

性能优化：

不能让：

Studio突然变灰
Studio突然变黑
Poster不可读
PhotoWall不可见

---

# 99. LOADING REGRESSION

修改资源后：

必须检查：

Entry
→ Studio

是否：

正常加载。

---

# 100. BUILD

必须执行：

npm run typecheck

npm run lint

npm run build

---

# 101. PERFORMANCE CHECK

桌面：

[ ] Entry快速出现
[ ] Studio能够正常加载
[ ] 首屏没有明显卡顿
[ ] Camera环视流畅
[ ] Hover流畅
[ ] 点击Focus流畅
[ ] Gallery切换流畅

---

# 102. MOBILE CHECK

手机：

[ ] Entry正常
[ ] Studio正常
[ ] 主要家具可见
[ ] Camera可操作
[ ] Phone可操作
[ ] Poster可操作
[ ] PhotoGallery正常
[ ] Swipe正常
[ ] Quick View可用

---

# 103. WEBGL CHECK

[ ] WebGL成功时显示3D
[ ] WebGL失败时有Fallback
[ ] 不出现永久白屏
[ ] 错误不会导致整个React崩溃

---

# 104. RESOURCE CHECK

[ ] 没有明显重复Texture
[ ] 没有无意义超大Texture
[ ] 重复Geometry尽量共享
[ ] 重复Material尽量共享
[ ] 大量重复物体使用Instancing
[ ] 动态资源正确cleanup

---

# 105. CODE CHECK

[ ] 没有明显unused imports
[ ] 没有重复Camera系统
[ ] 没有重复Interaction系统
[ ] 没有重复Gallery系统
[ ] 没有无意义useFrame
[ ] 没有重复event listeners
[ ] 没有未清理timer
[ ] 没有Ghost TV code

---

# 106. PERFORMANCE GOLDEN RULE

永远不要：

“为了更真实，就加更多模型。”

优先：

更好的：

Lighting
Material
Shadow
Composition
Camera

而不是：

更多Geometry。

---

# 107. PERFORMANCE GOLDEN RULE 2

永远不要：

“为了高清，就用原图。”

应该：

根据实际显示尺寸决定资源尺寸。

---

# 108. PERFORMANCE GOLDEN RULE 3

永远不要：

“为了高级，就堆后处理。”

一个：

漂亮的自然光

通常比：

五种Postprocessing

更重要。

---

# 109. PERFORMANCE GOLDEN RULE 4

永远不要：

为了修一个小问题重写整个Studio。

先定位。

再局部修改。

---

# 110. AGENT BEHAVIOR

当用户提出：

“把这个东西做得更真实”

Agent必须先考虑：

Geometry
Material
Lighting
Texture

是否已经足够。

不要默认：

增加大量模型。

---

# 111. AGENT BEHAVIOR

当用户提出：

“把这个地方做丰富”

Agent应该：

增加少量高价值细节。

而不是：

批量生成几十个物件。

---

# 112. AGENT BEHAVIOR

当用户提出：

“图片更清楚”

Agent应该先考虑：

Texture resolution
Image compression
Display size
Filtering

而不是：

直接加载超大原图。

---

# 113. AGENT BEHAVIOR

当用户提出：

“灯光更高级”

先使用：

Lighting Skill。

不要：

随意添加几十个PointLight。

---

# 114. AGENT BEHAVIOR

当用户提出：

“交互更酷”

先使用：

Interaction Skill。

不要：

在组件内部创建第二套Camera。

---

# 115. AGENT BEHAVIOR

当用户提出：

“摄影作品更好看”

先使用：

Works Gallery Skill。

不要：

重写PhotoWall。

---

# 116. FINAL PERFORMANCE PHILOSOPHY

这个Studio应该：

看起来复杂

但：

技术结构应该简单。

用户看到：

很多生活细节。

代码却：

尽可能复用。

最终目标：

HIGH VISUAL DENSITY
+
LOW TECHNICAL WASTE

---

# 117. FINAL VALIDATION

任何较大的性能/视觉修改之后：

必须执行：

npm run typecheck
npm run lint
npm run build

并检查：

Entry
Studio
Quick View
Gallery
CV
Admin

至少不能出现：

白屏
404
JS runtime error
无法进入Studio
Gallery打不开

---

# 118. FINAL RULE

如果“更漂亮”和“完全不卡”之间存在冲突：

优先：

稳定运行。

然后：

寻找更聪明的视觉实现。

不要用暴力增加资源解决问题。

END OF SKILL