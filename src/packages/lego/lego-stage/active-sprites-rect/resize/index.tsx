import React from 'react';
import { EventTypeEnum, IAdsorbLine, ICoordinate, ISize, ISizeCoordinate, ISprite, ISpriteOperation, IStageApis, Line, Point } from '@packages/lego/interface';
import { findParentByClass, isInputting } from 'src/utils/tools';
import { getActiveSpriteRect, getAuxiliaryLine, getRectFromSprite, handleAdsorb, handleEqualSizeAdsorb, handleGridAdsorb, handlePositionResize } from '../helper';
import operatePointData from './operate-point';

const getCursor = (angle: number) => {
  let a = angle;
  if (a < 0) {
    a += 360;
  }
  if (a >= 360) {
    a -= 360;
  }
  if (a >= 338 || a < 23 || (a > 157 && a <= 202)) {
    return 'ew-resize';
  } else if ((a >= 23 && a < 68) || (a > 202 && a <= 247)) {
    return 'nwse-resize';
  } else if ((a >= 68 && a < 113) || (a > 247 && a <= 292)) {
    return 'ns-resize';
  } else {
    return 'nesw-resize';
  }
};

interface IProps {
  stage: IStageApis;
  activeSpriteList: ISprite[];
  activeRect: ISizeCoordinate;
  angle: number;
  pressShift?: boolean;
  getInitAttrMapData: () => any;
  updateAuxiliaryLine: (lineList: Line[]) => void;
  getOperateConfig: () => ISpriteOperation;
  mousePointInStage: (e: MouseEvent) => ICoordinate;
}

export class Resize extends React.Component<IProps> {
  resizePos: string = '';

  state = {
    dragging: false
  };

  componentDidMount() {
  }

  componentWillUnmount() {
    // 即将销毁时取消事件监听
    document.removeEventListener('pointermove', this.handleMouseMove, false);
    document.removeEventListener('pointerup', this.handleMouseUp, false);
  }

  handleMouseDown = (e: any, pos: string) => {
    // e.stopPropagation();
    this.resizePos = pos;
    setTimeout(() => {
      document.addEventListener('pointermove', this.handleMouseMove, false);
      document.addEventListener('pointerup', this.handleMouseUp, false);
    }, 10);
  };

  handleMouseUp = () => {
    const { stage } = this.props;
    const { dragging } = this.state;
    if (dragging) {
      stage.apis.history.pushHistory(stage.store().spriteList);
      this.setState({ dragging: false });
    }
    this.props.updateAuxiliaryLine([]);
    document.removeEventListener('pointermove', this.handleMouseMove, false);
    document.removeEventListener('pointerup', this.handleMouseUp, false);
  };

  handleMouseMove = (e: MouseEvent) => {
    const { resizePos } = this;
    const { initSizeMap, initPosMap } = this.props.getInitAttrMapData();
    const { activeSpriteList, stage } = this.props;
    // 不支持同时编辑多个精灵的大小
    if (activeSpriteList.length !== 1) {
      return;
    }
    const sprite = activeSpriteList[0];
    const newAttrs = { ...sprite.attrs };
    const initSize = initSizeMap[sprite.id];
    const initPos = initPosMap[sprite.id];
    const result = this.getResizeChange(
      e,
      resizePos,
      initSize,
      initPos,
      newAttrs.angle,
    );
    const { width, height, x, y } = result;
    newAttrs.size = { width, height };
    newAttrs.coordinate = { x, y };
    stage.apis.updateSpriteAttrs(sprite, newAttrs);
    this.setState({ resizing: true });
    // 派发事件
    stage.apis.$event.emit(EventTypeEnum.UpdateSpriteList, {
      spriteList: activeSpriteList,
    });
  };

