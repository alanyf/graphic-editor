import React from 'react';
import { PortUnitEnum } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta, IDefaultGraphicProps } from '../../interface';

type IProps = IDefaultGraphicProps;

const SpriteType = 'GroupSprite';

export class GroupSprite extends BaseSprite<IProps> {
  render() {
    const { sprite, children } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    return (
      <>
        <g {...props}>
          <rect
            x={0}
            y={0}
            width={width}
            height={height}
            stroke="none"
            fill="transparent"
          />
          {children}
        </g>
      </>
    );
  }
}

export const GroupSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: GroupSprite,
  ports: {
    unit: PortUnitEnum.percent,
    points: [
      { x: 50, y: 0, arcAngle: 270 },
      { x: 50, y: 100, arcAngle: 90 },
      { x: 0, y: 50, arcAngle: 180 },
      { x: 100, y: 50, arcAngle: 0 },
    ],
  },
};

export default GroupSpriteMeta;
