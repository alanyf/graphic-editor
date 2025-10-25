import React from 'react';
import { Parallelogram } from '../../material';
import type { IDefaultGraphicProps, ISpriteMeta, Point } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  offset?: number;
}

const SpriteType = 'ParallelogramSprite';

export class ParallelogramSprite extends BaseSprite<IProps> {
  pointChangeHandle = (point: Point) => {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    const { size } = attrs;
    const offset = Math.min(Math.max(point.x, 0), size.width);
    stage.apis.updateSpriteProps(sprite, { offset });
  };

  handleAnchorChange = ({ point, sprite }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.pointChangeHandle(point);
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
    return (
      <>
        <Parallelogram.default
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Parallelogram.default
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
        />
      </>
    );
  }
}

export const ParallelogramSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: ParallelogramSprite,
  initProps: {
    offset: 10,
  },
  anchors: {
    getPoints: ({ sprite }) => {
      const { offset = 0 } = sprite.props as IProps;
      return [{ x: offset, y: 0 }];
    },
  },
};

export default ParallelogramSpriteMeta;
