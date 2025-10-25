import type {
  ICanvas,
  IContext,
  IShape,
  ICoordinate,
  ISize,
  IHandlerParams,
  Point,
  IListener,
} from './interface';
import { EventType } from './enum';
import { getStageMousePoint } from './utils/tools';
// EventType.Click,
const events = [EventType.MouseDown, EventType.MouseMove, EventType.MouseUp];

// 新建一个画布类
class Canvas {
  canvas: ICanvas = {};
  coordinate: ICoordinate = { x: 0, y: 0 };
  size: ISize = { width: 0, height: 0 };
  ctx: IContext = {};
  shapeList: IShape[] = [];
  eventHandlerMap: Record<EventType, (event: any) => void> = {} as any;

  initShapeCoordinate: ICoordinate = { x: 0, y: 0 };
  initMousePoint: Point = { x: 0, y: 0 };
  constructor(canvas: ICanvas) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(2, 2);
    this.shapeList = [];

    const { x, y, width, height } = canvas.getBoundingClientRect();
    this.coordinate = { x, y };
    this.size = { width, height };
    this.addEventListener();
  }
  add(shape: IShape) {
    shape.draw({ ctx: this.ctx });

    shape.on(EventType.MouseDown, this.move_handleDown);
    this.shapeList.push(shape);
  }

  move_handleDown = ({ point, shape }: IHandlerParams) => {
    this.initMousePoint = point;
    this.initShapeCoordinate = { x: shape.props.x, y: shape.props.y };
    shape.on(EventType.MouseMove, this.move_handleMove, false);
    shape.on(EventType.MouseUp, this.move_handleUp, false);
  };
  move_handleMove = (params: IHandlerParams) => {
    const { point, shape } = params;
    const { x, y, width, height, attrs } = shape.props;
    const { lineWidth = 1 } = attrs;
    this.clear(x, y, width, height, lineWidth);
    point.x = Math.min(Math.max(point.x, 0), this.size.width);
    point.y = Math.min(Math.max(point.y, 0), this.size.height);
    shape.props.x = this.initShapeCoordinate.x + point.x - this.initMousePoint.x;
    shape.props.y = this.initShapeCoordinate.y + point.y - this.initMousePoint.y;
    shape.draw({ ctx: this.ctx });
  };
  move_handleUp = ({ shape }: IHandlerParams) => {
    shape.off(EventType.MouseMove, this.move_handleMove);
    shape.off(EventType.MouseUp, this.move_handleUp);
  };
  clear(x: number, y: number, width: number, height: number, lineWidth = 1) {
    this.ctx.clearRect(x - lineWidth, y - lineWidth, width + lineWidth * 2, height + lineWidth * 2);
  }
  addEventListener() {
    events.forEach((eventName: EventType) => {
      document.addEventListener(eventName, this.handleEvent(eventName));
    });
  }
  removeEventListener() {
    events.forEach((eventName: EventType) => {
      document.removeEventListener(eventName, this.handleEvent(eventName));
    });
  }
  handleDestroy() {
    this.removeEventListener();
  }
  handleEvent(name: EventType) {
    if (this.eventHandlerMap[name]) {
      return this.eventHandlerMap[name];
    }
    const handler = (e: any) => {
      const point = getStageMousePoint(e, this.coordinate);
      let hoverShape = false;
      this.shapeList.forEach((shape) => {
        const pointInShape = shape.isPointInClosedRegion(point);
        hoverShape = pointInShape || hoverShape;
        this.canvas.style.cursor = hoverShape ? 'move' : 'default';
        const listeners = shape.listenerMap.get(name);
        listeners?.forEach((listener: IListener) => {
          if (!pointInShape && listener.onlySelf === true) {
            return;
          }
          listener.handler({ e, point, shape });
        });
      });
    };
    this.eventHandlerMap[name] = handler;
    return handler;
  }
}

export default Canvas;