  /**
     * 重新定位位置计算
     * @param e
     * @param pos
     * @param initSize
     * @returns info
     */
  getResizeChange = (
    e: any,
    pos: string,
    initSize: ISize,
    initPos: ICoordinate,
    angle = 0,
  ) => {
    const { resizePos } = this;
    const { pressShift, activeSpriteList, stage } = this.props;
    const { initMousePos } = this.props.getInitAttrMapData();
    const { gridLine } = stage.store();
    const { adsorbLine, size, spriteList, registerSpriteMetaMap, activeSpriteMap } = stage.store();
    const { enable, visible } = adsorbLine as IAdsorbLine;
    const { resizeLock } = this.props.getOperateConfig();
    const mousePoint = this.props.mousePointInStage(e);
    let info = { width: 0, height: 0, x: 0, y: 0 };
    const params: any = {
      angle,
      pos,
      mousePoint,
      initPos,
      initSize,
      initMousePos,
      resizeLock: pressShift || resizeLock,
      activeRect: getActiveSpriteRect(activeSpriteList),
      info,
    };
      // const shiftPoint = handleEqualRatio(params);
      // params.mousePoint = shiftPoint;
      // this.setState({ logObj: { points: [shiftPoint] } });
      // 处理来自8个方向上的变动
    const { rect: _rect, realResizePos } = handlePositionResize(params);

    info = _rect;
    // 处理高宽相同时的吸附
    info = handleEqualSizeAdsorb(info, initSize, pos);
    const notActiveSpriteList = spriteList.filter((sprite: ISprite) => {
      const meta = registerSpriteMetaMap[sprite.type];
      const canAlign = !(
        meta &&
          meta.operation &&
          meta.operation.canAlign === false
      );
      return canAlign && !activeSpriteMap[sprite.id];
    });
    const rect = {
      width: Math.abs(initSize.width + info.width),
      height: Math.abs(initSize.height + info.height),
      x: initPos.x + info.x,
      y: initPos.y + info.y,
    };
    if (angle !== 0) {
      return rect;
    }
    let dx = Infinity;
    let dy = Infinity;
    if (enable) {
      const alignRes = getAuxiliaryLine(
          adsorbLine as IAdsorbLine,
          rect,
          notActiveSpriteList.map(getRectFromSprite),
          size,
          false,
          realResizePos,
      );
      dx = alignRes.dx;
      dy = alignRes.dy;

      if (visible !== false) {
        this.props.updateAuxiliaryLine?.(alignRes.lines);
      }
    }
    if (gridLine?.enable) {
      const res = handleGridAdsorb(
        rect,
        gridLine?.spacing || 50,
        gridLine?.spacing || 50,
        gridLine?.adsorbDis || 8,
        gridLine?.adsorbDis || 8,
        'resize',
        {
          left: Boolean(realResizePos?.includes('left')),
          right: Boolean(realResizePos?.includes('right')),
          top: Boolean(realResizePos?.includes('top')),
          bottom: Boolean(realResizePos?.includes('bottom')),
        },
      );
      dx = Math.abs(res.dx) < Math.abs(dx) ? res.dx : dx;
      dy = Math.abs(res.dy) < Math.abs(dy) ? res.dy : dy;
    }
    const adsorbInfo = handleAdsorb({
      rect,
      dx: (dx === Infinity ? 0 : dx),
      dy: (dy === Infinity ? 0 : dy),
      mode: 'resize',
      resizePos,
      realResizePos,
    });

    return adsorbInfo;
  };

  render() {
    const { activeRect, angle, activeSpriteList } = this.props;
    const { canResize, resizeLock } = this.props.getOperateConfig();
    const activeSingle = activeSpriteList.length === 1;
    return (
      <g>
        <rect
          x={activeRect.x}
          y={activeRect.y}
          width={activeRect.width}
          height={activeRect.height}
          stroke="#0067ed"
          fill="none"
          className="active-sprites-content"
        />
        {canResize &&
            activeSingle &&
            operatePointData.map((e: any, i: number) => {
              if (resizeLock && !e.name.includes('-')) {
                return null;
              }
              return (
                // <circle
                //   r={4}
                //   cx={info.x + (info.width / 100) * e.position.x}
                //   cy={info.y + (info.height / 100) * e.position.y}
                //   fill="#0067ed"
                //   stroke="#eee"
                //   strokeWidth="1"
                //   className={`operate-point-container operate-point-${e.name}`}
                //   onMouseDown={(event: any) => this.resize_mouseDown(event, e.name)}
                // ></circle>
                <rect
                  key={i}
                  x={activeRect.x + (activeRect.width / 100) * e.position.x - 3}
                  y={activeRect.y + (activeRect.height / 100) * e.position.y - 3}
                  width={6}
                  height={6}
                  fill="#fff"
                  strokeWidth="1"
                  stroke="#999"
                  className={`operate-point-container operate-point-${e.name}`}
                  style={{
                    cursor: getCursor(angle + e.angle),
                  }}
                  onMouseDown={(event: any) =>
                    this.handleMouseDown(event, e.name)
                  }></rect>
              );
            })}
      </g>
    );
  }
}
