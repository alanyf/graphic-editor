import React from 'react';
import { VideoPlayer } from '@packages/base-components';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta } from '../../interface';
import './index.less';

interface IProps {
  url: string;
}

const SpriteType = 'VideoSprite';

export class VideoSprite extends BaseSprite<IProps> {
  mouseDownTime: number = 0;

  // // eslint-disable-next-line @typescript-eslint/typedef
  // readonly state = {
  //   tipText: '',
  // };

  showTipText = (tipText: string, duration = 3000) => {
    this.setState({ tipText });
    setTimeout(() => {
      this.setState({ tipText: '' });
    }, duration);
  };

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
      <g className="video-sprite-content">
        {
          <foreignObject
            width={width}
            height={height}
            x={0}
            y={0}
            style={{ overflow: 'visible', cursor: 'default' }}>
            <VideoPlayer width={width} height={height} url={url} />
            {editing && (
              <div
                className="video-sprite-panel"
                style={{ top: `${-50}px` }}
                onMouseDown={(e: any) => e.stopPropagation()}>
                <div className="video-sprite-row-item">
                  <label className="video-sprite-row-label">链接</label>：
                  <input
                    className="video-sprite-row-input"
                    value={url}
                    onChange={(e: any) =>
                      this.handleChange('url', e.target.value)
                    }
                  />
                </div>
              </div>
            )}
            {/* (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'transparent',
                  cursor: 'move',
                }}
                onMouseDown={() => (this.mouseDownTime = Date.now())}
                onClick={() => {
                  if (Date.now() - this.mouseDownTime <= 300) {
                    this.showTipText('双击控制视频播放');
                  }
                }}
              />
            ) */}
            {/* {tipText && (
              <div
                style={{
                  display: 'inline-block',
                  width: 'auto',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderRadius: '5px',
                  padding: '8px 15px',
                  color: '#fff',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  fontSize: 12,
                  transform: 'translate(-50%, -50%)',
                }}>
                {tipText}
              </div>
            )} */}
          </foreignObject>
        }
      </g>
    );
  }
}

export const VideoSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: VideoSprite,
};

export default VideoSpriteMeta;
