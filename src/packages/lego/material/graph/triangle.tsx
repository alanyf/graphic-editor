import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';

export default (props: any) => {
  const {
    x,
    y,
    width,
    height,
    anchorPointX = 0,
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    ...rest
  } = props;
  return (
    <path
      {...rest}
      d={`M${x + anchorPointX},${y}  L${x},${y + height}  L${x + width},${
        y + height
      }  Z`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}></path>
  );
};
