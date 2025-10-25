# Modern.js App

## 项目介绍

> 一个类似PPT功能的图形编辑器。

**Demo体验链接：**[图形编辑器在线Demo](https://alanyf.gitee.io/monorepo/graphic-editor)

## 一、能力演示


#### 1. 各种图形素材

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a1d024b336344b59ddbe9903166ba14~tplv-k3u1fbpfcp-watermark.image?" alt="demo1" width="100%" />

#### 2. 拖拽添加图形，编辑样式，移动，缩放，旋转

> 支持移动，缩放，旋转三种基础的编辑操作，且解决了在旋转一定角度的情况下缩放时的位置偏移问题

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/750957817f4048938c00177cafca64c9~tplv-k3u1fbpfcp-watermark.image?" alt="demo1.gif" width="100%" />

#### 3. 图形靠近对齐吸附

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/90d84784e00f4bf8b3a9b7d087f20aa1~tplv-k3u1fbpfcp-watermark.image?" alt="demo2.gif" width="100%" />

#### 4. 连接线


<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c2abc6821e7d4117afe1360a25deff58~tplv-k3u1fbpfcp-watermark.image?" alt="demo4.gif" width="100%" />

#### 5. 一些复杂的形状


<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9beecada97b643fa82ed6e7b041e0a90~tplv-k3u1fbpfcp-watermark.image?" alt="demo5.gif" width="100%" />

#### 6. 模版样例展示


<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ca6252f06244c0f9c7484bc309499ff~tplv-k3u1fbpfcp-watermark.image?" alt="demo6.gif" width="100%" />


## 二、介绍

### 1. 舞台

`舞台(Stage)` 表示舞台画布，它可以包含多个精灵组件，从而实现多个精灵的同时显示和编辑。

在舞台中，我们可以监听鼠标事件、键盘事件等用户输入，从而实现拖拽、旋转、缩放等交互操作。



### 2. 精灵

`精灵(Sprite)` 是指可以在画布上拖拽、旋转、缩放、改变颜色等操作的可视化对象。(精灵在舞台上欢快的跳跃)

这些可视化对象可以是基本的几何形状，比如矩形、圆形、多边形等，也可以是复杂的图形，比如图标、标志、文字、图片等。

在图形编辑器中，精灵系统通常是一个重要的组成部分，它允许用户通过拖拽等操作，快速地创建、修改和组合不同的精灵，从而创建出复杂的图形。



## 三、实现一个舞台和精灵的Demo

在下面的例子里我们用一个简单的demo演示精灵系统：
1. 使用 `svg` 实现了一个非常简单的`舞台`;
2. 使用 `g` 标签实现 `精灵` 组件，它负责 `定位`，使用 transform="translate(x, y)" 实现;
3. 使用 `rect` 标签实现矩形，它不用关心自己所在的位置，只需关心大小和样式即可;
4. 使用 `line` 标签实现矩形，它不用关心自己所在的位置，只需关心起始点和样式即可;


#### 1. Demo
```ts

// Demo
import { Stage } from "./stage";
import { Sprite } from "./sprite";
import { RectSprite } from "./sprites/rect";
import { LineSprite } from "./sprites/line";

export const StageDemo = ({ width, height }) => {
  return (
    <Stage width={width} height={height}>
      {/* 矩形精灵 */}
      <Sprite x={200} y={50}>
        <RectSprite width={400} height={240}></RectSprite>
      </Sprite>
      {/* 线段精灵 */}
      <Sprite x={100} y={350}>
        <LineSprite x1={0} y1={0} x2={300} y2={100}></LineSprite>
      </Sprite>
    </Stage>
  );
};


```

#### 2. 效果图

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/778706f5605f4799825ada1e60cce595~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="100%" />



#### 3. 舞台
```ts
// 舞台
export const Stage = ({ width, height, children }) => {
  return (
    <svg
      className="stage-container"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      style={{
        width,
        height,
        outline: "1px solid #ddd"
      }}
    >
      {children}
    </svg>
  );
};

```


#### 4. 精灵
```ts
// 精灵
export const Sprite = ({ x, y, children }) => {
  return (
    <g className="sprite-container" transform={`translate(${x}, ${y})`}>
      {children}
    </g>
  );
};
```

#### 5. 矩形精灵
```ts

// 矩形精灵
export const RectSprite = ({ width, height }) => {
  return (
    <rect
      x="0"
      y="0"
      width={width}
      height={height}
      fill="#f2e7ff"
      stroke="#a245ff"
      stroke-width="3"
    ></rect>
  );
};

```

#### 6. 线段精灵
```ts

// 线段精灵
export const LineSprite = ({ x1, y1, x2, y2 }) => {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#ffa245" stroke-width="3" />
  );
};

```


## 总结 & 规划

本文介绍了借助 `舞台` 和 `精灵`的概念实现了一个非常简单但是非常具有代表性的`图形编辑器` ，这就是图形编辑器的骨架，未来我们会在此基础上进行能力补充，不断丰富图形编辑器的能力，例如：

1. 精灵物料的规范（如何自定义开发精灵）
2. 使用依赖反转思想，精灵与舞台解耦，实现精灵注册机制
3. 通过拖拽实现 `移动` `缩放` `旋转`
4. 拖拽加入，定制精灵加入舞台时的特殊交互，如多边形
5. 锚点（用来缩放）
6. 端口（用来连线）
7. 设置边框、填充等样式的工具栏
8. 精灵之间靠近吸附、辅助线等
9. 舞台网格吸附
10. 其他能力...

### 系列文章汇总

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


## 🔥 demo演示源码

最后应大家要求，这里放上code sandbox的demo代码:
- [codesandbox Demo：src/demos/demo-stage/index.tsx](https://codesandbox.io/s/editor-example-yqp8ce?file=/src/demos/demo-stage/index.tsx)

<img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cce20b4df0d24f37aa611ee6c33e789a~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="100%" />


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
