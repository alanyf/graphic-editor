import React from 'react';
import Rhombus from '../../material/graph/rhombus';
import { PortUnitEnum } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta, IDefaultGraphicProps } from '../../interface';

type IProps = IDefaultGraphicProps;

const SpriteType = 'RhombusSprite';

export class RhombusSprite extends BaseSprite<IProps> {
  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    return (
      <>
        <Rhombus
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Rhombus {...props} x={0} y={0} width={width} height={height} />
      </>
    );
  }
}

export const RhombusSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: RhombusSprite,
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

export default RhombusSpriteMeta;
