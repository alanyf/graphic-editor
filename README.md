# 图形编辑器（Graphic Editor）

## 项目介绍

一个功能强大的类似PPT的图形编辑器，基于React和SVG技术栈开发，支持丰富的图形元素、编辑操作和多媒体内容。

**Demo体验链接：**[图形编辑器在线Demo](https://graphic-editor.netlify.app)

更多介绍见掘金文章：[https://juejin.cn/post/7210539669204566077](https://juejin.cn/post/7210539669204566077)

![截图](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a1d024b336344b59ddbe9903166ba14~tplv-k3u1fbpfcp-watermark.image)

## 核心功能

### 1. 丰富的图形元素
- **基础图形**：矩形、圆形、三角形、菱形、平行四边形、椭圆等
- **线条工具**：直线、曲线、多段线、弧线、连接线等
- **文本编辑**：普通文本和富文本编辑功能
- **多媒体支持**：图片、音频、视频嵌入
- **特殊形状**：立方体、圆柱体、扇形、多边形等
- **实用工具**：坐标系、二维码生成、绘制板等

### 2. 强大的编辑功能
- **图形操作**：移动、旋转、缩放、对齐
- **锚点编辑**：通过锚点精确调整图形形状
- **连接功能**：图形间连接线和连接桩
- **分组操作**：图形组合和解组
- **网格和吸附**：辅助对齐功能，支持点网格和线网格
- **对齐辅助线**：智能吸附和对齐提示

### 3. 用户体验特性
- **响应式设计**：支持不同屏幕尺寸和比例（16:9、4:3、1:1）
- **背景定制**：自定义画布背景
- **编辑模式切换**：可切换编辑和查看模式
- **全屏支持**：一键全屏编辑
- **历史记录**：支持操作撤销/重做
- **快捷键支持**：键盘操作优化工作流

### 4. 架构特点
- **组件化设计**：基于React组件系统
- **SVG渲染**：高性能矢量图形渲染
- **插件扩展**：可扩展的精灵（Sprite）系统
- **模块化架构**：清晰的代码组织结构

## 技术栈

- **前端框架**：React
- **构建工具**：Modern.js
- **样式方案**：CSS/SCSS
- **渲染技术**：SVG
- **代码规范**：ESLint, Prettier
- **版本控制**：Git


## 【图形编辑器】系列掘金文章汇总
1. [svg实现图形编辑器系列一：精灵系统](https://juejin.cn/post/7210539669204566077)
2. [svg实现图形编辑器系列二：精灵的开发和注册](https://juejin.cn/post/7211284290067513400)
3. [svg实现图形编辑器系列三：移动、缩放、旋转](https://juejin.cn/post/7212290641485545531)
4. [svg实现图形编辑器系列四：吸附&辅助线](https://juejin.cn/post/7212637065753264189)
5. [svg实现图形编辑器系列五：辅助编辑锚点](https://juejin.cn/post/7213016298250043448)
6. [svg实现图形编辑器系列六：链接线、连接桩](https://juejin.cn/post/7213379884692684860)
7. [svg实现图形编辑器系列七：右键菜单、快捷键、撤销回退](https://juejin.cn/post/7213757571960799291)
8. [svg实现图形编辑器系列八：多选、组合、解组](https://juejin.cn/post/7214901105976868901)
9. [svg实现图形编辑器系列九：精灵的编辑态&开发常用精灵](https://juejin.cn/post/7215620087825481784)
10. [svg实现图形编辑器系列十：工具栏&配置面板（最终篇）](https://juejin.cn/post/7216340356950442044)


## 快速开始

### 环境要求

- Node.js >= 16.x
- pnpm >= 7.x 或 yarn

### 安装和运行

```bash
# 安装依赖
pnpm install
# 或
yarn install

# 开发模式
pnpm dev
# 或
yarn dev

# 构建生产版本
pnpm build
# 或
yarn build

# 预览生产版本
pnpm preview
# 或
yarn preview
```

## 项目结构

- **src/routes/**: 路由组件
- **src/pages/**: 页面组件，包含编辑器主界面
- **src/packages/lego/**: 核心组件库
  - **lego-stage/**: 编辑器主舞台
  - **sprites/**: 各类图形元素
  - **interface/**: 类型定义
  - **material/**: 材质和样式
  - **lego-tools/**: 工具函数
- **public/**: 静态资源
- **modern.config.ts**: 项目配置



## Setup

Install the dependencies:

```bash
pnpm install
```

## Get Started

Start the dev server:

```bash
pnpm dev
```

Enable optional features or add a new entry:

```bash
pnpm new
```

Build the app for production:

```bash
pnpm build
```

Preview the production build locally:

```bash
pnpm serve
```

For more information, see the [Modern.js documentation](https://modernjs.dev/en).
