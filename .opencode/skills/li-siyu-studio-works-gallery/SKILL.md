---
name: li-siyu-studio-works-gallery
description: LI SIYU MY LITTLE STUDIO 的作品展示与摄影Gallery规范。负责13张独立摄影作品、影视作品、推文作品、易拉宝作品的内容组织、Gallery打开、左右切换、作品详情、真实链接、占位内容、图片比例、作品元数据以及桌面与移动端展示体验。
---

# LI SIYU — MY LITTLE STUDIO
# WORKS GALLERY SKILL

## 1. CORE PRINCIPLE

作品不是普通网页卡片。

作品应该像：

工作室里真实存在的作品。

例如：

墙上的照片
桌上的手机
电脑上的视觉设计
摄像机旁边的影视作品

所以：

WORKS = OBJECTS + STORIES

---

# 2. WORK CATEGORIES

当前作品分类：

1. 摄影作品
2. 影视作品
3. 文字作品
4. 视觉类设计

---

# 3. PHOTOGRAPHY

摄影作品：

13张。

必须拥有13个独立作品对象：

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

---

# 4. PHOTO FRAME MAPPING

每一个墙上照片框：

必须对应一个photo ID。

例如：

Frame 01
→ photo-01

Frame 02
→ photo-02

Frame 03
→ photo-03

...

Frame 13
→ photo-13

不要让多个Frame共享同一个作品ID。

---

# 5. CLICK PHOTO

用户点击某个Frame：

例如：

photo-07

应该：

Camera Focus
→ 打开Photo Gallery
→ 当前索引 = 7

不是：

打开统一摄影首页
→ 再让用户重新寻找photo-07。

点击即定位。

---

# 6. GALLERY

Gallery打开后：

显示当前作品。

例如：

07 / 13

Previous
Next

Close

用户可以：

← 上一张
→ 下一张

---

# 7. NAVIGATION

Gallery支持：

Previous
Next

键盘：

ArrowLeft
ArrowRight

ESC：

Close Gallery

---

# 8. LOOP

默认可以循环：

photo-13
→ Next
→ photo-01

photo-01
→ Previous
→ photo-13

但是如果未来用户明确要求“不循环”，必须改成边界模式。

---

# 9. PHOTO TRANSITION

图片切换：

不要突然替换。

可以使用：

fade
slight slide
crossfade

动画：

约0.2 ~ 0.4s

不要：

复杂3D翻页。

不要：

过度动画。

---

# 10. PHOTO IMAGE

摄影作品图片：

优先保持原始比例。

不要强制所有图片裁切成正方形。

支持：

landscape
portrait
square

Gallery根据比例自动适配。

推荐：

object-fit: contain

避免重要内容被裁切。

---

# 11. PHOTO WALL

墙上的Frame：

必须是真实“相框”。

不是：

一块巨大Texture。

每个Frame：

独立mesh
独立位置
独立ID
独立interaction

---

# 12. PHOTO WALL LAYOUT

当前要求：

13个框。

布局：

5
4
3

剩余一个可以根据墙体视觉平衡安排。

如果用户明确要求：

5 / 4 / 3

则不要改变为规则网格。

保持：

slightly irregular
editorial
lived-in

但总体必须平衡。

---

# 13. PHOTO WALL SCALE

照片框不能过小。

第一排顶部：

尽量与Academic Poster的挂点高度形成视觉呼应。

照片墙应该：

占据左侧主要墙面。

但不能：

挤到Bookcase。

不能：

遮挡Bookcase。

---

# 14. PHOTO WALL + SHELF

摄影墙下面：

Floating Shelf

Shelf是装饰。

Shelf不能：

打开Photography Gallery。

Shelf不能：

成为PhotoWall的父级InteractiveObject。

---

# 15. PHOTO METADATA

每个摄影作品可以拥有：

id
title
category
year
description
image
credit
location

如果没有真实信息：

不要编造。

可以使用：

“摄影作品 01”

或者：

“图片待补充”

---

# 16. PLACEHOLDER RULE

如果真实图片还没有提供：

可以使用：

placeholder

但必须明显标记：

图片待补充

不要生成一个看起来像真实作品的假照片，然后当成真实作品。

---

# 17. CURRENT REAL CONTENT

作品集来源目前包含：

摄影作品：

3 items
“后续放”

因此如果真实13张照片尚未全部提供：

不要伪造13张真实作品。

可以先：

13个Frame
+
13个placeholder

等用户提供真实照片后替换。

---

# 18. VIDEO WORKS

影视作品：

目前有4项。

当前信息：

“后续给链接”

所以：

不要伪造视频URL。

可以展示：

影视作品 01
影视作品 02
影视作品 03
影视作品 04

并标记：

链接待补充

---

# 19. VIDEO DISPLAY

如果未来有真实视频URL：

优先使用：

video player

支持：

poster
play
pause
fullscreen

不要自动播放声音。

默认：

muted

---

# 20. WRITING WORKS

文字作品目前有2个微信公众号链接。

真实链接：

https://mp.weixin.qq.com/s/zrai2YZ0aklZH-HIbi3Uqw

