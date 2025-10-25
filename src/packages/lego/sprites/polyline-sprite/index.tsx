import React from 'react';
import { getPointsBoundingRect } from '@packages/geometry-tools';
import Polyline from '../../material/graph/polyline';
import SmoothCurve from '../../material/graph/smooth-curve';
import type { IDefaultGraphicProps, ISpriteMeta, Point } from '../../interface';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  points: Point[];
  smooth?: boolean;
  curvature?: number;
}

const SpriteType = 'PolylineSprite';

export class PolylineSprite extends BaseSprite<IProps> {
  pointChangeHandle = (point: Point, index: number) => {
    const { sprite } = this.props;
    const points = [...sprite.props.points];
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

  handleCreateMouseDown = (point: Point) => {
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const { points: originPoints = [] } = props;
    const points = [...originPoints];
    points.pop();
    points.push(point);
    points.push({ ...point });
    stage.apis.updateSpriteProps(sprite, { points });

    stage.apis.setActiveSpriteList([sprite]);
  };

  handleCreateMouseMove = (point: Point) => {
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const { points: originPoints = [] } = props;
    const points = [...originPoints];
    points[points.length - 1] = point;
    stage.apis.updateSpriteProps(sprite, { points });
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.pointChangeHandle(point, index);
  };

  handleAnchorMouseUp = ({ sprite }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.props.stage.apis.history.recordHistory(); // 记录一次快照
  };

  handleOk = ({ sprite: clickSprite }: any) => {
    const { sprite, stage } = this.props;
    const { id, props } = sprite as any;
    if (id !== clickSprite.id) {
      return;
    }
    const { stageDom } = stage.store();
    const { points: originPoints = [] } = props;
    let points = [...originPoints];
    const { width, height, x, y } = getPointsBoundingRect(points);
    points.pop();
    points = points.map((p: Point) => ({ x: p.x - x, y: p.y - y }));
    stage.apis.updateSpriteAttrs(sprite, {
      size: { width, height },
      coordinate: { x, y },
    });
    stage.apis.updateSpriteProps(sprite, { points });

    stage.apis.resetCreatingSprite();
    stageDom.removeEventListener('mousemove', this.handleCreateMouseMove);
    stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointMouseDown,
      this.handleOk,
    );
  };

  componentDidMount() {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    if (attrs.creating) {
      stage.apis.$event.on(
        EventTypeEnum.SpriteAnchorPointMouseDown,
        this.handleOk,
      );
      stage.apis.startCreatingSprite({
        sprite,
        onMouseDown: this.handleCreateMouseDown,
        onMouseMove: this.handleCreateMouseMove,
      });
    }
    stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
    stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointMouseUp,
      this.handleAnchorMouseUp,
    );
  }

  componentWillUnmount() {
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointMouseDown,
      this.handleOk,
    );
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointMouseUp,
      this.handleAnchorMouseUp,
    );
  }

  render() {
    const { sprite } = this.props;
    const { props } = sprite;
    const { points = [], smooth = false, curvature = 0.4, ...rest } = props;
    return (
      <g>
        {!smooth ? (
          <>
            <Polyline
              {...props}
              points={points}
              strokeWidth={6}
              strokeDasharray="none"
              stroke="transparent"
            />
            <Polyline {...rest} {...props} points={points} />
          </>
        ) : (
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

export const PolylineSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: PolylineSprite,
  operation: {
    canResize: false,
  },
  initProps: {
    points: [],
  },
  initAttrs: {
    creating: true,
    coordinate: { x: 0, y: 0 },
  } as any,
  anchors: {
    getPoints: ({ sprite }) => {
      const { creating } = sprite.attrs;
      const { points = [] } = sprite.props as IProps;
      if (creating) {
        return [...points].slice(0, -1);
      }
      return [...points];
    },
  },
};

export default PolylineSpriteMeta;
