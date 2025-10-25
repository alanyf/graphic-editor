import React from 'react';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta } from '../../interface';
import './index.less';

interface IProps {
  url: string;
}

const SpriteType = 'ImageSprite';

export class ImageSprite extends BaseSprite<IProps> {
  handleChange = (prop: string, value: string) => {
    const { sprite, stage } = this.props;
    stage.apis.updateSpriteProps(sprite, { [prop]: value });
  };

  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { editing } = attrs;
    const { width, height } = attrs.size;
    const { url } = props;
    return (
      <g className="image-sprite-content">
        <image xlinkHref={url} x={0} y={0} width={width} height={height} />
        {editing && (
          <foreignObject
            width={300}
            height={30}
            x={0}
            y={0}
            style={{ padding: '0 4px', overflow: 'visible' }}>
            <div
              className="image-sprite-panel"
              style={{ top: `${height + 5}px` }}
              onMouseDown={(e: any) => e.stopPropagation()}>
              <div className="image-sprite-row-item">
                <label className="image-sprite-row-label">src</label>：
                <input
                  className="image-sprite-row-input"
                  value={url}
                  onChange={(e: any) =>
                    this.handleChange('url', e.target.value)
                  }
                />
              </div>
            </div>
          </foreignObject>
        )}
      </g>
    );
  }
}

export const ImageSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: ImageSprite,
  operation: {
    resizeLock: true,
  },
  initProps: {
    url: '/img',
  },
};

export default ImageSpriteMeta;
