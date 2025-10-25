import type { Point, IParams } from '../interface';
import Shape from '../shape';
import { setAttrs } from '../utils/tools';

class Rect extends Shape {
  type = 'rect';
  props: any = {};
  constructor(props: any) {
    super();
    this.props = props;
  }
  draw({ ctx }: IParams) {
    const { x, y, width, height, attrs = {} } = this.props;
    ctx.save();
    ctx.beginPath();
    setAttrs(ctx, attrs);
    if (attrs.fillStyle) {
      ctx.fillRect(x, y, width, height);
    }
    if (attrs.strokeStyle) {
      ctx.strokeRect(x, y, width, height);
    }
    ctx.closePath();
    ctx.restore();
  }
  // 判断点是否在图形内部
  isPointInClosedRegion(point: Point) {
    const { x, y } = point;
    const { x: minX, y: minY, width, height } = this.props;
    const maxX = minX + width;
    const maxY = minY + height;
    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return true;
    }
    return false;
  }
}

export default Rect;
