import React from 'react';
import {
  disPointOnLineByEquation,
  distance,
  getPointsBoundingRect,
  startEndPointToLine,
  verticalLineEquation,
} from '@packages/geometry-tools';
import BesselCubicCurve from '../../material/graph/bessel-cubic-curve';
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
  startControl: IPointOption;
  endControl: IPointOption;
}

const SpriteType = 'CurveSprite';

export class CurveSprite extends BaseSprite<IProps> {
  isAddStartPoint: boolean = false;

  pointChangeHandle = (point: Point, prop: string) => {
    const { sprite, stage } = this.props;
    const { id, props } = sprite as any;
    const newProps = {
      [prop]: {
        ...props[prop],
        ...point,
      },
    };
    stage.apis.updateSpriteProps(id, newProps);
  };

  handleMouseUp = () => {
    const { sprite, stage } = this.props;
    const { id, props, attrs } = sprite;
    const { coordinate } = attrs;
    const { start, end, startControl, endControl } = props;
    const points = [start, end, startControl, endControl];
    const { x, y, width, height } = getPointsBoundingRect(points);
    const newProps = {
      start: { ...start, x: start.x - x, y: start.y - y },
      end: { ...end, x: end.x - x, y: end.y - y },
      startControl: {
        ...startControl,
        x: startControl.x - x,
        y: startControl.y - y,
      },
      endControl: { ...endControl, x: endControl.x - x, y: endControl.y - y },
    };
    const newAttrs = {
      coordinate: { x: x + coordinate.x, y: y + coordinate.y },
      size: { width, height },
    };
    stage.apis.updateSpriteProps(id, newProps);
    stage.apis.updateSpriteAttrs(id, newAttrs);
  };

  getControlPoint = (start: IPointOption, end: IPointOption, rate: number) => {
    const center = {
      x: (start.x + end.x) * rate,
      y: (start.y + end.y) * rate,
    };
    const dis = distance(start, end) / 3;
    const line = startEndPointToLine(start, end);
    const equ = verticalLineEquation(line, center);
    const control = disPointOnLineByEquation(equ, center, dis, end.y < start.y);
    return control;
  };

  handleCreateMouseDown = (point: Point) => {
    const { sprite, stage } = this.props;
    const { props } = sprite as any;
    const newProps = {} as IProps;
    const { start = {}, end = {}, startControl = {}, endControl = {} } = props;
    if (!this.isAddStartPoint) {
      newProps.start = { ...start, ...point };
      newProps.end = { ...end, ...point };
      newProps.startControl = { ...startControl, ...point };
      newProps.endControl = { ...endControl, ...point };
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
    const newProps = {} as IProps;
    const { start, end, startControl, endControl } = props;
    newProps.end = { ...end, ...point };
    newProps.startControl = {
      ...startControl,
      ...this.getControlPoint(start, end, 0.3),
    };
    newProps.endControl = {
      ...endControl,
      ...this.getControlPoint(start, end, 0.7),
    };
    stage.apis.updateSpriteProps(sprite, newProps);
  };

  handleAnchorChange = ({ point, sprite, index }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    const propsArr = ['start', 'end', 'startControl', 'endControl'];
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
    startControl: IPointOption,
    endControl: IPointOption,
  ) => {
    const { stroke, strokeWidth } = this.props.sprite.props;
    return (
      <>
        <TerminalPoint
          arrowUseStroke={true}
          option={{ stroke, fill: stroke, strokeWidth, ...start }}
          start={startControl}
        />
        <TerminalPoint
          arrowUseStroke={true}
          option={{ stroke, fill: stroke, strokeWidth, ...end }}
          start={endControl}
        />
      </>
    );
  };

  render() {
    const { sprite, active } = this.props;
    const { props } = sprite;
    const { start, end, startControl, endControl } = props;
    return (
      <g>
        <BesselCubicCurve
          start={start}
          startControl={startControl}
          endControl={endControl}
          end={end}
          strokeWidth={6}
          stroke="transparent"
        />
        <BesselCubicCurve
          fill="none"
          {...props}
          start={start}
          startControl={startControl}
          endControl={endControl}
          end={end}
        />
        {this.renderEndPoints(start, end, startControl, endControl)}
        {/* <line stroke="#000" strokeWidth="4" x1={end.x} y1={end.y} x2={start.x} y2={start.y} /> */}
        {active && (
          <>
            <line
              stroke="#666"
              strokeWidth={1}
              strokeDasharray="4,4"
              x1={start.x}
              y1={start.y}
              x2={startControl.x}
              y2={startControl.y}
            />
            <line
              stroke="#000"
              strokeWidth={1}
              strokeDasharray="4,4"
              x1={end.x}
              y1={end.y}
              x2={endControl.x}
              y2={endControl.y}
            />
          </>
        )}
      </g>
    );
  }
}

export const CurveSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: CurveSprite,
  operation: {
    canOperate: false,
  },
  initProps: {
    start: { x: 0, y: 0 },
    end: { x: 0, y: 0 },
    startControl: { x: 0, y: 0 },
    endControl: { x: 0, y: 0 },
  },
  initAttrs: {
    coordinate: { x: 0, y: 0 },
    size: { width: 0, y: 0 },
    creating: true,
  } as any,
  anchors: {
    getPoints: ({ sprite }) => {
      const { start, end, startControl, endControl } = sprite.props as IProps;
      return [start, end, startControl, endControl];
    },
  },
};

export default CurveSpriteMeta;
