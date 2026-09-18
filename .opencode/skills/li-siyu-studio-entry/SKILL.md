---
name: li-siyu-studio-entry
description: LI SIYU MY LITTLE STUDIO 的 Entry 首页执行规范。只负责入口页面、拱门、Mailbox、联系方式弹窗和进入 Studio 的交互，不修改 Studio 房间内部。
---

# LI SIYU — MY LITTLE STUDIO
# ENTRY PAGE SKILL

## 1. 本 Skill 的职责

本 Skill 只负责网站进入 Studio 之前的 Entry 页面。

只允许修改与以下内容直接相关的代码：

- Entry 页面
- Entry 背景
- LI SIYU 品牌
- MY LITTLE STUDIO 标题
- 拱形木门
- Mailbox
- 联系方式 Modal
- Enter Studio
- 进入 Studio 的状态切换
- Entry 页面响应式布局

不要修改 Studio 房间内部。

---

# 2. 最高优先级规则

当前项目已经存在 Studio Experience。

Entry 页面应该是：

> 进入房间之前的独立入口空间。

用户首先看到 Entry。

用户点击拱门之后：

> 进入已经存在的 StudioExperience。

不要重新制作 Studio。

不要把 Studio 房间提前渲染到 Entry 页面。

---

# 3. Entry 页面视觉目标

Entry 应该有：

- 安静
- 温暖
- 神秘
- 有一点仪式感
- 创意工作室入口感

关键词：

warm
quiet
inviting
editorial
cozy
slightly mysterious
handcrafted

不要做成：

- 普通网页首页
- SaaS Landing Page
- 后台系统
- 游戏主菜单
- 巨大的按钮页面
- 科技公司官网

Entry 的重点：

> 让用户产生“我要进去看看”的感觉。

---

# 4. Entry 页面构图

页面中央偏中间：

## LI SIYU

以及：

## MY LITTLE STUDIO

下面：

## Arch Door

拱门是视觉中心。

Mailbox：

放在拱门旁边。

Mailbox 不要挡住门。

Mailbox 与门保持明显的空间关系。

---

# 5. Brand

页面必须保留：

LI SIYU

MY LITTLE STUDIO

字体应该：

- editorial
- elegant
- restrained
- slightly cinematic

不要：

- 粗大的游戏字体
- 霓虹字体
- 科技字体
- 过度装饰

标题不要占据整个屏幕。

---

# 6. Arch Door

拱门是 Entry 的主要互动对象。

视觉：

- dark wood
- warm brown
- rounded arch
- subtle wood grain
- slightly recessed frame
- brass handle
- warm interior glow
- subtle shadow

颜色主要参考：

Dark Wood:

#6B4A33

Brass:

#B88A44

Warm Light:

#FFE0B0

---

# 7. Door 的几何细节

拱门不要只是一个简单矩形。

应该有：

- 外框
- 内框
- 拱顶
- 木板
- 木纹方向
- 横向结构细节
- 门把手
- 阴影
- 内部暖光

可以使用 procedural geometry。

不要使用一个 BoxGeometry 就结束。

---

# 8. Door Lighting

门内部可以有：

subtle warm glow。

目标：

看起来像：

> 门后面有一个温暖的工作室。

不要：

- 强烈 Bloom
- 大面积发光
- RGB
- 白色强光
- 巨大光圈

---

# 9. Door Interaction

只有：

> 拱门本身

是进入 Studio 的互动对象。

点击：

Arch Door

执行：

Entry
→ transition
→ StudioExperience

动画：

- fade
- slight scale
- subtle camera/scene transition

不要瞬间硬切。

---

# 10. Door Text 不可互动

如果拱门附近存在：

ENTER STUDIO

或类似文字：

这些文字只是视觉提示。

不要单独建立：

InteractiveObject

不要让文字成为第二个点击目标。

正确：

用户点击门。

而不是：

用户点击文字。

---

# 11. Enter Studio 文字

可以保留：

ENTER STUDIO

或者：

STEP INSIDE

之类的提示。

但是它只是：

> visual affordance

不是独立互动对象。

如果用户点击文字：

不要创建第二套进入逻辑。

所有进入逻辑应该统一到 Door interaction。

---

# 12. Mailbox

Mailbox 是 Entry 页面第二个互动对象。

位置：

> 拱门旁边。

不要放在：

- Studio 房间
- 窗户下面
- 沙发旁
- 工作桌旁

Mailbox 属于 Entry。

---

# 13. Mailbox 视觉

Mailbox 应该像一个真实的小型墙边/门边邮箱。

建议：

- dark wood
- muted metal
- small flag
- mail slot
- subtle shadow
- rounded corners
- warm material

不要：

- 巨大邮箱
- 明亮红色美国邮箱
- 游戏道具箱
- 发光邮箱

---

# 14. Mailbox Hover

Hover 时：

- 轻微浮起
- slight scale
- subtle highlight
- cursor feedback

不要：

- 巨大放大
- 强烈发光
- 红色边框
- 复杂粒子

---

# 15. Mailbox Click

点击 Mailbox：

打开：

> Contact Modal

Modal 从页面中心出现。

动画：

- opacity
- scale
- slight upward motion

保持温暖、克制。

---

# 16. Contact Modal 内容

必须显示：

PHONE

19213397013

EMAIL

3334206878@qq.com

Email 可以点击。

Email 点击后：

使用：

mailto:3334206878@qq.com

---

# 17. Contact Modal 视觉

Modal：

