import React from 'react';
import { AnchorPoint } from '@packages/base-components';
import type { ISprite, IStageApis, IContext, Point } from '../interface';
import { PortReferEnum, EventTypeEnum } from '../interface';
import { getOriginMousePointInSprite } from '../utils/tools';

interface IProps {
  sprite: ISprite;
  stage: IStageApis;
  active: boolean;
}

interface IState {
  anchorMoving: boolean;
}

const defaultPointAttrs = {
  stroke: '#fff',
  strokeWidth: 1,
  fill: '#1e7fff',
  path: 'M10,10 a5 5 0 1 0 0.00000001 0',
};

export default class AnchorPointsRender extends React.Component<
  IProps,
  IState
> {
  state: Readonly<IState> = {
    anchorMoving: false,
  };

  pointChangeHandle = (mousePoint: Point, e: MouseEvent, i: number) => {
    if (!this.state.anchorMoving) {
      this.setState({ anchorMoving: true });
    }
    this.publishEvent(mousePoint, e, i, EventTypeEnum.SpriteAnchorPointChange);
  };

  mousePointInStage = (point: Point, stage: IStageApis) => {
    const { size, scale = 1 } = stage.store();
    console.log('sprite:', scale);
    const center = { x: size.width / 2, y: size.height / 2 };
    const mousePoint = { ...point };
    mousePoint.x = center.x + (mousePoint.x - center.x) / scale;
    mousePoint.y = center.y + (mousePoint.y - center.y) / scale;
    return mousePoint;
  };

  publishEvent = (
    mousePoint: Point,
    e: React.MouseEvent | MouseEvent,
    index: number,
    eventType: EventTypeEnum,
  ) => {
    const { sprite, stage } = this.props;
    const { x, y } = sprite.attrs.coordinate;
    // 计算在不旋转的情况下的坐标点
    const point = getOriginMousePointInSprite(e, sprite.attrs, stage);
    // 派发锚点变化事件
    stage.apis.$event.emit(eventType, {
      point: {
        ...mousePoint,
        x: point.x - x,
        y: point.y - y,
      },
      mousePoint,
      index,
      e,
      sprite,
      stage,
    });
  };

  handleMouseDown = (mousePoint: Point, e: React.MouseEvent, i: number) => {
    e.stopPropagation();
    this.publishEvent(
      mousePoint,
      e,
      i,
      EventTypeEnum.SpriteAnchorPointMouseDown,
    );
  };

  handleMouseUp = (mousePoint: Point, e: MouseEvent, i: number) => {
    this.setState({ anchorMoving: false });
    this.publishEvent(mousePoint, e, i, EventTypeEnum.SpriteAnchorPointMouseUp);
  };

  render() {
    const { sprite, stage, active } = this.props;
    const { registerSpriteMetaMap } = stage.store();
    const { id, type, attrs } = sprite;
    const meta = registerSpriteMetaMap[type];
    if (!meta || !meta.anchors) {
      return null;
    }
    const { anchors } = meta;
    const {
      getPoints,
      refer = PortReferEnum.sprite,
      pointAttrs = {},
      pointRender,
      moveHide = false,
    } = anchors;
    const { anchorMoving } = this.state;
    if (!active) {
      return null;
    }
    let { points = [] } = anchors;
    if (getPoints) {
      points = getPoints({ sprite, stage } as IContext);
    }
    // 如果是全局坐标系就加上坐标
    if (refer === PortReferEnum.stage) {
      const { x, y } = attrs.coordinate;
      points.forEach((point: Point) => {
        point.x -= x;
        point.y -= y;
      });
    }
    const anchorPointAttrs = {
      filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 0 0 5)',
      ...defaultPointAttrs,
      ...pointAttrs,
    };
    let pointTsx: React.ReactNode = null;
    if (pointRender) {
      pointTsx = pointRender?.({ sprite, stage });
    }
    return (
      <g
        style={{
          display: anchorMoving && moveHide ? 'none' : '',
          pointerEvents: anchorMoving && moveHide ? 'none' : undefined,
        }}>
        {points.map((point: any, i: number) => {
          const { x, y } = point;
          return (
            <g key={i}>
              {pointTsx && (
                <g
                  style={{ cursor: 'pointer' }}
                  {...anchorPointAttrs}
                  transform={`translate(${x},${y})`}>
                  {pointTsx}
                </g>
              )}
              <AnchorPoint
                {...anchorPointAttrs}
                x={x}
                y={y}
                className={`anchor-point-container anchor-point__${type} ${
                  anchorPointAttrs.className || ''
                }`}
                style={{ opacity: pointTsx ? 0 : undefined }}
                data-sprite-id={id}
                data-index={i}
                data-id={`${id}__${i}`}
                id={`sprite-anchor__${id}__${i}`}
                onMouseDown={(p: Point, e: React.MouseEvent) =>
                  this.handleMouseDown(p, e, i)
                }
                onMouseUp={(p: Point, e: MouseEvent) =>
                  this.handleMouseUp(p, e, i)
                }
                onMouseMove={(p: Point, e: MouseEvent) =>
                  this.pointChangeHandle(p, e, i)
                }
                // onChange={(point: Point) => this.pointChangeHandle(point, 'start')}
              />
            </g>
          );
        })}
      </g>
    );
  }
}
