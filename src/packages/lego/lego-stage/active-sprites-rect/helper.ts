import type { Point, Line } from '@packages/geometry-tools';
import {
  distance,
  lineRadian,
  angleToRadian,
  rotate,
  startEndPointToLine,
  verticalLinePoint,
} from '@packages/geometry-tools';
import type {
  ISprite,
  ISize,
  ISizeCoordinate,
  IAdsorbLine,
  ICoordinate,
} from '../../interface';

/**
 * 吸附距离
 */
const ABSORB_DIS = 4;

export const getIncreaseSize = (
  initMousePos: Point,
  mousePoint: Point,
  angle = 0,
) => {
  const dis = distance(initMousePos, mousePoint);
  const radian = angleToRadian(angle);
  const includedRadian = lineRadian(initMousePos, mousePoint) - radian;
  const addDis = dis * Math.cos(includedRadian);
  return {
    width: addDis,
    height: dis * Math.sin(includedRadian),
  };
};

export const handleEqualRatio = ({
  pos,
  angle,
  mousePoint,
  initPos,
  initSize,
  initMousePos,
  shiftPressed,
}: any) => {
  if (!shiftPressed) {
    return mousePoint;
  }
  const increaseAngle = (pos.includes('left') ? 180 : 0) + angle;
  const { width } = getIncreaseSize(initMousePos, mousePoint, increaseAngle);
  const initCenter = {
    x: initPos.x + initSize.width / 2,
    y: initPos.y + initSize.height / 2,
  };
  const increaseHeight = (initSize.height * width) / initSize.width;
  const x = initPos.x + initSize.width + width;
  const y = initPos.y + initSize.height - increaseHeight;
  // const x = initMousePos.x + width;
  // const y = initMousePos.y + height;
  const realPoint = rotate({ x, y }, angle, initCenter);
  return realPoint;
};

/**
 * 处理高宽相同时的吸附
 * @param info 高宽坐标
 * @param initSize 初始尺寸
 * @param pos 移动位置
 * @returns 新的高宽坐标
 */
export const handleEqualSizeAdsorb = (
  info: ISizeCoordinate,
  initSize: ISize,
  pos: string,
) => {
  let { width, height, x, y } = info;
  // 高宽相等时的吸附
  const differ = Math.abs(initSize.width + width - initSize.height - height);
  if (Math.abs(width) !== 0 && differ < ABSORB_DIS) {
    width = initSize.height + height - initSize.width;
    x = pos.includes('left') ? -width : x;
  } else if (Math.abs(height) !== 0 && differ < ABSORB_DIS) {
    height = initSize.width + width - initSize.height;
    y = pos.includes('top') ? -height : y;
  }
  return { width, height, x, y } as ISizeCoordinate;
};

const getReversePos = (pos: string, reverse: boolean) => {
  const map = {
    'left': 'right',
    'right': 'left',
    'top': 'bottom',
    'bottom': 'top',
    '': '',
  };
  return reverse ? map[pos] : pos;
};

/**
 * 处理来自8个方向上的size变动
 * @param param
 * @returns
 */
