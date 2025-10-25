// 五边形
import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps } from '../../interface';

type IProps = IDefaultGraphicProps;

export default (props: IProps) => {
  const {
    x = 0,
    y = 0,
    width = 40,
    height = 20,
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
  } = props;
  const xRate = 0.191;
  const yRate = 0.382;
  const d = `
      M${x + width / 2},${y}
      L${x + width},${y + height * yRate}
      L${x + width * (1 - xRate)},${y + height}
      L${x + width * xRate},${y + height}
      L${x},${y + height * yRate}
      Z
  `;
  return (
    <path
      {...props}
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
    />
  );
};
