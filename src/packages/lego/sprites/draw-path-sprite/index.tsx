import React from 'react';
import { distance, getPointsBoundingRect } from '@packages/geometry-tools';
import type { IDefaultGraphicProps, Point, ISpriteMeta } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';
import Polyline from '../../material/graph/polyline';
import SmoothCurve from '../../material/graph/smooth-curve';

interface IProps extends IDefaultGraphicProps {
  points: Point[];
  pointDis?: number;
  curvature?: number;
}

const SpriteType = 'DrawPathSprite';

export class DrawPathSprite extends BaseSprite<IProps> {
  pointChangeHandle = (point: Point, index: number) => {
    const { sprite } = this.props;
    const { props } = sprite;
    const points = [...props.points];
    points[index] = { ...point };
    this.updateSprite(points);
  };

  updateSprite = (points: Point[]) => {
    const { sprite, stage } = this.props;
    const { coordinate } = sprite.attrs;
    const { width, height, x, y } = getPointsBoundingRect(points);
    const newPoints = points.map((p: Point) => ({ x: p.x - x, y: p.y - y }));
    stage.apis.updateSpriteProps(sprite, { points: newPoints });
    stage.apis.updateSpriteAttrs(sprite, {
      size: { width, height },
      coordinate: { x: x + coordinate.x, y: y + coordinate.y },
    });
  };

  handleMouseUp = () => {
    const { stage, sprite } = this.props;
    stage.apis.updateSpriteList([], true);
    this.updateSprite(sprite.props.points);
    stage.apis.resetCreatingSprite();
  };

  handleCreateMouseDown = () => {
    const { stage, sprite } = this.props;
    stage.apis.updateSpriteAttrs(sprite, {
      size: { width: 0, height: 0 },
      coordinate: { x: 0, y: 0 },
    });
  };

  handleCreateMouseMove = (point: Point) => {
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const { points: originPoints = [], pointDis = 10 } = props;
    const points = [...originPoints];
    if (
      points.length === 0 ||
      distance(points[points.length - 1], point) > pointDis
    ) {
      points.push(point);
      stage.apis.updateSpriteProps(sprite, { points });
    }
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.pointChangeHandle(point, index);
  };

  componentDidMount() {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    if (attrs.creating) {
      stage.apis.startCreatingSprite({
        sprite,
        onMouseDown: this.handleCreateMouseDown,
        onMouseMove: this.handleCreateMouseMove,
        onMouseUp: this.handleMouseUp,
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
    const { attrs, props } = sprite;
    const { creating } = attrs;
    const { points = [], curvature = 0.4, ...rest } = props;
    return (
      <g>
        {creating && <Polyline {...rest} points={points} />}
        {!creating && (
          <>
            <SmoothCurve
              points={points}
              curvature={curvature}
              stroke="transparent"
              strokeDasharray="none"
              strokeWidth={6}
            />
            <SmoothCurve {...rest} points={points} curvature={curvature} />
          </>
        )}
      </g>
    );
  }
}

export const DrawPathSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: DrawPathSprite,
  operation: {
    canResize: false,
  },
  initProps: {
    points: [],
    pointDis: 20,
  },
  initAttrs: {
    coordinate: { x: 0, y: 0 },
    size: { width: 100, height: 100 },
    creating: true,
  } as any,
  anchors: {
    pointAttrs: {
      radius: 3,
    },
    getPoints: ({ sprite }) => {
      const { points = [] } = sprite.props as IProps;
      return [...points];
    },
  },
};

export default DrawPathSpriteMeta;
