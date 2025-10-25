import { distance } from '@packages/geometry-tools';
import type { Point, IParams } from '../interface';
import Shape from '../shape';
import { setAttrs } from '../utils/tools';

class Circular extends Shape {
  type = 'circular';

  props: any = {};

  constructor(props: any) {
    super();
    this.props = props;
  }

  draw({ ctx }: IParams) {
    const { x, y, r, attrs = {} } = this.props;
    ctx.save();
    ctx.beginPath();
    setAttrs(ctx, attrs);
    ctx.arc(x + r, y + r, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  }

  // 判断点是否在图形内部
  isPointInClosedRegion(point: Point) {
    const { x, y, r, attrs } = this.props;
    const { strokeWidth = 1 } = attrs;
    const dis = distance({ x: x + r, y: y + r }, point);
    if (dis <= r + strokeWidth) {
      return true;
    }
    return false;
  }
}

export default Circular;
