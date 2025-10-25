/* eslint-disable @typescript-eslint/no-unused-vars */

import type React from 'react';
import type {
  IStageInstanceProps,
  IState as IStageStore,
  IProps as IStageProps,
} from '../lego-stage';
import type LegoStage from '../lego-stage';

// 任意对象
export type ObjectAny = Record<string, unknown>;

// 默认图形props
export interface IDefaultGraphicProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  defaultStrokeLinecap?: 'butt' | 'round' | 'square';
}

// 点配置
export interface IPointOption {
  type?: TerminalTypeEnum;
  x: number;
  y: number;
  width?: number;
  height?: number;
  r?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  defaultStrokeLinecap?: 'butt' | 'round' | 'square';
}

// 乐高
export interface ILego {}

export interface IReadyContext {
  stage: IStageApis;
}

export interface IContext {
  sprite: ISprite;
  stage: IStageApis;
}

export interface IStageApis {
  apis: LegoStage;
  store: () => IStageStore & IStageInstanceProps & IStageProps;
}

export const defaultFun = () => '';

export interface Point {
  x: number;
  y: number;
}

export interface IPort {
  x: number;
  y: number;
  arcAngle?: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// 画布长宽比
export type IWidthHeightRatio = '16:9' | '4:3' | '1:1';

// 尺寸
export interface ISize {
  width: number;
  height: number;
}
// 坐标
export interface ICoordinate {
  x: number;
  y: number;
}

// 精灵属性
export interface ISpriteAttrs {
  style: ObjectAny;
  size: ISize;
  coordinate: ICoordinate;
  angle: number;
  editing: boolean;
  creating: boolean;
}
// 精灵属性可选
export interface ISpriteAttrsLike {
  style?: ObjectAny;
  size?: ISize;
  coordinate?: ICoordinate;
  angle?: number;
  editing?: boolean;
  creating?: boolean;
}

export interface ITransform {
  scale?: number;
  translate?: number;
}

// 连接桩参考系
export enum PortReferEnum {
  sprite = 'sprite',
  stage = 'stage',
}
// 连接桩参考系
export enum PortUnitEnum {
  percent = '%',
  px = 'px',
}
// 连接桩
export interface IPorts {
  unit?: string;
  refer?: PortReferEnum;
  points?: IPort[];
  getPoints?: (ctx: IContext) => IPort[];
  render?: (ctx: IContext) => React.ReactNode;
}

// 锚点属性
export interface IAnchorPointAttrs {
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  strokeDasharray?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  defaultStrokeLinecap?: 'butt' | 'round' | 'square';
  radius?: number;
  style?: React.CSSProperties;
  className?: string;
}

// 锚点
export interface IAnchors {
  points?: Point[];
  getPoints?: (ctx: IContext) => Point[];
  refer?: PortReferEnum;
  pointRender?: (ctx: IContext) => React.ReactNode;
  pointAttrs?: IAnchorPointAttrs;
  moveHide?: boolean; // 移动锚点时隐藏锚点
}

export interface ISpriteOperation {
  canOperate?: boolean;
  canMove?: boolean;
  canRotate?: boolean;
  canResize?: boolean;
  resizeLock?: boolean;
  canAlign?: boolean;
  canConnect?: boolean;
}

export interface ICenterText {
  editable?: boolean;
}

export interface ISpriteMeta<IProps = any> {
  type: string;
  spriteComponent:
    | React.JSXElementConstructor<any>
    | ((props: any) => React.ReactNode);
  initProps?: IProps;
  initAttrs?: ISpriteAttrs;
  ports?: IPorts;
  anchors?: IAnchors;
  operation?: ISpriteOperation;
  centerText?: ICenterText;
}

export type ISpriteComponent = React.Component;

// 精灵
export interface ISprite<IProps = any> {
  id: string;
  type: string;
  props: IProps;
  attrs: ISpriteAttrs;
  children?: ISprite<any>[];
}

// 高宽和定位坐标
export interface ISizeCoordinate {
  width: number;
  height: number;
  x: number;
  y: number;
}

// 定位
export interface IPosition {
  left: number;
  top: number;
}

// 剪切板
export interface IShearPlate {
  type: string;
  content: any;
}

// 网格线类型
export enum IGridThemeEnum {
  SolidLine = 'SolidLine',
  DottedLine = 'DottedLine',
  Point = 'Point',
}

// 网格线
export interface IGridStyle {
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
}

// 网格线
export interface IGridLine {
  theme?: IGridThemeEnum;
  spacing?: number;
  adsorbDis?: number;
  enable?: boolean;
  visible?: boolean;
  customStyle?: IGridStyle;
}

// 对齐吸附线
export interface IAdsorbLine {
  enable?: boolean;
  visible?: boolean;
  distance?: number;
  maximum?: number;
}

export interface IRect {
  width: number;
  height: number;
  x: number;
  y: number;
}

export enum EventTypeEnum {
  UpdateSpriteList = 'UpdateSpriteList',
  MoveSpriteList = 'MoveSpriteList',
  ResizeSpriteList = 'ResizeSpriteList',
  RotateSpriteList = 'RotateSpriteList',
  AddSpriteList = 'AddSpriteList',
  RemoveSpriteList = 'RemoveSpriteList',
  SpriteAnchorPointChange = 'SpriteAnchorPointChange',
  SpriteAnchorPointMouseDown = 'SpriteAnchorPointMouseDown',
  SpriteAnchorPointMouseUp = 'SpriteAnchorPointMouseUp',
}

export enum TerminalTypeEnum {
  Circle = 'circle',
  HollowCircle = 'hollowCircle', // 空心圆
  Arrow = 'arrow',
  TiltRect = 'tiltRect', // 倾斜的矩形
}
