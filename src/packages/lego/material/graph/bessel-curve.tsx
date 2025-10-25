import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps, Point } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  start: Point;
  end: Point;
  control: Point;
}

export default (props: IProps) => {
  const {
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    start = { x: 0, y: 0 },
    end = { x: 0, y: 0 },
    control = { x: 0, y: 0 },
    ...rest
  } = props;
  return (
    <path
      {...rest}
      d={`M${start.x},${start.y}
                Q${control.x} ${control.y} ${end.x} ${end.y}`}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
    />
  );
};