- cream / warm paper
- subtle shadow
- rounded corners
- editorial typography
- subtle grain

建议最大宽度：

约 420–520px。

不要：

- 全屏黑色弹窗
- 巨型后台卡片
- 巨大按钮
- 复杂表单

这个 Modal 应该像：

> 一张从邮箱里取出来的小纸条。

---

# 18. Contact Modal 关闭

必须支持：

- X 按钮
- Esc
- 点击明确的关闭区域

关闭后：

> 返回 Entry。

不要进入 Studio。

---

# 19. Entry Interaction 数量

Entry 页面只保留两个主要互动对象：

1. Arch Door
2. Mailbox

其他：

- 标题
- 副标题
- ENTER STUDIO 文字
- 装饰
- 背景
- 植物
- 阴影

都不是 Interaction。

---

# 20. Door 与 Mailbox 的空间关系

不要把 Mailbox 和门完全重叠。

推荐：

Door：

视觉中心

Mailbox：

Door 左侧或右侧稍微偏下。

两者之间留出：

> 明显可见的空隙。

用户第一眼应该能理解：

“这是门，这是邮箱。”

---

# 21. Entry 装饰

允许有少量：

- plant
- floor shadow
- wall texture
- tiny dust/light
- subtle paper grain

但是不要堆装饰。

Entry 应该比 Studio 更简洁。

因为：

> Entry 是序章。

Studio 才是主要内容。

---

# 22. Responsive

桌面：

保持中央构图。

平板：

缩小 Door。

手机：

Door 保持明显可点击。

Mailbox：

不能被裁掉。

Contact Modal：

最大宽度不能超过 viewport。

不要产生：

- 横向滚动
- 门被截断
- Mailbox 跑出屏幕
- Modal 超出屏幕

---

# 23. Accessibility

互动对象应该有：

- cursor feedback
- keyboard support where practical
- clear focus
- readable labels

Esc：

关闭 Modal。

如果当前没有 Modal：

不要做其他奇怪行为。

---

# 24. 状态管理

Entry 进入 Studio 的状态必须复用当前项目已有的状态管理方式。

不要为了 Entry：

> 新建一套完全独立的 Router / Store。

如果项目已经存在：

StudioExperience

优先调用现有入口。

---

# 25. 不允许破坏 Studio

执行 Entry Skill 时：

绝对不要修改：

- StudioScene
- CameraRig
- CameraDirector
- StudioObjects
- PhotoWall
- DeskStation
- CameraStation
- TVCorner
- bookshelf
- window
- room geometry

除非为了删除 Entry 页面与 Studio 之间已经不存在的旧引用。

---

# 26. TV 规则

TV Screen 已经被项目设计决定删除。

Entry Skill 不得重新添加 TV。

不要因为发现旧：

TVCorner.tsx

就把 TV 重新放回 Entry。

TV 属于 Studio 内部的旧设计。

Entry 不需要 TV。

---

# 27. 代码修改原则

开始工作前：

1. 检查当前 Entry 实现。
2. 找到现有 LoadingScreen / Entry 相关组件。
3. 找到进入 Studio 的现有逻辑。
4. 尽量修改已有组件。
5. 不要重复创建入口系统。
6. 不要破坏 StudioExperience。

---

# 28. 如果当前 Entry 已经实现

当前项目已经有 Entry。

因此：

> 不要从零重写。

应该：

1. 查看当前实现。
2. 保留已有视觉。
3. 增加 Mailbox。
4. 确认 Door 是唯一进入 Studio 的对象。
5. 确认文字不可单独互动。
6. 增加 Contact Modal。
7. 修正响应式。
8. 保留已有 transition。

---

# 29. 验收标准

完成后必须满足：

### Entry

- [ ] 页面可以正常打开
- [ ] LI SIYU 正常显示
- [ ] MY LITTLE STUDIO 正常显示
- [ ] 拱门明显
- [ ] Mailbox 明显
- [ ] Door 可点击
- [ ] Mailbox 可点击

### Door

- [ ] 点击 Door 进入 Studio
- [ ] 文字不是独立 Interaction
- [ ] 没有第二套进入逻辑

### Mailbox

- [ ] 点击打开 Modal
- [ ] Modal 居中
- [ ] 电话正确
- [ ] 邮箱正确
- [ ] 邮箱支持 mailto
- [ ] Esc 可以关闭
- [ ] 关闭后仍停留在 Entry

### Studio

- [ ] 进入后原有 Studio 正常
- [ ] Camera 正常
- [ ] 3D 场景正常
- [ ] 不出现白屏
- [ ] 不出现重复 Studio

---

# 30. Validation

完成后执行项目已有：

- typecheck
- lint
- build

如果项目有：

npm run typecheck
npm run lint
npm run build

则执行。

如果命令不同：

读取 package.json。

不要猜测命令。

---

# 31. 最终报告

完成后必须报告：

## Changed

修改了哪些文件。

## Implemented

Entry 实现了什么。

## Preserved

Studio 哪些功能没有修改。

## Validation

typecheck / lint / build 结果。

## Known Limitations

如果还有：

- placeholder
- asset 问题
- texture 问题
- browser limitation

必须明确写出。

---

# 32. 最重要的一句话

Entry 是：

> The door into LI SIYU's world.

它不是一个普通 Landing Page。

用户应该：

看到门
→ 看到邮箱
→ 产生好奇
→ 点击门
→ 进入工作室

不要把 Entry 做复杂。

真正丰富的内容：

> 留给 Studio。