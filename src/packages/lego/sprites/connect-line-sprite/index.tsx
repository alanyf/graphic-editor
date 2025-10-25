import React from 'react';
import { getPointsBoundingRect } from '@packages/geometry-tools';
import Line from '../../material/graph/line';
import VerticalPolyline from '../../material/graph/vertical-polyline';
import TerminalPoint from '../../material/terminal-point';
import type {
  ISpriteMeta,
  IPointOption,
  IDefaultGraphicProps,
  Point,
  ISprite,
} from '../../interface';
import { EventTypeEnum } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import {
  debounce,
  findSpriteInSpriteList,
  getArrowLineEndPoint,
} from '../../utils/tools';
import BesselCurveLine from './bessel-curve-line';

const getPortInfo = (e: any) => {
  const { target } = e;
  if (target?.classList.contains('link-port-point-container')) {
    const jsonDataStr = target.getAttribute('data-port-json');
    if (!jsonDataStr) {
      return;
    }
    try {
      const jsonData = JSON.parse(jsonDataStr);
      return jsonData;
    } catch (err) {
      console.error('解析连接桩json数据失败', target, err);
    }
    return null;
    // const spriteId = target.getAttribute('data-sprite-id');
    // const index = Number(target.getAttribute('data-index'));
    // const id = target.getAttribute('data-sprite-id');
  }
  return undefined;
};

export interface IPort {
  id: string;
  index: number;
  spriteId: string;
  arcAngle: number;
}

export interface IPortPointOption extends IPointOption {
  port?: IPort;
}

type ConnectLineType = 'Line' | 'VerticalLine' | 'SmoothCurve';

interface IProps extends IDefaultGraphicProps {
  start: IPortPointOption;
  end: IPortPointOption;
  offset: number;
  lineType?: ConnectLineType;
}

const SpriteType = 'ConnectLineSprite';

export class ConnectLineSprite extends BaseSprite<IProps> {
  isAddStartPoint: boolean = false;

  readonly state = {
    anchorMoving: false,
  };

  constructor(props: IProps) {
    super(props as any);
    // 针对连接线做的优化，在更新端点坐标时对更新精灵坐标做防抖
    this.updateSpriteAttrsDebounce = debounce(this.updateSprite, 150);
  }

  pointChangeHandle = (point: Point, prop: 'start' | 'end') => {
    const { sprite, stage } = this.props;
    const { props } = sprite;
    const newProps = {
      ...props,
      [prop]: { ...props[prop], ...point },
    };
    stage.apis.updateSpriteProps(sprite, newProps);
    // 针对连接线做的优化，在更新端点坐标时对更新精灵坐标做防抖
    this.updateSpriteAttrsDebounce(newProps);
  };

  offsetChangeHandle = (offset: number) => {
    const { sprite, stage } = this.props;
    const { props } = sprite;
    const { start, end } = props;
    const newProps = {
      offset: (100 * offset) / (end.x - start.x),
    };
    stage.apis.updateSpriteProps(sprite, newProps);
  };

  // 针对连接线做的优化，在更新端点坐标时对更新精灵坐标做防抖
  updateSpriteAttrsDebounce: any = () => {};

  // 更新精灵
  updateSprite = (props: IProps) => {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    const { start, end } = props;
    const { coordinate } = attrs;
    if (!start || !end) {
      return;
    }
    const { x, y, width, height } = getPointsBoundingRect([start, end]);
    const newProps = {
      ...props,
      start: { ...start, x: start.x - x, y: start.y - y },
      end: { ...end, x: end.x - x, y: end.y - y },
    };
    const newAttrs = {
      coordinate: { x: x + coordinate.x, y: y + coordinate.y },
      size: { width, height },
    };
    stage.apis.updateSpriteProps(sprite, newProps);
    stage.apis.updateSpriteAttrs(sprite, newAttrs);
  };

  handleMouseUp = (e: MouseEvent, prop: 'start' | 'end') => {
    const { sprite } = this.props;
    const { props } = sprite;

    const newProps = { ...props };
    const port = getPortInfo(e);
    if (port) {
      newProps[prop] = { ...newProps[prop], port };
    }
    this.updateSprite(newProps);
    this.props.stage.apis.history.recordHistory(); // 记录一次快照
  };

  handleSpriteUpdate = ({ spriteList }: { spriteList: ISprite[] }) => {
    const { active } = this.props;
    const { sprite } = this.props;
    /*
      PS：通过此判断可在【同时选中连接桩精灵和连接线操作】时优化性能。
      如果【连接线被选中或者正在创建中】不需要跟随连接桩精灵变化，
      因为目标精灵无法再连接线被选中的情况下单独移动。
    */
    if (active || sprite.attrs.creating) {
      return;
    }
    const { start, end } = sprite.props;
    const startMove =
      start.port &&
      Boolean(findSpriteInSpriteList(spriteList, start.port.spriteId).sprite);
    const endMove =
      end.port &&
      Boolean(findSpriteInSpriteList(spriteList, end.port.spriteId).sprite);
    if (startMove) {
      const p = this.getPointCoordinate(sprite.props.start);
      this.pointChangeHandle(p, 'start');
    }
    if (endMove) {
      const p = this.getPointCoordinate(sprite.props.end);
      this.pointChangeHandle(p, 'end');
    }
  };

  getPointCoordinate = (point: IPortPointOption) => {
    if (!point.port || !point.port.spriteId) {
      return point;
    }
    const { spriteId, index } = point.port;
    const { stage, sprite } = this.props;
    const { x, y } = sprite.attrs.coordinate;
    const newPoint = stage.apis.getPortCoordinate(spriteId, index);
    if (newPoint) {
      newPoint.x -= x;
      newPoint.y -= y;
    }
    return newPoint || point;
  };

