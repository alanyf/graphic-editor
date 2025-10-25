import React from 'react';
import { lineAngle } from '@packages/geometry-tools';
import FanShaped, { getPointByAngle } from '../../material/graph/fan-shaped';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';
import type { ISpriteMeta, IDefaultGraphicProps, Point } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  startAngle: number;
  endAngle: number;
}

const SpriteType = 'FanShapedSprite';

export class FanShapedSprite extends BaseSprite<IProps> {
  pointChangeHandle = (point: Point, prop: 'start' | 'end') => {
    const { sprite, stage } = this.props;
    const { id, attrs } = sprite;
    const { width, height } = attrs.size;
    const center = { x: width / 2, y: height / 2 };
    let angle = lineAngle(center, point);
    angle = angle < 0 ? 360 + angle : angle;
    angle = Math.round(angle);
    const reverse = false;
    const newProps = {
      [`${prop}Angle`]: angle,
      reverse,
    };
    stage.apis.updateSpriteProps(id, newProps);
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.pointChangeHandle(point, index === 0 ? 'start' : 'end');
  };

  componentDidMount() {
    this.props.stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
  }

  componentWillUnmount() {
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
  }

  render() {
    const { sprite, active } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    const { startAngle, endAngle, ...rest } = props;
    return (
      <g>
        <FanShaped
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <FanShaped
          {...rest}
          startAngle={startAngle}
          endAngle={endAngle}
          showAngle={active}
          showArc={active}
          x={0}
          y={0}
          width={width}
          height={height}
        />
      </g>
    );
  }
}

export const FanShapedSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: FanShapedSprite,
  initProps: {
    startAngle: 0,
    endAngle: 270,
  },
  anchors: {
    pointRender: () => {
      const r = 4;
      return (
        <path
          fill={'orange'}
          stroke={'#fff'}
          transform="rotate(45)"
          filter={'drop-shadow(rgba(0, 0, 0, 0.32) 0 2.38213 7.1464'}
          d={`M${-r},${-r}  L${r},${-r} L${r},${r}  L${-r},${r}  Z`}
        />
      );
    },
    getPoints: ({ sprite }) => {
      const { attrs } = sprite;
      const { width, height } = attrs.size;
      const { startAngle, endAngle } = sprite.props as IProps;
      const rx = width / 2;
      const ry = height / 2;
      const startPoint = getPointByAngle(startAngle, rx, ry);
      const endPoint = getPointByAngle(endAngle, rx, ry);
      return [startPoint, endPoint];
    },
  },
};

export default FanShapedSpriteMeta;