https://mp.weixin.qq.com/s/hicyXtXlpe-WLesPME4nsQ

必须使用真实链接。

不要修改URL。

---

# 21. WRITING DISPLAY

文字作品可以显示：

标题
平台
简介
链接

用户点击：

打开真实微信公众号文章。

优先：

新标签页

避免直接破坏Studio状态。

---

# 22. VISUAL DESIGN

视觉类设计目前包含：

2个易拉宝作品。

真实链接：

https://khsj.cn/6wtK5lxy1mulb4b

https://khsj.cn/a8gso10fijzs0xu

必须保留真实URL。

不要伪造其他作品。

---

# 23. VISUAL DESIGN DISPLAY

视觉作品可以显示：

项目名称
类型
简介
链接

如果链接是在线作品：

提供：

View Work

按钮。

---

# 24. WORKS DATA MODEL

推荐统一：

{
  id,
  category,
  title,
  description,
  image,
  url,
  year,
  status
}

category：

photography
video
writing
visual

---

# 25. STATUS

允许：

published
placeholder
coming-soon

例如：

{
  status: "placeholder"
}

UI显示：

COMING SOON

或者：

链接待补充

---

# 26. DO NOT INVENT

如果没有：

图片
标题
视频URL
作品描述

不要自行编造具体事实。

可以使用：

作品 01

或者：

图片待补充。

---

# 27. GALLERY UI

Gallery应该保持Studio风格。

不要做成：

电商商品详情页。

不要：

大面积白色网页。

不要：

后台管理界面。

建议：

warm paper
subtle grain
thin rule
editorial typography

---

# 28. GALLERY LAYOUT

Desktop：

左侧：

作品图片

右侧：

作品信息

例如：

07 / 13

PHOTOGRAPHY

作品标题

简短描述

年份

---

# 29. MOBILE GALLERY

Mobile：

图片在上

信息在下

左右按钮固定在图片区域两侧。

关闭按钮在右上角。

---

# 30. IMAGE LOADING

图片加载：

必须有：

loading state

不要因为图片加载失败出现：

白屏
Layout shift
巨大Broken Image

可以显示：

Image unavailable

---

# 31. IMAGE ERROR

如果图片加载失败：

不要无限retry。

显示：

作品图片暂不可用

但Gallery仍然可以：

Previous
Next
Close

---

# 32. GALLERY INDEX

始终显示：

01 / 13
02 / 13
...

使用两位数字。

例如：

01
02
03

保持：

editorial

---

# 33. KEYBOARD

Gallery打开：

ArrowLeft
→ Previous

ArrowRight
→ Next

ESC
→ Close

不要让：

Space
→ 随意改变页面。

---

# 34. TOUCH

移动端：

支持Swipe。

向左Swipe：

Next

向右Swipe：

Previous

不要要求用户精确点击小按钮。

---

# 35. PHOTO FRAME HOVER

PhotoFrame Hover：

可以：

轻微scale
轻微raise
轻微shadow

不要：

旋转90°
大幅漂浮
发出强光

---

# 36. PHOTO OPEN

点击PhotoFrame：

相机可以：

轻微靠近

然后Gallery打开。

Gallery不要：

覆盖整个三维世界。

保留部分Studio视觉。

---

# 37. GALLERY CLOSE

关闭：

Gallery fade out

Camera：

smooth return

回到用户打开照片之前的位置。

不要：

回到默认Camera。

---

# 38. PRESERVE READING POSITION

如果用户：

从Main View
→ Photo07
→ Gallery
→ Next
→ Photo08
→ Close

关闭以后：

回到进入Gallery之前的场景位置。

不要：

强制回到PhotoWall中心。

---

# 39. WORKS QUICK VIEW

Quick View中的Works：

可以用列表：

Photography
13 works

Video
4 works

Writing
2 works

Visual
2 works

点击：

Photography
→ 打开Photo Gallery

其他：

打开对应分类。

---

# 40. QUICK VIEW ≠ REPLACE STUDIO

Quick View只是：

快速入口。

不能删除：

3D PhotoWall
Camera
Phone
Computer

---

# 41. PHOTO WALL DATA

PhotoWall必须从data生成。

例如：

photos.map(photo => ...)

不要手写13个几乎一样的组件。

但是：

每个实例必须有独立ID。

---

# 42. INTERACTION SEPARATION

Gallery负责：

作品内容。

Interaction Skill负责：

点击
Hover
Camera
ESC
Overlay

两个系统不要互相重复实现。

---

# 43. CAMERA SEPARATION

Gallery不要自己创建新的Camera。

必须调用：

existing Camera Director

例如：

focusObject("photo-07")

不要：

在Gallery组件里直接操作：

camera.position

---

# 44. URL SAFETY

外部作品链接：

使用真实用户提供的URL。

不要：

自动修改URL。

不要：

替换成假链接。

不要：

生成不存在的作品页面。

---

# 45. EXTERNAL LINKS

微信公众号：

target="_blank"

rel="noopener noreferrer"

在线易拉宝：

同样可以：

target="_blank"

---

