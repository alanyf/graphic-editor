import type Shape from './shape';

export interface Point {
  x: number;
  y: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

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

export type IContext = Record<string, any>;

export type ICanvas = Record<string, any>;

export interface IShape extends Shape {
  [prop: string]: any;
}

export interface IParams {
  ctx: any;
}

export interface IHandlerParams {
  e: any;
  point: Point;
  shape: IShape;
}

export type IHandler = (params: IHandlerParams) => void;

export interface IListener {
  eventName: string;
  handler: IHandler;
  onlySelf: boolean;
}
