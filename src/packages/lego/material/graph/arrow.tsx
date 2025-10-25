import {
  startEndPointToLine,
  lineEquation,
  verticalLineEquation,
  disPointOnLineByEquation,
} from '@packages/geometry-tools';
import {
  defaultStroke,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps, Point } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  start: Point;
  end: Point;
  width?: number;
  height?: number;
  concaveDis?: number;
}
export default (props: IProps) => {
  const {
    fill = '#000',
    stroke = defaultStroke,
    strokeWidth = 0,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    concaveDis = 2,
    width = 10,
    height = 6,
    start: p1,
    end: p2,
    ...rest
  } = props;
  const eqa = lineEquation(p1, p2);
  const line = startEndPointToLine(p1, p2);
  const p3 = disPointOnLineByEquation(
    eqa,
    p2,
    width - concaveDis,
    p2.x > p1.x || (p2.x === p1.x && p2.y > p1.y),
  );
  const p4 = disPointOnLineByEquation(
    eqa,
    p2,
    width,
    p2.x > p1.x || (p2.x === p1.x && p2.y > p1.y),
  );
  const verticalLineEqa = verticalLineEquation(line, p4);
  const p5 = disPointOnLineByEquation(
    verticalLineEqa,
    p4,
    height / 2,
    p2.y > p1.y,
  );
  const p6 = disPointOnLineByEquation(
    verticalLineEqa,
    p4,
    height / 2,
    p2.y <= p1.y,
  );
  return (
    <>
      <path
        {...rest}
        d={`M${p3.x},${p3.y}
                    L${p5.x},${p5.y}
                    L${p2.x},${p2.y}
                    L${p6.x},${p6.y}
                    Z`}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeDasharray={strokeDasharray}
      />
      {/* <circle fill={'red'} cx={p4.x} cy={p4.y} r={3} />
            <circle fill={'green'} cx={p5.x} cy={p5.y} r={3} />
            <circle fill={'blue'} cx={p6.x} cy={p6.y} r={3} /> */}
    </>
  );
};
