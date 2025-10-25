import React from 'react';
import Pentagon from '../../material/graph/pentagon';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta, IDefaultGraphicProps } from '../../interface';

type IProps = IDefaultGraphicProps;

const SpriteType = 'PentagonSprite';

export class PentagonSprite extends BaseSprite<IProps> {
  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    return (
      <>
        <Pentagon
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Pentagon {...props} x={0} y={0} width={width} height={height} />
      </>
    );
  }
}

export const PentagonSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: PentagonSprite,
};

export default PentagonSpriteMeta;
