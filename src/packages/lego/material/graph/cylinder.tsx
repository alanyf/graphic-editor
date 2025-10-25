// 圆柱
import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  offset?: number;
}

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
    offset = 10,
  } = props;
  const half = offset / 2;
  const d = `
        M${x},${y + half}  L${x},${y + height - half}
        M${x},${y + height - half} A${width / 2},${half} 0 1 0 ${x + width},${
  y + height - half
}
        L${x + width},${y + half}
        A${width / 2},${half} 0 1 0 ${x},${y + half} Z
        M${x},${y + half}  A${width / 2},${half} 0 1 0 ${x + width},${y + half}
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
