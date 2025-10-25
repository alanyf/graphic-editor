import React, { createRef } from 'react';
import { QRCode } from 'antd';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta } from '../../interface';
import './index.less';

interface IProps {
  url: string;
  // 图片分辨率，图片高宽像素值
  pixelResolution?: number;
}

const SpriteType = 'QrCodeSprite';

export class QrCodeSprite extends BaseSprite<IProps> {

  contentRef = createRef<HTMLDivElement>();

  handleChange = (prop: string, value: any) => {
    const { sprite, stage } = this.props;
    stage.apis.updateSpriteProps(sprite, { [prop]: value });
  };

  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { editing } = attrs;
    const { width, height } = attrs.size;
    const { url, pixelResolution = 300 } = props;
    return (
      <g className="qr-code-sprite-content">
        <foreignObject
          width={width}
          height={height}
          x={0}
          y={0}
          style={{ padding: '0 4px', overflow: 'visible' }}>
          <QRCode value={url} style={{ width: '100%', height: '100%' }} />
        </foreignObject>
        {editing && (
          <foreignObject
            width={300}
            height={60}
            x={0}
            y={0}
            style={{ padding: '0 4px', overflow: 'visible' }}>
            <div
              className="qr-code-sprite-panel"
              style={{ top: `${height + 5}px` }}
              onMouseDown={(e: any) => e.stopPropagation()}>
              <div className="qr-code-sprite-row-item">
                <label className="qr-code-sprite-row-label">src</label>：
                <input
                  className="qr-code-sprite-row-input"
                  value={url}
                  onChange={(e: any) =>
                    this.handleChange('url', e.target.value)
                  }
                />
              </div>
              <div className="qr-code-sprite-row-item">
                <label className="qr-code-sprite-row-label">分辨率(px)</label>：
                <input
                  className="qr-code-sprite-row-input"
                  type='number'
                  value={pixelResolution}
                  min={100}
                  max={1000}
                  onChange={(e: any) => {
                    this.handleChange('pixelResolution', Math.max(100, e.target.value) || 100);
                  }}
                />
              </div>
            </div>
          </foreignObject>
        )}
      </g>
    );
  }
}

export const QrCodeSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: QrCodeSprite,
  operation: {
    resizeLock: true,
  },
  initProps: {
    url: 'https://baidu.com',
  },
};

export default QrCodeSpriteMeta;
