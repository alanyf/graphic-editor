// 平行四边形
import {
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps, Point } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  points: Point[];
}

export default (props: IProps) => {
  const {
    points = [],
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    ...rest
  } = props;
  const pointsString = points.map((p: Point) => `${p.x},${p.y}`).join(' ');
  return (
    <polyline
      {...rest}
      points={pointsString}
      fill={'none'}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
    />
  );
};
