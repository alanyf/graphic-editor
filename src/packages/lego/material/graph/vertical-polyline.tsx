// 平行四边形
import {
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offset?: number;
}

export default (props: IProps) => {
  const {
    x1,
    y1,
    x2,
    y2,
    offset = 50,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    ...rest
  } = props;
  const dx = ((x2 - x1) * offset) / 100;
  const d = `M${x1},${y1} L${x1 + dx},${y1} L${x1 + dx},${y2} L${x2},${y2}`;
  return (
    <path
      {...rest}
      d={`${d}`}
      fill={'none'}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
    />
  );
};
