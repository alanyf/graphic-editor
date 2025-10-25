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
  lengthX?: number;
  lengthY?: number;
}

export default (props: IProps) => {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 100,
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    ...rest
  } = props;
  let { lengthX = 70, lengthY = 70 } = props;
  lengthX = (width * lengthX) / 100;
  lengthY = (height * lengthY) / 100;
  const offsetX = width - lengthX;
  const offsetY = height - lengthY;
  const d = `
        M${x},${y + offsetY}  L${x + lengthX},${y + offsetY}  L${x + lengthX},${
    y + height
  }  L${x},${y + height}
        L${x},${y + offsetY}  L${x + offsetX},${y}  L${x + width},${y}  L${
    x + lengthX
  },${y + offsetY}
        M${x + lengthX},${y + height}  L${x + width},${y + lengthY}  L${
    x + width
  },${y} L${x + lengthX},${y + offsetY} Z
    `;
  return (
    <path
      {...rest}
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
    />
  );
};
