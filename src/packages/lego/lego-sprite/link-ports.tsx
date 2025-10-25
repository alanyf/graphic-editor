import React from 'react';
import type {
  ISprite,
  IStageApis,
  IContext,
  ISpriteMeta,
  Point,
} from '../interface';
import { PortReferEnum, PortUnitEnum } from '../interface';
import { getOriginMousePointInSprite } from '../utils/tools';

interface IProps {
  sprite: ISprite;
  stage: IStageApis;
  isShowLinkPoints: boolean;
}

export default class LinkPointsRender extends React.Component<IProps> {
  pointChangeHandle = (mousePoint: Point, e: MouseEvent, index: number) => {
    const { sprite, stage } = this.props;
    this.setState({ anchorMoving: true });
    const { coordinate } = stage.store();
    const point = getOriginMousePointInSprite(e, sprite.attrs, stage);
    stage.apis.$event.emit('AnchorPointChange', {
      point: { ...mousePoint, ...point },
      mousePoint,
      index,
      e,
      sprite,
      stage,
    });
  };

  render() {
    const { sprite, stage, isShowLinkPoints } = this.props;
    const { registerSpriteMetaMap } = stage.store();
    const { id, type, attrs } = sprite;
    const meta = registerSpriteMetaMap[type];
    if (!meta || !meta.ports || !isShowLinkPoints) {
      return null;
    }
    const info = {
      ...attrs.coordinate,
      ...attrs.size,
    };
    const { ports } = meta;
    const {
      getPoints,
      render,
      unit = PortUnitEnum.px,
      refer = PortReferEnum.sprite,
    } = ports;
    const radius = 6;
    let { points = [] } = ports;
    if (getPoints) {
      points = getPoints({ sprite, stage } as IContext);
    }
    if (render) {
      return render({ sprite, stage });
    }
    if (points.length === 0) {
      return null;
    }
    const jsonData = {
      spriteId: id,
      id: '',
      index: 0,
    };
    return (
      <>
        {points.map((point: any, i: number) => {
          let { x, y } = point;
          if (unit === PortUnitEnum.percent) {
            x = (info.width / 100) * x;
            y = (info.height / 100) * y;
          }
          return (
            <g key={i}>
              <circle
                r={radius + 3}
                cx={x}
                cy={y}
                fill="transparent"
                className={`link-port-point-container link-port-point__${type}`}
                style={{ cursor: 'pointer' }}
                id={`sprite-port__${id}__${i}`}
                data-port-json={JSON.stringify({
                  ...jsonData,
                  ...point,
                  index: i,
                  id: `sprite-port__${id}__${i}`,
                })}
              />
              <circle
                r={radius}
                cx={x}
                cy={y}
                fill="#fff"
                stroke="#000"
                strokeWidth="1"
                className={`link-port-point-container link-port-point__${type}`}
                style={{ pointerEvents: 'none' }}
              />
            </g>
          );
        })}
      </>
    );
  }
}
