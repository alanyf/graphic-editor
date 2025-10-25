import React from 'react';
import type { IDefaultGraphicProps, ISpriteMeta } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import './index.less';

interface IProps extends IDefaultGraphicProps {
  href: string;
  text: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
}

const SpriteType = 'LinkSprite';

export class LinkSprite extends BaseSprite<IProps> {
  handleChange = (name: string, value: string) => {
    const { sprite, stage } = this.props;
    const { updateSpriteProps } = stage.apis;
    updateSpriteProps(sprite, { [name]: value });
  };

  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { editing, size, coordinate } = attrs;
    const { width, height } = size;
    const { x, y } = coordinate;
    const { href = '', text = '', target = '_self' } = props;
    return (
      <>
        {/* {!editing ? (
        <>
          <rect width={width} height={height} x={x} y={y} fill="transparent" />
          <a xlinkHref={href} target="new" style={{ userSelect: 'none' }}>
            <text x={x + 4} y={y + 16} fill="#1890ff" dominantBaseline="end">{text}</text>
          </a>
        </>
      ) : */}

        <foreignObject
          width={width}
          height={height}
          x={0}
          y={0}
          style={{ padding: '0 4px', overflow: 'visible' }}>
          <a
            className="link-sprite-content"
            href={href}
            target={target}
            style={{ color: '#1890ff' }}>
            {text}
          </a>
          {editing && (
            <div
              className="link-sprite-panel"
              style={{ top: `${height + 5}px` }}
              onMouseDown={(e: any) => e.stopPropagation()}>
              <div className="link-sprite-row-item">
                <label className="link-sprite-row-label">文字</label>：
                <input
                  className="link-sprite-row-input"
                  value={text}
                  onChange={(e: any) =>
                    this.handleChange('text', e.target.value)
                  }
                />
              </div>
              <div className="link-sprite-row-item">
                <label className="link-sprite-row-label">链接</label>：
                <input
                  className="link-sprite-row-input"
                  value={href}
                  onChange={(e: any) =>
                    this.handleChange('href', e.target.value)
                  }
                />
              </div>
              <div className="link-sprite-row-item">
                <label className="link-sprite-row-label">新页面打开</label>：
                <input
                  className="link-sprite-row-radio"
                  type="radio"
                  name="target"
                  value={target}
                  checked={target === '_blank'}
                  onChange={() => this.handleChange('target', '_blank')}
                />
                是
                <input
                  className="link-sprite-row-radio"
                  type="radio"
                  name="target"
                  style={{ marginLeft: '10px' }}
                  value={target}
                  checked={target === '_self'}
                  onChange={() => this.handleChange('target', '_self')}
                />
                否
                {/* <div className="button-container primary-button-container">确定</div> */}
              </div>
            </div>
          )}
        </foreignObject>
      </>
    );
  }
}

export const LinkSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: LinkSprite,
  initProps: {
    href: '',
    text: '链接',
    target: '_blank',
  },
};

export default LinkSpriteMeta;
