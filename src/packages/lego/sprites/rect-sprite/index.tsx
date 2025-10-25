import React from 'react';
import Rect from '../../material/graph/rect';
import { PortUnitEnum } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta, IDefaultGraphicProps } from '../../interface';

type IProps = IDefaultGraphicProps;

const SpriteType = 'RectSprite';

export class RectSprite extends BaseSprite<IProps> {
  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    return (
      <>
        <Rect
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Rect {...props} x={0} y={0} width={width} height={height} />
      </>
    );
  }
}

export const RectSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: RectSprite,
  centerText: { editable: true },
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

export default RectSpriteMeta;
