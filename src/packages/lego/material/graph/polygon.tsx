
import { useState } from 'react';
// 平行四边形
import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps, Point, Line } from '../../interface';
import { defaultFun } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  points: Point[];
  onClickEdge?: (index: number, line: Line) => void;
}

export default (props: IProps) => {
  const {
    points = [],
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    onClickEdge = defaultFun,
    ...rest
  } = props;
  const [moved, setMoved] = useState(false);
  const pointsString = points.map((p: Point) => `${p.x},${p.y}`).join(' ');
  return (
    <>
      <polygon
        {...rest}
        points={pointsString}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeDasharray={strokeDasharray}
      />
      {points.map((p: Point, i: number) => {
        const next = points[i === points.length - 1 ? 0 : i + 1];
        return (
          <g key={i}>
            <line
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={'transparent'}
              strokeWidth={4}
              style={{ cursor: 'pointer' }}
              onMouseDown={() => setMoved(false)}
              onMouseMove={() => !moved && setMoved(true)}
              onMouseUp={() => {
                if (!moved) {
                  onClickEdge(i, { x1: p.x, y1: p.y, x2: next.x, y2: next.y });
                }
              }}
            />
          </g>
        );
      })}
    </>
  );
};
