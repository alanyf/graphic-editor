import { disPointFromLine, distance } from '@packages/geometry-tools';
import { TerminalTypeEnum } from '../interface';
import type { IPointOption, Point } from '../interface';
import Arrow from './graph/arrow';

export interface IProps {
  option: IPointOption;
  // 当渲染箭头等需要方向信息的端点时需要提供起点
  start?: Point;
  arrowUseStroke?: boolean;
}

export default (props: IProps) => {
  const { option, arrowUseStroke = false } = props;
  const { type, x, y, strokeWidth = 1, ...rest } = option;
  const point = { x: option.x, y: option.y };
  const renderCircle = () => (
    <circle r={strokeWidth + 2} fill={'#000'} cx={x} cy={y} {...rest} />
  );
  const renderHollowCircle = () => (
    <circle
      r={strokeWidth + 2}
      cx={x}
      cy={y}
      data-stroke={option.stroke}
      {...rest}
      fill={'#fff'}
      stroke={option.stroke || '#000'}
      strokeWidth={Math.max(strokeWidth / 2, 1)}
    />
  );
  const renderArrow = () => {
    let { start } = props;
    if (!start) {
      start = { x, y };
    }
    return (
      <Arrow
        strokeWidth={arrowUseStroke ? strokeWidth : undefined}
        width={strokeWidth * 6 + 4}
        height={strokeWidth * 3.5 + 3}
        concaveDis={strokeWidth + 1}
        {...rest}
        start={start}
        end={{ x, y }}
      />
    );
  };
  const renderTiltRect = () => {
    const r = Math.max(4, strokeWidth * 2);
    let { start } = props;
    if (!start) {
      start = { x, y };
    }
    const dis = distance(start, point);
    const left = {
      x: x - ((x - start.x) * r) / dis,
      y: y - ((y - start.y) * r) / dis,
    };
    const right = {
      x: x + ((x - start.x) * r) / dis,
      y: y + ((y - start.y) * r) / dis,
    };
    const top = disPointFromLine(start, point, r);
    const bottom = disPointFromLine(start, point, r, false);
    const path = `
      M${left.x},${left.y}
      L${top.x},${top.y}
      L${right.x},${right.y}
      L${bottom.x},${bottom.y}
      Z
    `;
    return (
      <path
        strokeWidth={Math.max(2, strokeWidth)}
        stroke={option.stroke || '#000'}
        fill={'#fff'}
        {...rest}
        d={path}
      />
    );
  };
  return (
    <>
      {type === TerminalTypeEnum.Circle && renderCircle()}
      {type === TerminalTypeEnum.HollowCircle && renderHollowCircle()}
      {type === TerminalTypeEnum.Arrow && renderArrow()}
      {type === TerminalTypeEnum.TiltRect && renderTiltRect()}
    </>
  );
};
