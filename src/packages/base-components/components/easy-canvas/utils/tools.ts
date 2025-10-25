import type { IContext, ICoordinate, Point } from '../interface';

/**
 * 计算鼠标在舞台上的坐标
 * @param e
 * @param stageCoordinate
 * @returns
 */
export const getStageMousePoint = (e: MouseEvent, stageCoordinate: ICoordinate) => {
  return {
    x: e.pageX - stageCoordinate.x,
    y: e.pageY - stageCoordinate.y,
  } as Point;
};

/**
 * 设置属性
 * @param ctx
 * @param attrs
 */
export const setAttrs = (ctx: IContext, attrs: Record<string, any>) => {
  Object.keys(attrs).forEach((key: string) => {
    ctx[key] = attrs[key];
  });
};
