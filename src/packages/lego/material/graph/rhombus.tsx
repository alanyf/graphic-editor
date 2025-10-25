// 菱形
import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';

export default (props: any) => {
  const {
    x = 0,
    y = 0,
    width,
    height,
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
  } = props;
  const d = `
    M${x},${y + height / 2}
    L${x + width / 2},${y}
    L${x + width},${y + height / 2}
    L${x + width / 2},${y + height}
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
