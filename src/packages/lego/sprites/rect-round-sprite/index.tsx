import React from 'react';
import { getPointsBoundingRect } from '@packages/geometry-tools';
import RectRound from '../../material/graph/rect-round';
import { EventTypeEnum, PortUnitEnum } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import type {
  ISpriteMeta,
  IDefaultGraphicProps,
  Point,
  ISpriteAttrs,
} from '../../interface';

interface IProps extends IDefaultGraphicProps {
  borderRadius?: number;
  content?: string;
}

const SpriteType = 'RectRoundSprite';

export class RectRoundSprite extends BaseSprite<IProps> {
  mouseStartPoint: Point = { x: 0, y: 0 };

  handleAnchorChange = ({ point, sprite: changeSprite }: any) => {
    const { sprite, stage } = this.props;
    if (changeSprite.id !== this.props.sprite.id) {
      return;
    }
    const { attrs } = sprite;
    const { width, height } = attrs.size;
    const len = Math.min(width, height);
    const x = Math.max(0, Math.min(len / 2, point.x));
    const borderRadius = (100 * x) / len;

    stage.apis.updateSpriteProps(sprite, { borderRadius });
  };

  handleCreateMouseDown = (point: Point) => {
    this.mouseStartPoint = { ...point };
  };

  handleCreateMouseMove = (point: Point) => {
    const { sprite, stage } = this.props;

    const { width, height, x, y } = getPointsBoundingRect([
      this.mouseStartPoint,
      point,
    ]);
    const newAttrs = {
      coordinate: { x, y },
      size: { width, height },
    };
    stage.apis.updateSpriteAttrs(sprite, newAttrs);
  };

  handleCreateMouseUp = () => {
    const { stage } = this.props;
    stage.apis.resetCreatingSprite();
  };

  componentDidMount() {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    if (attrs.creating) {
      const newAttrs = {
        ...sprite.attrs,
        size: { width: 0, height: 0 },
      };
      stage.apis.updateSpriteAttrs(sprite, newAttrs);
      stage.apis.startCreatingSprite({
        sprite,
        onMouseDown: this.handleCreateMouseDown,
        onMouseMove: this.handleCreateMouseMove,
        onMouseUp: this.handleCreateMouseUp,
      });
    }

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
    const { borderRadius = 30 } = props;
    const { width, height } = attrs.size;
    const r = (borderRadius / 100) * Math.min(width, height);
    return (
      <>
        <RectRound
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          borderRadius={r}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <RectRound
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          borderRadius={r}
        />
      </>
    );
  }
}

export const RectRoundSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: RectRoundSprite,
  initAttrs: {
    creating: true,
    size: { width: 0, height: 0 },
  } as ISpriteAttrs,
  initProps: { borderRadius: 30 },
  centerText: { editable: true },
  ports: {
    unit: PortUnitEnum.percent,
    points: [
      { x: 50, y: 0, arcAngle: 270 },
      { x: 50, y: 100, arcAngle: 90 },
      { x: 0, y: 50, arcAngle: 180 },
      { x: 100, y: 50, arcAngle: 0 },
    ],
  },
  anchors: {
    getPoints: ({ sprite }) => {
      const { attrs } = sprite;
      const { width, height } = attrs.size;
      const { borderRadius = 0 } = sprite.props as IProps;
      const r = (borderRadius / 100) * Math.min(width, height);
      return [{ x: r, y: 0 }];
    },
  },
};

export default RectRoundSpriteMeta;
