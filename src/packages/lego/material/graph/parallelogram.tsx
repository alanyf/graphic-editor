// 平行四边形
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
  const d = `M${x + offset},${y}  L${x + width},${y}  L${x + width - offset},${
    y + height
  }  L${x},${y + height} Z`;
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
