import React from 'react';
import Ellipse from '../../material/graph/ellipse';
import type { IDefaultGraphicProps, ISpriteMeta } from '../../interface';
import { BaseSprite } from '../BaseSprite';

type IProps = IDefaultGraphicProps;

const SpriteType = 'EllipseSprite';

export class EllipseSprite extends BaseSprite<IProps> {
  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    return (
      <>
        <Ellipse
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Ellipse {...props} x={0} y={0} width={width} height={height} />
      </>
    );
  }
}

export const EllipseSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: EllipseSprite,
  centerText: { editable: true },
};

export default EllipseSpriteMeta;
