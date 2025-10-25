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
    width = 100,
    height = 100,
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    borderRadius = 0,
    disableAngleLeftTop = false,
    disableAngleRightTop = false,
    disableAngleRightBottom = false,
    disableAngleLeftBottom = false,
  } = props;
  const r = borderRadius;
  // const d = `M${x},${y + r}
  //   Q${x},${y} ${x + r},${y}
  //   L${x + width - r},${y}
  //   Q${x + width},${y} ${x + width},${y + r}
  //   L${x + width},${y + height - r}
  //   Q${x + width},${y + height} ${x + width - r},${y + height}
  //   L${x + r},${y + height}
  //   Q${x},${y + height} ${x},${y + height - r}
  //   Z`;
  const d = `M${x},${y + r}
    ${`${
      disableAngleLeftTop
        ? `L${x},${y}, L${x + r},${y}`
        : `A${r},${r} 0 0,1 ${x + r},${y}`
    }`}
    L${x + width - r},${y}
    ${`${
      disableAngleRightTop
        ? `L${x + width},${y}, L${x + width},${y + r}`
        : `A${r},${r} 0 0,1 ${x + width},${y + r}`
    }`}

    L${x + width},${y + height - r}
    ${`${
      disableAngleRightBottom
        ? `L${x + width},${y + height}, L${x + width - r},${y + height}`
        : `A${r},${r} 0 0,1 ${x + width - r},${y + height}`
    }`}

    L${x + r},${y + height}
    ${`${
      disableAngleLeftBottom
        ? `L${x},${y + height}, L${x},${y + height - r}`
        : `A${r},${r} 0 0,1 ${x},${y + height - r}`
    }`}

    Z`;
  return (
    <path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
    />
  );
};