export const handlePositionResize = ({
  pos,
  angle,
  mousePoint,
  initPos,
  initSize,
  initMousePos,
  info,
  resizeLock,
}: // logPoints,
any) => {
  // eslint-disable-next-line
  let { width, height, x, y } = info; // eslint-disable-line
  let offsetPoint: Point = { x: 0, y: 0 };
  const initCenter = {
    x: initPos.x + initSize.width / 2,
    y: initPos.y + initSize.height / 2,
  };
  // 宽高方向上各自是否发生了反转，如右侧边的锚点是否拖拽到了矩形的左边
  // 把鼠标点转换到未旋转的坐标系下，方便判断是否翻转
  const originMousePoint = rotate(mousePoint, -angle, initCenter);
  // 计算偏移量
  const getOffsetPoint = (width = 0, height = 0, angle = 0) => {
    const newCenter = {
      x: initPos.x + (width + initSize.width) / 2,
      y: initPos.y + (height + initSize.height) / 2,
    };
    const p1 = rotate(initPos, angle, initCenter);
    const p2 = rotate(initPos, angle, newCenter);
    const offsetPoint = {
      x: p2.x - p1.x,
      y: p2.y - p1.y,
    };
    return offsetPoint;
  };
  // 代码节俭，但可读性较差
  const hasLeft = pos.includes('left');
  const hasRight = pos.includes('right');
  const hasTop = pos.includes('top');
  const hasBottom = pos.includes('bottom');
  const reverseX = hasLeft
    ? originMousePoint.x > initPos.x + initSize.width
    : originMousePoint.x < initPos.x;
  const reverseY = hasTop
    ? originMousePoint.y > initPos.y + initSize.height
    : originMousePoint.y < initPos.y;
  let realResizePos = '';
  const posSplit = pos.split('-') as any;
  // 按住shift等比缩放
  if (resizeLock) {
    // 当鼠标移动到相反方向，原始点（中点和鼠标按下的锚点）应该变化的相对距离
    const movePos = {
      x: reverseX ? (hasLeft ? 1 : -1) * initSize.width : 0,
      y: reverseY ? (hasTop ? 1 : -1) * initSize.height : 0,
    };
    // 计算中心点点的位置
    const originCenter = {
      x: initPos.x + initSize.width / 2 + movePos.x,
      y: initPos.y + initSize.height / 2 + movePos.y,
    };
    const centerPoint = rotate(originCenter, angle, initCenter);
    // 下面计算锚点的位置
    const originInitMousePoint = rotate(initMousePos, -angle, initCenter);
    const originPortPoint = {
      x: originInitMousePoint.x + movePos.x * 2,
      y: originInitMousePoint.y + movePos.y * 2,
    };
    const portPoint = rotate(originPortPoint, angle, initCenter);
    const line = startEndPointToLine(centerPoint, portPoint);
    // 核心代码：计算过鼠标点到中心点与锚点组成直线的垂线的交点，即是等比缩放的场景下，鼠标应该在的位置
    const expectMousePoint = verticalLinePoint(line, mousePoint);
    // eslint-disable-next-line no-param-reassign
    mousePoint = expectMousePoint;
  }
  const offsetAngle = angle * (hasLeft ? -1 : 1) * (hasTop ? -1 : 1);
  if (hasLeft || hasRight) {
    width = getIncreaseSize(
      initMousePos,
      mousePoint,
      angle + (hasLeft ? 180 : 0),
    ).width;
    realResizePos = getReversePos(posSplit.shift(), reverseX);
  }
  if (hasTop || hasBottom) {
    height = getIncreaseSize(
      initMousePos,
      mousePoint,
      angle + (hasTop ? 180 : 0),
    ).height;
    if (realResizePos) {
      realResizePos += '-';
    }
    realResizePos += getReversePos(posSplit.pop(), reverseY);
  }
  offsetPoint = getOffsetPoint(width, height, offsetAngle);
  x = -offsetPoint.x;
  y = -offsetPoint.y;
  if (hasRight) {
    x = -offsetPoint.x + (reverseX ? initSize.width + width : 0);
  }
  if (hasLeft) {
    x = offsetPoint.x + (reverseX ? initSize.width : -width);
  }
  if (hasBottom) {
    y = -offsetPoint.y + (reverseY ? initSize.height + height : 0);
  }
  if (hasTop) {
    y = offsetPoint.y + (reverseY ? initSize.height : -height);
  }
  return {
    rect: { width, height, x, y } as ISizeCoordinate,
    realResizePos,
    reverseX,
    reverseY,
  };
};

/**
 * 计算选中所有精灵的矩形区域
 * @param activeSpriteList 精灵列表
 * @param registerSpriteMetaMap 注册的精灵映射
 * @returns
 */
export const getActiveSpriteRect = (activeSpriteList: ISprite[]) => {
  const posMap = {
    minX: Infinity,
    minY: Infinity,
    maxX: 0,
    maxY: 0,
  };
  activeSpriteList.forEach((sprite: ISprite) => {
    const { size, coordinate } = sprite.attrs;
    const { width = 0, height = 0 } = size;
    const { x = 0, y = 0 } = coordinate;
    if (x < posMap.minX) {
      posMap.minX = x;
    }
    if (y < posMap.minY) {
      posMap.minY = y;
    }
    if (x + width > posMap.maxX) {
      posMap.maxX = x + width;
    }
    if (y + height > posMap.maxY) {
      posMap.maxY = y + height;
    }
  });
  return {
    width: posMap.maxX - posMap.minX,
    height: posMap.maxY - posMap.minY,
    x: posMap.minX,
    y: posMap.minY,
  } as ISizeCoordinate;
};

/**
 * 计算精灵之间靠近时的对其辅助线
 * @param info 选中矩形区域
 * @param spriteList 未选中的精灵列表
 * @param activeSpriteList 选中的精灵
 * @returns 辅助线数组和吸附定位
 */
