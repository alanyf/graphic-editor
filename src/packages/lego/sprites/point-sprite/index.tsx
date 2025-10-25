import React from 'react';
import type { IDefaultGraphicProps, ISpriteMeta, Point } from '../../interface';
import { BaseSprite } from '../BaseSprite';

type IProps = IDefaultGraphicProps;

const SpriteType = 'PointSprite';

export class PointSprite extends BaseSprite<IProps> {
  anchorPointList: any[] = [];

  pointChangeHandle = (point: Point) => {
    const { sprite, stage } = this.props;
    stage.apis.updateSpriteAttrs(sprite, { coordinate: point });
  };

  render() {
    const { sprite } = this.props;
    const { attrs, props } = sprite;
    const { width, height } = attrs.size;
    const space = 4;
    const radius = Math.max(Math.min(width, height) / 2 - space, 0);
    return (
      <>
        <circle
          {...props}
          cx={width / 2}
          cy={height / 2}
          r={radius}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <circle
          style={{ cursor: 'pointer' }}
          fill="#f6f6f6"
          stroke="#000"
          strokeWidth={1}
          {...props}
          cx={width / 2}
          cy={height / 2}
          r={radius}
        />
      </>
    );
  }
}

export const PointSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: PointSprite,
  operation: {
    resizeLock: true,
  },
  initAttrs: {
    coordinate: { x: 100, y: 100 },
    size: { width: 18, height: 18 },
  } as any,
};

export default PointSpriteMeta;
