import React from 'react';
import Cuboid from '../../material/graph/cuboid';
import type { IDefaultGraphicProps, ISpriteMeta, Point } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  lengthX?: number;
  lengthY?: number;
}

const SpriteType = 'CuboidSprite';

export class CuboidSprite extends BaseSprite<IProps> {
  pointChangeHandle = (point: Point, props: string) => {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    const { size } = attrs;
    let offset = 0;
    const { width, height } = size;
    if (props === 'lengthX') {
      offset = Math.min(Math.max(point.x / width, 0), 1) * 100;
    } else if (props === 'lengthY') {
      offset = Math.min(Math.max((height - point.y) / height, 0), 1) * 100;
    }
    stage.apis.updateSpriteProps(sprite, { [props]: offset });
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.pointChangeHandle(point, index === 0 ? 'lengthX' : 'lengthY');
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
        <Cuboid
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Cuboid {...props} x={0} y={0} width={width} height={height} />
      </>
    );
  }
}

export const CuboidSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: CuboidSprite,
  initProps: {
    lengthX: 70,
    lengthY: 70,
  },
  anchors: {
    getPoints: ({ sprite }) => {
      const { attrs } = sprite;
      const { width, height } = attrs.size;
      const { lengthX = 0, lengthY = 0 } = sprite.props as IProps;
      return [
        { x: (width * lengthX) / 100, y: height },
        { x: 0, y: height - (height * lengthY) / 100 },
      ];
    },
  },
};

export default CuboidSpriteMeta;