export const getAuxiliaryLine1 = (
  adsorbLine: IAdsorbLine,
  info: ISizeCoordinate,
  spriteList: ISprite[],
  stageSize: ISize,
) => {
  const rectLeft = info.x;
  const rectRight = info.x + info.width;
  const rectTop = info.y;
  const rectBottom = info.y + info.height;
  const rectCenterX = (rectLeft + rectRight) / 2;
  const rectCenterY = (rectTop + rectBottom) / 2;

  const dis = adsorbLine.distance || 5;
  const xLines: Line[] = [];
  const yLines: Line[] = [];
  // 判断接近
  const closeTo = (a: number, b: number, d = dis) => Math.abs(a - b) < d;
  // 收集辅助线
  const addLineX = (x1: number, x2: number, y: number) =>
    xLines.push({ x1, y1: y, x2, y2: y });
  const addLineY = (y1: number, y2: number, x: number) =>
    yLines.push({ x1: x, y1, x2: x, y2 });
  // 移除距离太近的线
  const removeRepeatLine = () => {
    const newXLine: Line[] = [];
    const newYLine: Line[] = [];
    xLines.forEach((line: Line) => {
      for (let i = 0; i < newXLine.length; i += 1) {
        if (closeTo(line.y1, newXLine[i].y1, 3)) {
          return;
        }
      }
      newXLine.push(line);
    });
    yLines.forEach((line: Line) => {
      for (let i = 0; i < newYLine.length; i += 1) {
        if (closeTo(line.x1, newYLine[i].x1, 3)) {
          return;
        }
      }
      newYLine.push(line);
    });
    return [...newXLine, ...newYLine];
  };
  // 增加一个和舞台同样大小的虚拟精灵，用来和舞台对齐
  const stageBackgroundSprite: any = {
    attrs: {
      size: { ...stageSize },
      coordinate: { x: 0, y: 0 },
    },
  };
  spriteList.push(stageBackgroundSprite);
  let dx = 0;
  let dy = 0;
  // eslint-disable-next-line no-restricted-syntax
  for (const sprite of spriteList) {
    const { size, coordinate } = sprite.attrs;

    const left = coordinate.x;
    const right = coordinate.x + size.width;
    const top = coordinate.y;
    const bottom = coordinate.y + size.height;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    const minX = Math.min(left, rectLeft);
    const maxX = Math.max(right, rectRight);
    const minY = Math.min(top, rectTop);
    const maxY = Math.max(bottom, rectBottom);

    const array = [
      { pos: 'x', source: rectLeft, target: left },
      { pos: 'x', source: rectLeft, target: centerX },
      { pos: 'x', source: rectLeft, target: right },

      { pos: 'x', source: rectCenterX, target: left },
      { pos: 'x', source: rectCenterX, target: centerX },
      { pos: 'x', source: rectCenterX, target: right },

      { pos: 'x', source: rectRight, target: left },
      { pos: 'x', source: rectRight, target: centerX },
      { pos: 'x', source: rectRight, target: right },

      { pos: 'y', source: rectTop, target: top },
      { pos: 'y', source: rectTop, target: centerY },
      { pos: 'y', source: rectTop, target: bottom },

      { pos: 'y', source: rectCenterY, target: top },
      { pos: 'y', source: rectCenterY, target: centerY },
      { pos: 'y', source: rectCenterY, target: bottom },

      { pos: 'y', source: rectBottom, target: top },
      { pos: 'y', source: rectBottom, target: centerY },
      { pos: 'y', source: rectBottom, target: bottom },
    ];
    // eslint-disable-next-line @typescript-eslint/no-loop-func
    array.forEach((e: any) => {
      if (closeTo(e.source, e.target)) {
        if (e.pos === 'x') {
          dx = e.target - e.source;
          addLineY(minY, maxY, e.target);
        } else {
          dy = e.target - e.source;
          addLineX(minX, maxX, e.target);
        }
      }
    });
  }
  return {
    lines: removeRepeatLine(),
    dx,
    dy,
  };
};

/**
 * 计算元素之间靠近时的对其辅助线，以及吸附的修正距离
 * @param rect 选中矩形区域
 * @param spriteList 未选中的与元素列表
 * @param activeSpriteList 选中的元素
 * @returns 辅助线数组和吸附定位
 */
