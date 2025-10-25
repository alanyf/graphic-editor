import React from 'react';
import { DrawCanvas } from '@packages/base-components';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta, IDefaultGraphicProps, ISize } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  base64?: string;
  imageSize: ISize;
}

const SpriteType = 'DrawBoardSprite';

export class DrawBoardSprite extends BaseSprite<IProps> {
  handleFinish = ({ base64 = '', width, height }: any) => {
    const { stage, sprite } = this.props;
    stage.apis.updateSpriteProps(sprite, {
      base64,
      imageSize: {
        width,
        height,
      },
    });
  };

  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { editing } = attrs;
    const { width, height } = attrs.size;
    const { base64, imageSize, ...rest } = props;
    return (
      <g>
        {editing && (
          <foreignObject
            {...rest}
            width={width}
            height={height}
            style={{
              position: 'relative',
              overflow: 'visible',
              userSelect: 'none',
            }}
            onMouseDown={(e: any) => e.stopPropagation()}>
            <DrawCanvas
              initImage={base64}
              width={width}
              height={height}
              onFinish={this.handleFinish}
            />
          </foreignObject>
        )}
        {!editing &&
          (base64 ? (
            <image
              xlinkHref={base64}
              width={imageSize.width}
              height={imageSize.height}
            />
          ) : (
            <rect
              width={width}
              height={height}
              stroke="#aaa"
              strokeWidth="1"
              fill="transparent"
            />
          ))}
      </g>
    );
  }
}

export const DrawBoardSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: DrawBoardSprite,
  // operation: {
  //   resizeLock: true,
  // },
};

export default DrawBoardSpriteMeta;
