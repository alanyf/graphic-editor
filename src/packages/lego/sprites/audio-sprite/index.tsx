import React from 'react';
import { AudioPlayer } from '@packages/base-components';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta } from '../../interface';
import './index.less';

interface IProps {
  url: string;
}

const SpriteType = 'AudioSprite';

export class AudioSprite extends BaseSprite<IProps> {
  handleChange = (prop: string, value: string) => {
    const { sprite, stage } = this.props;
    stage.apis.updateSpriteProps(sprite, { [prop]: value });
  };

  render() {
    const { sprite, active } = this.props;
    const { props, attrs } = sprite;
    const { editing } = attrs;
    const { width, height } = attrs.size;
    const { url } = props;
    return (
      <g className="audio-sprite-content">
        {
          <foreignObject
            style={{
              overflow: 'visible',
            }}
            width={width}
            height={height}
            x={0}
            y={0}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                padding: 10,
              }}>
              <AudioPlayer
                style={{ cursor: 'default' }}
                width="100%"
                height={height - 20}
                url={url}
              />
            </div>
            {editing && (
              <div
                className="audio-sprite-panel"
                style={{ top: `${-50}px` }}
                onMouseDown={(e: any) => e.stopPropagation()}>
                <div className="audio-sprite-row-item">
                  <label className="audio-sprite-row-label">链接</label>：
                  <input
                    className="audio-sprite-row-input"
                    value={url}
                    onChange={(e: any) =>
                      this.handleChange('url', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </foreignObject>
        }
      </g>
    );
  }
}

export const AudioSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: AudioSprite,
};

export default AudioSpriteMeta;