export const getAuxiliaryLine = (
  adsorbLine: IAdsorbLine,
  spriteRect: ISizeCoordinate,
  infoList: ISizeCoordinate[],
  canvasSize: ISize,
  adsorbCanvas = false,
  realResizePos = '',
) => {
  // 正在拖拽中的矩形的各个边信息
  const rectLeft = spriteRect.x;
  const rectRight = spriteRect.x + spriteRect.width;
  const rectTop = spriteRect.y;
  const rectBottom = spriteRect.y + spriteRect.height;
  const rectCenterX = (rectLeft + rectRight) / 2;
  const rectCenterY = (rectTop + rectBottom) / 2;
  const dis = adsorbLine.distance || 5;
  // 判断接近
  const closeTo = (a: number, b: number, d = dis) => Math.abs(a - b) < d;
  const rectList = [...infoList];
  // 增加一个和舞台同样大小的虚拟元素，用来和舞台对齐
  if (adsorbCanvas) {
    const canvasBackground: ISizeCoordinate = { x: 0, y: 0, ...canvasSize };
    rectList.push(canvasBackground);
  }
  let dx = Infinity;
  let dy = Infinity;
  const sourcePosSpaceMap: Record<string, any> = {};
  for (const rect of rectList) {
    // 矩形的各个边信息
    const left = rect.x;
    const right = rect.x + rect.width;
    const top = rect.y;
    const bottom = rect.y + rect.height;
    const centerX = (left + right) / 2;
    const centerY = (top + bottom) / 2;

    // x和y方向各自取开始、中间、结束三个位置，枚举出共18种情况
    const array = [
      ...(!realResizePos || realResizePos?.includes('left') ? [
        { pos: 'x', sourcePos: 'left', source: rectLeft, target: left },
        { pos: 'x', sourcePos: 'left', source: rectLeft, target: centerX },
        { pos: 'x', sourcePos: 'left', source: rectLeft, target: right },
      ] : []),

      ...(!realResizePos ? [
        { pos: 'x', sourcePos: 'centerX', source: rectCenterX, target: left },
        { pos: 'x', sourcePos: 'centerX', source: rectCenterX, target: centerX },
        { pos: 'x', sourcePos: 'centerX', source: rectCenterX, target: right },
      ] : []),

      ...(!realResizePos || realResizePos?.includes('right') ? [
        { pos: 'x', sourcePos: 'right', source: rectRight, target: left },
        { pos: 'x', sourcePos: 'right', source: rectRight, target: centerX },
        { pos: 'x', sourcePos: 'right', source: rectRight, target: right },
      ] : []),

      ...(!realResizePos || realResizePos?.includes('top') ? [
        { pos: 'y', sourcePos: 'top', source: rectTop, target: top },
        { pos: 'y', sourcePos: 'top', source: rectTop, target: centerY },
        { pos: 'y', sourcePos: 'top', source: rectTop, target: bottom },
      ] : []),

      ...(!realResizePos ? [
        { pos: 'y', sourcePos: 'centerY', source: rectCenterY, target: top },
        { pos: 'y', sourcePos: 'centerY', source: rectCenterY, target: centerY },
        { pos: 'y', sourcePos: 'centerY', source: rectCenterY, target: bottom },
      ] : []),

      ...(!realResizePos || realResizePos?.includes('bottom') ? [
        { pos: 'y', sourcePos: 'bottom', source: rectBottom, target: top },
        { pos: 'y', sourcePos: 'bottom', source: rectBottom, target: centerY },
        { pos: 'y', sourcePos: 'bottom', source: rectBottom, target: bottom },
      ] : []),
    ];

    const minX = Math.min(left, rectLeft);
    const maxX = Math.max(right, rectRight);
    const minY = Math.min(top, rectTop);
    const maxY = Math.max(bottom, rectBottom);

    // 对正在拖拽的矩形来说，每个方向上选出一个最近的辅助线即可
    array.forEach((e: any) => {
      if (closeTo(e.source, e.target)) {
        const space = e.target - e.source;
        // 选出距离更小的
        if (
          !sourcePosSpaceMap[e.sourcePos] ||
          Math.abs(sourcePosSpaceMap[e.sourcePos].space) < Math.abs(space)
        ) {
          if (e.pos === 'x') {
            dx = space;
          } else {
            dy = space;
          }
          sourcePosSpaceMap[e.sourcePos] = {
            space,
            line: {
              x1: e.pos === 'x' ? e.target : minX,
              x2: e.pos === 'x' ? e.target : maxX,
              y1: e.pos === 'y' ? e.target : minY,
              y2: e.pos === 'y' ? e.target : maxY,
            },
          };
        }
      }
    });
  }
  return {
    lines: Object.values(sourcePosSpaceMap).map(e => e.line),
    dx,
    dy,
  };
};

