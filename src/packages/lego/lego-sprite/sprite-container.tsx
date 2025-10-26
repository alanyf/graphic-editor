import React from 'react';
import type { ICoordinate, ISize, ISprite } from '../interface';

interface IProps {
  sprite: ISprite;
  className?: string;
  children?: React.ReactNode;
}

export default class LegoSpriteContainer extends React.Component<IProps> {
  render() {
    const { sprite, className, children } = this.props;
    const { id, attrs, type } = sprite;
    const { size = {}, coordinate = {}, angle = 0 } = attrs;
    const { width = 0, height = 0 } = size as ISize;
    const { x = 0, y = 0 } = coordinate as ICoordinate;
    const rotateStr = `rotate(${angle || 0}, ${x + width / 2} ${
      y + height / 2
    })`;
    const translateStr = `translate(${x},${y})`;
    return (
      <g
        className={className}
        data-id={id}
        data-sprite-type={type}
        transform={`${angle === 0 ? '' : rotateStr} ${translateStr}`}>
        {/* <rect x={0} y={0} width={width} height={height} fill="transparent" strokeWidth={0} style={{ pointerEvents: 'none' }} /> */}
        {children}
      </g>
    );
  }
}
