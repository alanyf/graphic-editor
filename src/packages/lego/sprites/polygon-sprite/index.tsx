import React from 'react';
import { getPointsBoundingRect } from '@packages/geometry-tools';
import Polygon from '../../material/graph/polygon';
import type {
  IDefaultGraphicProps,
  ISpriteMeta,
  IContext,
  Point,
} from '../../interface';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';

interface IProps extends IDefaultGraphicProps {
  points: Point[];
}

const SpriteType = 'PolygonSprite';

export class PolygonSprite extends BaseSprite<IProps> {
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

  handleClickEdge = (index: number) => {
    const { sprite, stage } = this.props;
    const points = [...sprite.props.points];
    const current = points[index];
    const next = points[index === points.length - 1 ? 0 : index + 1];
    const point: Point = {
      x: (current.x + next.x) / 2,
      y: (current.y + next.y) / 2,
    };
    points.splice(index + 1, 0, point);
    stage.apis.updateSpriteProps(sprite, { points }, true);
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
    const { points: originPoints = [] } = props;
    let points = [...originPoints];
    const { width, height, x, y } = getPointsBoundingRect(points);
    points.pop();
    points = points.map((p: Point) => ({ x: p.x - x, y: p.y - y }));
    stage.apis.updateSpriteProps(sprite, { points });
    stage.apis.updateSpriteAttrs(sprite, {
      size: { width, height },
      coordinate: { x, y },
    });

    stage.apis.resetCreatingSprite();
    stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointMouseDown,
      this.handleOk,
    );
  };

  componentDidMount() {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    if (attrs.creating) {
      stage.apis.startCreatingSprite({
        sprite,
        onMouseDown: this.handleCreateMouseDown,
        onMouseMove: this.handleCreateMouseMove,
      });
      this.props.stage.apis.$event.on(
        EventTypeEnum.SpriteAnchorPointMouseDown,
        this.handleOk,
      );
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
    const { props, attrs } = sprite;
    const { points = [], ...rest } = props;
    return (
      <g>
        {!attrs.creating && (
          <Polygon
            {...props}
            points={points}
            strokeWidth={6}
            stroke="transparent"
            fill="none"
          />
        )}
        {!attrs.creating && (
          <Polygon
            {...props}
            points={points}
            onClickEdge={this.handleClickEdge}
          />
        )}
        {attrs.creating && (
          <Polygon
            {...props}
            points={points}
            stroke="none"
            fill="rgba(240,240,240,0.5)"
          />
        )}
        {attrs.creating &&
          points.map((point: Point, i: number) => {
            if (i === points.length - 1) {
              return null;
            }
            const next = points[i === points.length - 1 ? 0 : i + 1];
            return (
              <>
                <line
                  key={i}
                  x1={point.x}
                  y1={point.y}
                  x2={next.x}
                  y2={next.y}
                  stroke="#000"
                  strokeWidth="1"
                  {...rest}
                />
              </>
            );
          })}
      </g>
    );
  }
}

export const PolygonSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: PolygonSprite,
  operation: {
    canResize: false,
  },
  initProps: {
    points: [],
  },
  initAttrs: {
    creating: true,
    coordinate: { x: 0, y: 0 },
    anchors: [],
  } as any,
  anchors: {
    getPoints: ({ sprite }: IContext) => {
      const { creating } = sprite.attrs;
      const { points = [] } = sprite.props as IProps;
      if (creating) {
        return [...points].slice(0, -1);
      }
      return [...points];
    },
  },
};

export default PolygonSpriteMeta;