  onSpriteUpdate = () => {
    // 监听目标精灵变化
    this.props.stage.apis.$event.on(
      EventTypeEnum.UpdateSpriteList,
      this.handleSpriteUpdate,
    );
  };

  offSpriteUpdate = () => {
    // 监听目标精灵变化
    this.props.stage.apis.$event.off(
      EventTypeEnum.UpdateSpriteList,
      this.handleSpriteUpdate,
    );
  };

  handleCreateMouseDown = (point: Point, e: React.MouseEvent) => {
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const { start = {}, end = {} } = props;
    console.log('yf123', start, end);

    if (!this.isAddStartPoint) {
      props.start = { ...start, ...point };
      props.end = { ...end, ...point };
      this.isAddStartPoint = true;
      const port = getPortInfo(e);
      if (port) {
        props.start.port = port;
      }
      stage.apis.updateSpriteProps(sprite, props);
    } else {
      props.end = { ...end, ...point };
      props.end.port = getPortInfo(e);
      this.handleMouseUp(e as any, 'end');
      stage.apis.resetCreatingSprite();
    }
  };

  handleCreateMouseMove = (point: Point) => {
    if (!this.isAddStartPoint) {
      return;
    }
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const { end } = props;
    props.end = { ...end, ...point };
    stage.apis.updateSpriteProps(sprite, props);
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    if (!this.state.anchorMoving) {
      this.setState({ anchorMoving: true });
    }
    this.pointChangeHandle(point, index === 0 ? 'start' : 'end');
  };

  handleAnchorMouseUp = ({ sprite, index, e }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.setState({ anchorMoving: false });
    // 加个延时避免因为防抖而计算不准
    setTimeout(() => {
      // 重新计算是否吸附在连接桩上，重制局部定位
      this.handleMouseUp(e, index === 0 ? 'start' : 'end');
    }, 160);
  };

  componentDidMount() {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    if (attrs.creating) {
      stage.apis.startCreatingSprite({
        sprite,
        onMouseDown: this.handleCreateMouseDown,
        onMouseMove: this.handleCreateMouseMove,
      });
    }
    this.onSpriteUpdate();
    this.props.stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
    this.props.stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointMouseUp,
      this.handleAnchorMouseUp,
    );
  }

  componentWillUnmount() {
    this.offSpriteUpdate();
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointMouseUp,
      this.handleAnchorMouseUp,
    );
  }

  renderLineEndPoints = (start: IPointOption, end: IPointOption) => {
    const { stroke, strokeWidth } = this.props.sprite.props;
    const startControl = { ...end };
    const endControl = { ...start };
    return (
      <>
        <TerminalPoint
          option={{ stroke, fill: stroke, strokeWidth, ...start }}
          start={startControl}
        />
        <TerminalPoint
          option={{ stroke, fill: stroke, strokeWidth, ...end }}
          start={endControl}
        />
      </>
    );
  };

  renderEndPoints = (start: IPointOption, end: IPointOption) => {
    const { stroke, strokeWidth } = this.props.sprite.props;
    const startControl = { ...start, x: start.x + 5 };
    const endControl = { ...end, x: end.x + 5 };
    return (
      <>
        <TerminalPoint
          option={{ stroke, fill: stroke, strokeWidth, ...start }}
          start={startControl}
        />
        <TerminalPoint
          option={{ stroke, fill: stroke, strokeWidth, ...end }}
          start={endControl}
        />
      </>
    );
  };

  renderVerticalLine = () => {
    const { props } = this.props.sprite;
    const { start, end, offset, ...rest } = props;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;
    return (
      <>
        <VerticalPolyline
          {...rest}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          offset={offset}
          strokeDasharray="none"
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <VerticalPolyline
          {...rest}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          offset={offset}
        />
        <g style={{ pointerEvents: 'none' }}>
          {this.renderEndPoints(start, end)}
        </g>
      </>
    );
  };

  render() {
    const { sprite, stage } = this.props;
    const { props, attrs } = sprite;
    const { creating } = attrs;
    const { start, end, lineType = 'Line', ...rest } = props;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;
    const { spriteMap } = stage.store();
    const { strokeWidth = 1 } = props;
    const { start: startP, end: endP } = getArrowLineEndPoint(
      start,
      end,
      strokeWidth,
    );
    return (
      <g
        style={{
          pointerEvents:
            creating || this.state.anchorMoving ? 'none' : undefined,
        }}>
        {lineType === 'Line' && (
          <>
            <Line
              {...rest}
              x1={startP.x}
              y1={startP.y}
              x2={endP.x}
              y2={endP.y}
            />
            <Line
              {...rest}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth="6"
              strokeDasharray="none"
              stroke="transparent"
            />
            <g style={{ pointerEvents: 'none' }}>
              {this.renderLineEndPoints(start, end)}
            </g>
          </>
        )}
        {lineType === 'VerticalLine' && this.renderVerticalLine()}
        {lineType === 'SmoothCurve' && (
          <>
            <BesselCurveLine
              {...rest}
              start={start}
              end={end}
              spriteMap={spriteMap}
            />
          </>
        )}
      </g>
    );
  }
}

export const ConnectLineSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: ConnectLineSprite,
  operation: {
    // canOperate: false,
    canRotate: false,
    canResize: false,
    // canMove: false,
    canAlign: false,
    canConnect: true,
  },
  initProps: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    offset: 50,
    lineType: 'SmoothCurve',
  },
  initAttrs: {
    size: { width: 0, height: 0 },
    coordinate: { x: 0, y: 0 },
    creating: true,
  } as any,
  anchors: {
    moveHide: true,
    getPoints: ({ sprite }) => {
      const { start, end } = sprite.props as IProps;
      return [start, end];
    },
  },
};

export default ConnectLineSpriteMeta;
