import React from 'react';
import type { ISpriteMeta } from '../../interface';
import { BaseSprite } from '../BaseSprite';

interface IProps {
  width: number;
  height: number;
  content: string;
}

const SpriteType = 'TextSprite';

export class TextSprite extends BaseSprite<IProps> {
  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    return (
      <foreignObject
        {...props}
        x={0}
        y={0}
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          border: '1px solid #aaa',
          padding: '3px 5px',
          userSelect: 'none',
        }}>
        <div
          style={{ height: '100%', outline: 'none' }}
          contentEditable={attrs.editing}
          dangerouslySetInnerHTML={{ __html: props.content }}></div>
      </foreignObject>
    );
  }
}

export const TextSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: TextSprite,
  initProps: {
    width: 100,
    height: 40,
    content: '',
  },
};

export default TextSpriteMeta;