# 46. WORK CATEGORY LABELS

建议：

PHOTOGRAPHY
VIDEO
WRITING
VISUAL DESIGN

中文：

摄影作品
影视作品
文字作品
视觉类设计

可以根据UI空间选择。

---

# 47. EDITORIAL STYLE

作品详情字体：

标题：

serif / editorial

正文：

clean sans-serif

Metadata：

small uppercase

例如：

PHOTOGRAPHY
07 / 13
2026

不要：

所有文字都超大。

---

# 48. VISUAL HIERARCHY

作品图片：

第一视觉。

作品标题：

第二视觉。

描述：

第三视觉。

Metadata：

第四视觉。

按钮：

克制。

---

# 49. NO EXCESSIVE CARDS

不要把每一个作品包装成：

巨大圆角Card。

工作室应该像：

真实的Portfolio Archive。

可以使用：

纸张
标签
细线
编号
照片边框

---

# 50. REAL PHOTO FEEL

照片展示可以保留：

细边框
纸张边缘
轻微shadow
轻微texture

让它看起来像：

真实挂在墙上的照片。

---

# 51. PHOTO FRAME MATERIAL

3D相框：

warm wood

颜色：

不要过于饱和。

优先：

oak
walnut
dark wood

根据Studio整体材质统一。

---

# 52. PHOTO WALL LIGHTING

摄影墙：

不要使用强烈Spotlight。

使用：

ambient warm light

保持：

照片可见
阴影柔和
空间有层次

---

# 53. PHOTO WALL PERFORMANCE

不要为每张照片加载超大原图。

建议：

缩略图：

适合Texture尺寸

Gallery：

需要时加载更高清版本。

---

# 54. LAZY LOADING

如果作品图片较多：

优先lazy load。

不要进入Entry页面就加载全部高清作品。

---

# 55. FUTURE EXTENSION

未来可以增加：

Photography
→ tags

例如：

portrait
urban
landscape
experiment

但当前不要为了“系统完整”而增加复杂筛选。

---

# 56. NO FILTER BY DEFAULT

Studio的核心是：

发现。

所以默认：

不要显示复杂Filter Bar。

不要：

Photography / Video / Writing / Visual
四个巨大按钮占满页面。

---

# 57. CONTENT OVERLAY WIDTH

Desktop Gallery：

建议：

520px ~ 760px

不要：

全屏覆盖。

如果照片需要更大：

可以动态扩大图片区域。

---

# 58. Z-INDEX

Gallery必须位于：

DOM UI层

高于：

3D Canvas

但低于：

系统级错误提示。

避免：

z-index无限堆叠。

---

# 59. SCROLL

如果作品描述很长：

Gallery内容区域可以独立scroll。

但是：

不要让整个页面跟着滚动。

Studio背景应该保持稳定。

---

# 60. BODY SCROLL LOCK

Gallery打开时：

锁定：

document body scroll

避免：

用户滚动页面导致：

Studio页面整体移动。

---

# 61. CLOSE BUTTON

Close：

必须清晰。

但不要做成：

巨大红色X。

建议：

×
CLOSE

细小。

---

# 62. PREV / NEXT

按钮：

可以是：

←
→

或者：

PREV
NEXT

如果使用图标：

必须保证移动端容易点击。

---

# 63. NO AUTOPLAY SLIDESHOW

摄影Gallery默认：

不自动播放。

用户自己：

Next
Previous
Swipe

---

# 64. CONTENT ACCURACY

目前作品信息必须遵守：

真实数据优先。

如果没有数据：

placeholder。

不允许：

为了让网站看起来完整而编造：

项目名称
获奖
客户
拍摄地点
发布日期
播放量
浏览量

---

# 65. VALIDATION

完成Works Gallery后：

必须检查：

[ ] 13个PhotoFrame存在
[ ] 每个PhotoFrame有独立ID
[ ] 每个PhotoFrame可单独点击
[ ] 点击Photo07打开Photo07
[ ] Previous正常
[ ] Next正常
[ ] ArrowLeft正常
[ ] ArrowRight正常
[ ] ESC正常
[ ] Swipe正常
[ ] Gallery关闭正常
[ ] Camera返回正常
[ ] Shelf不能触发Gallery
[ ] Bookcase不能触发Gallery
[ ] Writing链接正确
[ ] Visual Design链接正确
[ ] Video没有伪造链接
[ ] 缺失图片有placeholder
[ ] 图片失败不会白屏
[ ] Desktop正常
[ ] Mobile正常

---

# 66. BUILD CHECK

完成修改后运行：

npm run typecheck

npm run lint

npm run build

三个都必须通过。

---

# 67. FINAL EXPERIENCE

最终用户体验应该是：

进入Studio

↓

看到13张照片

↓

某一张照片轻微Hover

↓

点击

↓

Camera慢慢靠近

↓

Gallery打开

↓

07 / 13

↓

用户按右箭头

↓

08 / 13

↓

继续浏览

↓

ESC

↓

回到Studio

↓

继续探索其他物体

这就是：

MY LITTLE STUDIO

的作品浏览方式。

END OF SKILL