// 处理吸附的修正距离作用与矩形上
export const handleAdsorb = ({
  // 正在编辑的矩形
  rect,
  // 吸附计算出来的x和y方向的变更
  dx,
  dy,
  // 移动还是缩放
  mode,
  // 正在缩放的锚点名
  resizePos = '',
  realResizePos = '',
  // 缩放是否移动到了反向，例如把右侧缩放锚点移动到矩形左侧
  reverse = {},
}: {
  rect: ISizeCoordinate;
  dx: number;
  dy: number;
  mode: 'resize' | 'move';
  resizePos?: string;
  realResizePos?: string;
  reverse?: any;
}) => {
  const spriteRect = { ...rect };
  // const {
  //   leftReverse = false,
  //   rightReverse = false,
  //   bottomReverse = false,
  //   topReverse = false,
  // } = reverse;
  const isPosReverse = (_pos: string) => resizePos?.includes(_pos) && !realResizePos?.includes(_pos);
  const [
    leftReverse = false,
    rightReverse = false,
    bottomReverse = false,
    topReverse = false,
  ] = [
    isPosReverse('left'),
    isPosReverse('right'),
    isPosReverse('bottom'),
    isPosReverse('top'),
  ];
  if (mode === 'move') {
    spriteRect.x += dx;
    spriteRect.y += dy;
  } else if (mode === 'resize') {
    if (resizePos.includes('right')) {
      if (rightReverse) {
        spriteRect.x += dx;
        spriteRect.width -= dx;
      } else {
        spriteRect.width += dx;
      }
    }
    if (resizePos.includes('left')) {
      if (leftReverse) {
        spriteRect.width += dx;
      } else {
        spriteRect.x += dx;
        spriteRect.width -= dx;
      }
    }
    if (resizePos.includes('top')) {
      if (topReverse) {
        spriteRect.height += dy;
      } else {
        spriteRect.y += dy;
        spriteRect.height -= dy;
      }
    }
    if (resizePos.includes('bottom')) {
      if (bottomReverse) {
        spriteRect.y += dy;
        spriteRect.height -= dy;
      } else {
        spriteRect.height += dy;
      }
    }

  }
  return spriteRect;
};

// 计算精灵矩形
export const getRectFromSprite = (sprite: ISprite) => {
  const { size, coordinate } = sprite.attrs;
  return { ...size, ...coordinate } as ISizeCoordinate;
};

export const getPointFromEvent = (e: MouseEvent) => ({ x: e.clientX, y: e.clientY } as ICoordinate);

// 网格吸附
export const handleGridAdsorb = (
  rect: ISizeCoordinate,
  gridCellWidth: number,
  gridCellHeight: number,
  adsorbWidth = 5,
  adsorbHeight = 5,
  // 移动还是缩放
  changeMode: string,
  // 缩放时需要计算吸附的边
  adsorbSides: Record<string, boolean> = {},
) => {
  const { x, y, width, height } = rect;
  const spriteRect = { ...rect };
  // 组件左或下方向被激活
  let leftActivated = true;
  let topActivated = true;
  if (changeMode === 'resize') {
    // resize的场景下，正在操作哪个方向的锚点就激活哪个方向
    leftActivated = adsorbSides.left;
    topActivated = adsorbSides.top;
  } else {
    // move的场景下，距离那哪边近就激活哪个方向
    leftActivated =
      minDisWithGrid(x, gridCellWidth) <
      minDisWithGrid(x + width, gridCellWidth);
    topActivated =
      minDisWithGrid(y, gridCellHeight) <
      minDisWithGrid(y + height, gridCellHeight);
  }
  if (leftActivated) {
    spriteRect.x = roundingUnitize(x, gridCellWidth, adsorbWidth);
  } else {
    spriteRect.x =
      roundingUnitize(x + width, gridCellWidth, adsorbWidth) - width;
  }
  if (topActivated) {
    spriteRect.y = roundingUnitize(y, gridCellHeight, adsorbHeight);
  } else {
    spriteRect.y =
      roundingUnitize(y + height, gridCellHeight, adsorbHeight) - height;
  }
  return {
    dx: spriteRect.x - rect.x || Infinity,
    dy: spriteRect.y - rect.y || Infinity,
  };
};


// 距离网格的最小距离
export const minDisWithGrid = (n: number, unit: number) =>
  Math.min(n % unit, unit - (n % unit));

// 四舍五入网格取整
export const roundingUnitize = (n: number, unit: number, adsorbDis = 4) => {
  // 余数
  const remainder = Math.abs(n % unit);
  const closeToStart = remainder <= adsorbDis;
  const closeToEnd = Math.abs(unit - (n % unit)) <= adsorbDis;
  if (closeToStart || closeToEnd) {
    const m = Math.floor(n / unit); // 是单位长度的几倍
    if (remainder <= unit / 2) {
      // 靠近单元格开始位置
      return m * unit;
    } else {
      // 靠近单元格结束位置
      return (m + 1) * unit;
    }
  }
  // 都不靠近，直接返回原本位置
  return n;
};
