import React from 'react';
import { getPointsBoundingRect } from '@packages/geometry-tools';
import Line from '../../material/graph/line';
import TerminalPoint from '../../material/terminal-point';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';
import type {
  ISpriteMeta,
  IPointOption,
  IDefaultGraphicProps,
  IContext,
  Point,
  ISprite,
} from '../../interface';
import { getArrowLineEndPoint } from '../../utils/tools';

interface IProps extends IDefaultGraphicProps {
  start: IPointOption;
  end: IPointOption;
}

const SpriteType = 'LineSprite';

export class LineSprite extends BaseSprite<IProps> {
  isAddStartPoint: boolean = false;

  pointChangeHandle = (point: Point, prop: 'start' | 'end') => {
    const { sprite, stage } = this.props;
    const { id, props } = sprite as any;
    const newProps = { [prop]: { ...props[prop], ...point } };
    stage.apis.updateSpriteProps(id, newProps);
  };

  handleAnchorMouseUp = ({ sprite }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.updateSprite();
    this.props.stage.apis.history.recordHistory(); // 记录一次快照
  };

  updateSprite = () => {
    const { sprite, stage } = this.props;
    const { props, attrs } = sprite;
    const { coordinate } = attrs;
    const { start, end } = props;
    const { x, y, width, height } = getPointsBoundingRect([start, end]);
    const newProps = {
      start: { ...start, x: start.x - x, y: start.y - y },
      end: { ...end, x: end.x - x, y: end.y - y },
    };
    const newAttrs = {
      // 要加上精灵坐标的原因是在锚点也能正常触发更新，避免重新计算导致位置偏移到0,0
      coordinate: { x: x + coordinate.x, y: y + coordinate.y },
      size: { width, height },
    };
    stage.apis.updateSpriteProps(sprite, newProps);
    stage.apis.updateSpriteAttrs(sprite, newAttrs);
  };

  handleCreateMouseDown = (point: Point) => {
    const { sprite, stage } = this.props;
    const { props } = sprite as ISprite;
    const newProps = { ...props };
    const { start = {}, end = {} } = newProps;
    if (!this.isAddStartPoint) {
      newProps.start = { ...start, ...point };
      newProps.end = { ...end, ...point };
      this.isAddStartPoint = true;
      stage.apis.updateSpriteProps(sprite, newProps);
    } else {
      this.updateSprite();
      stage.apis.resetCreatingSprite();
      this.props.stage.apis.history.recordHistory(); // 记录一次快照
    }
  };

  handleCreateMouseMove = (point: Point) => {
    if (!this.isAddStartPoint) {
      return;
    }
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    stage.apis.updateSpriteProps(sprite, { end: { ...props.end, ...point } });
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.pointChangeHandle(point, index === 0 ? 'start' : 'end');
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
    }

    this.props.stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
    this.props.stage.apis.$event.on(
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

  renderEndPoints = (start: IPointOption, end: IPointOption) => {
    const { stroke, strokeWidth } = this.props.sprite.props;
    return (
      <>
        <TerminalPoint
          option={{ stroke, fill: stroke, strokeWidth, ...start }}
          start={end}
        />
        <TerminalPoint
          option={{ stroke, fill: stroke, strokeWidth, ...end }}
          start={start}
        />
      </>
    );
  };

  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { creating } = attrs;
    const { start, end } = props;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;
    const { strokeWidth = 1 } = props;
    const { start: startP, end: endP } = getArrowLineEndPoint(
      start,
      end,
      strokeWidth,
    );
    return (
      <g>
        <Line
          {...props}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          strokeWidth={6}
          strokeDasharray="none"
          stroke="transparent"
        />
        <Line {...props} x1={startP.x} y1={startP.y} x2={endP.x} y2={endP.y} />
        {(!creating || (creating && this.isAddStartPoint)) &&
          this.renderEndPoints(start, end)}
      </g>
    );
  }
}

export const LineSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: LineSprite,
  operation: {
    canOperate: false,
  },
  initProps: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
  },
  initAttrs: {
    size: { width: 0, height: 0 },
    coordinate: { x: 0, y: 0 },
    creating: true,
  } as any,
  anchors: {
    getPoints: ({ sprite }: IContext) => {
      const { start, end } = sprite.props as IProps;
      return [{ ...start }, { ...end }];
    },
  },
};

export default LineSpriteMeta;
