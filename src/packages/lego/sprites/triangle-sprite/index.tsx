import React from 'react';
import Triangle from '../../material/graph/triangle';
import { EventTypeEnum } from '../../interface';
import type { ISpriteMeta, Point } from '../../interface';
import { BaseSprite } from '../BaseSprite';

interface IProps {
  width: number;
  height: number;
  anchorPointX?: number;
}

const SpriteType = 'TriangleSprite';

export class TriangleSprite extends BaseSprite<IProps> {
  anchorMove = (point: Point) => {
    const { sprite, stage } = this.props;
    const { id, attrs } = sprite;
    const { width } = attrs.size;
    let { x } = point;
    x = Math.max(x, 0);
    x = Math.min(x, width);
    const newProps = { anchorPointX: (100 * x) / width };
    stage.apis.updateSpriteProps(id, newProps);
  };

  handleAnchorChange = ({ point, sprite }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.anchorMove(point);
    // 广播精灵发生了变化
    this.props.stage.apis.$event.emit(EventTypeEnum.UpdateSpriteList, {
      spriteList: [this.props.sprite],
    });
  };

  componentDidMount() {
    this.props.stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
  }

  componentWillUnmount() {
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
  }

  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    const { anchorPointX = 0 } = props;
    return (
      <g>
        <Triangle
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          anchorPointX={(anchorPointX * width) / 100}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Triangle
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          anchorPointX={(anchorPointX * width) / 100}
        />
      </g>
    );
  }
}

export const TriangleSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: TriangleSprite,
  ports: {
    // points: [
    //   { x: 50, y: 0 },
    // ],
    getPoints: ({ sprite }) => {
      const { props } = sprite as any;
      const { anchorPointX = 0 } = props;
      const { width, height } = sprite.attrs.size;
      return [
        { x: (anchorPointX * width) / 100, y: 0, arcAngle: 270 },
        { x: 0, y: height, arcAngle: 180 },
        { x: width, y: height, arcAngle: 0 },
      ];
    },
  },
  initProps: {
    width: 100,
    height: 70,
    anchorPointX: 20,
  },
  anchors: {
    getPoints: ({ sprite }) => {
      const { anchorPointX = 0 } = sprite.props as IProps;
      const { width } = sprite.attrs.size;
      return [{ x: (anchorPointX * width) / 100, y: 0 }];
    },
  },
};

export default TriangleSpriteMeta;
