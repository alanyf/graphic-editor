import { disOfPointToLine } from '@packages/geometry-tools';
import type { Point, IParams } from '../interface';
import Shape from '../shape';
import { setAttrs } from '../utils/tools';

class Line extends Shape {
  type = 'line';

  props: any = {};

  constructor(props: any) {
    super();
    this.props = props;
  }

  draw({ ctx }: IParams) {
    const { x, y, x1, y1, x2, y2, attrs = {} } = this.props;
    ctx.save();
    ctx.beginPath();
    setAttrs(ctx, attrs);
    ctx.moveTo(x + x1, y + y1);
    ctx.lineTo(x + x2, y + y2);
    ctx.closePath();
    ctx.restore();
    ctx.stroke();
  }

  // 判断点是否在图形内部
  isPointInClosedRegion(point: Point) {
    const { x, y, x1, y1, x2, y2, attrs } = this.props;
    const p = { x: point.x - x, y: point.y - y };
    const { strokeWidth = 2 } = attrs;
    const line = { x1, y1, x2, y2 };
    const dis = disOfPointToLine(p, line);
    if (dis <= strokeWidth) {
      return true;
    }
    return false;
  }
}

export default Line;
