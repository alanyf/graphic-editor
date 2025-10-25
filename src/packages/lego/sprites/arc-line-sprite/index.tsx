import React from 'react';
import {
  disPointOnLineByEquation,
  distance,
  getPointsBoundingRect,
  startEndPointToLine,
  verticalLineEquation,
} from '@packages/geometry-tools';
import BesselCurve from '../../material/graph/bessel-curve';
import TerminalPoint from '../../material/terminal-point';
import { BaseSprite } from '../BaseSprite';
import { EventTypeEnum } from '../../interface';
import type {
  ISpriteMeta,
  IPointOption,
  IDefaultGraphicProps,
  Point,
} from '../../interface';

interface IProps extends IDefaultGraphicProps {
  start: IPointOption;
  end: IPointOption;
  control: IPointOption;
}

const SpriteType = 'ArcLineSprite';

export class ArcLineSprite extends BaseSprite<IProps> {
  isAddStartPoint: boolean = false;

  pointChangeHandle = (point: Point, prop: string) => {
    const { sprite, stage } = this.props;
    const { id, props } = sprite as any;
    const newProps = {
      [prop]: { ...props[prop], ...point },
    };
    stage.apis.updateSpriteProps(id, newProps);
  };

  handleMouseUp = () => {
    const { sprite, stage } = this.props;
    const { id, props, attrs } = sprite;
    const { coordinate } = attrs;
    const { start, end, control } = props;
    const points = [start, end, control];
    const { x, y, width, height } = getPointsBoundingRect(points);
    const newProps = {
      start: { ...start, x: start.x - x, y: start.y - y },
      end: { ...end, x: end.x - x, y: end.y - y },
      control: { ...control, x: control.x - x, y: control.y - y },
    };
    const newAttrs = {
      coordinate: { x: x + coordinate.x, y: y + coordinate.y },
      size: { width, height },
    };
    stage.apis.updateSpriteProps(sprite, newProps);
    stage.apis.updateSpriteAttrs(id, newAttrs);
    this.props.stage.apis.history.recordHistory(); // 记录一次快照
  };

  getControlPoint = (start: IPointOption, end: IPointOption) => {
    const center = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
    const dis = distance(start, end) / 2;
    const line = startEndPointToLine(start, end);
    const equ = verticalLineEquation(line, center);
    const control = disPointOnLineByEquation(equ, center, dis, end.y < start.y);
    return control;
  };

  handleCreateMouseDown = (point: Point) => {
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const { start = {}, end = {}, control = {} } = props;
    const newProps = { ...props };
    if (!this.isAddStartPoint) {
      newProps.start = { ...start, ...point };
      newProps.end = { ...end, ...point };
      newProps.control = { ...control, ...point };
      this.isAddStartPoint = true;
      stage.apis.updateSpriteProps(sprite, newProps);
    } else {
      this.handleMouseUp();
      stage.apis.resetCreatingSprite();
    }
  };

  handleCreateMouseMove = (point: Point) => {
    if (!this.isAddStartPoint) {
      return;
    }
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const { start, end, control } = props;
    const newProps = { ...props };
    newProps.end = { ...end, ...point };
    newProps.control = { ...control, ...this.getControlPoint(start, end) };
    stage.apis.updateSpriteProps(sprite, newProps);
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    const propsArr = ['start', 'control', 'end'];
    this.pointChangeHandle(point, propsArr[index]);
  };

  handleAnchorMouseUp = ({ sprite }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.handleMouseUp();
    this.props.stage.apis.history.recordHistory(); // 记录一次快照
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

  renderEndPoints = (
    start: IPointOption,
    end: IPointOption,
    control: IPointOption,
  ) => {
    const { stroke, strokeWidth } = this.props.sprite.props;
    return (
      <>
        <TerminalPoint
          arrowUseStroke={true}
          option={{ stroke, fill: stroke, strokeWidth, ...start }}
          start={control}
        />
        <TerminalPoint
          arrowUseStroke={true}
          option={{ stroke, fill: stroke, strokeWidth, ...end }}
          start={control}
        />
      </>
    );
  };

  render() {
    const { sprite } = this.props;
    const { props } = sprite;
    const { start, end, control } = props;
    return (
      <g>
        <BesselCurve
          start={start}
          control={control}
          end={end}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <BesselCurve
          fill="none"
          {...props}
          start={start}
          control={control}
          end={end}
        />
        {this.renderEndPoints(start, end, control)}
      </g>
    );
  }
}

export const ArcLineSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: ArcLineSprite,
  operation: {
    canOperate: false,
  },
  initProps: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    control: { x: 0, y: 0 },
  },
  initAttrs: {
    coordinate: { x: 0, y: 0 },
    size: { width: 0, y: 0 },
    creating: true,
  } as any,
  anchors: {
    getPoints: ({ sprite }) => {
      const { start, end, control } = sprite.props as IProps;
      return [start, control, end];
    },
  },
};

export default ArcLineSpriteMeta;
