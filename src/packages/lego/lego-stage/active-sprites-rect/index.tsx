import React from 'react';
import './index.less';
import type { Line } from '@packages/geometry-tools';
import type {
  ISprite,
  ISize,
  IStageApis,
  ICoordinate,
  ISizeCoordinate,
  ISpriteMeta,
  ISpriteOperation,
} from '../../interface';
import {
  getActiveSpriteRect,
  getPointFromEvent,
} from './helper';
import { Move } from './move';
import { Resize } from './resize';
import { Rotate } from './rotate';

interface IProps {
  scale: number;
  activeSpriteList: ISprite[];
  registerSpriteMetaMap: Record<string, ISpriteMeta>;
  stage: IStageApis;
  pressShift: boolean;
}

interface IState {
  ready: boolean;
  mousePos: ICoordinate;
  auxiliaryLineList: Line[];
}

const defaultOperation = {
  canOperate: true,
  canMove: true,
  canRotate: true,
  canResize: true,
  resizeLock: false,
};

class LegoActiveSpriteContainer extends React.Component<IProps, IState> {
  containerRef: any = React.createRef();

  initMousePos: ICoordinate = { x: 0, y: 0 };

  initSizeMap: Record<string, ISize> = {};

  initPosMap: Record<string, ICoordinate> = {};

  activeRect: ISizeCoordinate = { width: 0, height: 0, x: 0, y: 0 };

  initActiveInfo: ISizeCoordinate = { width: 0, height: 0, x: 0, y: 0 };

  operation: ISpriteOperation = { ...defaultOperation };

  readonly state: IState = {
    ready: false,
    mousePos: { x: 0, y: 0 },
    auxiliaryLineList: [],
  };

  componentDidMount() {
    document.addEventListener('pointerdown', this.handleMouseDown, false);
    this.setState({ ready: true });
  }

  componentWillUnmount() {
    // 即将销毁时取消事件监听
    document.removeEventListener('pointerdown', this.handleMouseDown, false);
  }

  handleMouseDown = (e: MouseEvent) => {
    this.getInitAttrMap(e);
  };

  mousePointInStage = (e: any) => {
    const { stage, scale = 1 } = this.props;
    const { pageX, pageY } = e;
    const { coordinate: stagePos } = stage.store();
    const mousePoint = {
      x: pageX - stagePos.x,
      y: pageY - stagePos.y
    };
    mousePoint.x /= scale;
    mousePoint.y /= scale;
    return mousePoint;
  };

  getInitAttrMap = (e: any) => {
    const { activeSpriteList } = this.props;
    this.initSizeMap = {};
    this.initPosMap = {};
    this.initMousePos = this.mousePointInStage(e);
    this.initActiveInfo = getActiveSpriteRect(activeSpriteList);
    activeSpriteList.forEach((sprite: ISprite) => {
      this.initSizeMap[sprite.id] = { ...sprite.attrs.size };
      this.initPosMap[sprite.id] = { ...sprite.attrs.coordinate };
    });
  };

  getInitAttrMapData = () => {
    return {
      initSizeMap: this.initSizeMap,
      initPosMap: this.initPosMap,
      initMousePos: this.initMousePos,
      initActiveInfo: this.initActiveInfo,
    };
  };

  /**
   * 获取操作配置
   * @returns
   */
  getOperateConfig = () => {
    const { activeSpriteList, registerSpriteMetaMap } = this.props;
    const truePropList = ['canOperate', 'canMove', 'canRotate', 'canResize'];
    const falsePropList = ['resizeLock'];
    const opt: any = this.operation;
    activeSpriteList.forEach(({ type }) => {
      const meta: any = registerSpriteMetaMap[type];
      if (meta?.operation) {
        const { operation } = meta;
        truePropList.forEach((prop: string) => {
          opt[prop] = opt[prop] && operation[prop] !== false;
        });
        falsePropList.forEach((prop: string) => {
          opt[prop] = opt[prop] || operation[prop] === true;
        });
      } else {
        this.operation = { ...defaultOperation };
      }
    });
    return this.operation;
  };

  updateAuxiliaryLine = (lineList: Line[]) => {
    this.setState({ auxiliaryLineList: lineList });
  };

  render() {
    const { activeSpriteList, stage, scale } = this.props;
    const { auxiliaryLineList, ready } = this.state;
    let info: ISizeCoordinate = { width: 0, height: 0, x: 0, y: 0 };
    const activeSingle = activeSpriteList.length === 1;
    const angle = (activeSingle ? activeSpriteList[0].attrs.angle : 0) || 0;
    const { canOperate, canResize, canRotate, resizeLock } =
      this.getOperateConfig();
    if (activeSpriteList.length > 0) {
      info = getActiveSpriteRect(activeSpriteList);
      // const padding = 4;
      // info.x -= padding;
      // info.y -= padding;
      // info.width += padding * 2;
      // info.height += padding * 2;
    }

    if (!canOperate || info.width < 0 || info.height < 0) {
      return null;
    }
    this.activeRect = { ...info };
    return (
      <>
        <g
          className="active-sprites-container"
          transform={`rotate(${angle || 0}, ${info.x + info.width / 2} ${
            info.y + info.height / 2
          })`}
          // onMouseDown={this.move_mouseDown}
        >
          {/* 边框 */}
          {/* <rect
            x={info.x}
            y={info.y}
            width={info.width}
            height={info.height}
            stroke="#0067ed"
            fill="none"
            className="active-sprites-content"></rect> */}
          {ready && (
            <>
              <Move
                stage={stage}
                angle={angle}
                activeSpriteList={activeSpriteList}
                getOperateConfig={this.getOperateConfig}
                getInitAttrMapData={this.getInitAttrMapData}
                updateAuxiliaryLine={this.updateAuxiliaryLine}
                mousePointInStage={this.mousePointInStage}
              />
              <Resize
                stage={stage}
                angle={angle}
                pressShift={false}
                activeRect={info}
                getOperateConfig={this.getOperateConfig}
                activeSpriteList={activeSpriteList}
                getInitAttrMapData={this.getInitAttrMapData}
                updateAuxiliaryLine={this.updateAuxiliaryLine}
                mousePointInStage={this.mousePointInStage}
              />
              <Rotate
                stage={stage}
                angle={angle}
                scale={scale}
                pressShift={false}
                activeRect={info}
                getOperateConfig={this.getOperateConfig}
                activeSpriteList={activeSpriteList}
                updateAuxiliaryLine={this.updateAuxiliaryLine}
                mousePointInStage={this.mousePointInStage}
              />
            </>
          )}
          {/* 旋转 */}
          {/* {canRotate && activeSingle && (
            <RotateIcon
              x={info.x + info.width}
              y={info.y - 20}
              className="operate-point-rotate-icon"
              onMouseDown={this.rotate_mouseDown}
            />
          )} */}
        </g>
        {/* 辅助线 */}
        {auxiliaryLineList.map((line: Line) => (
          <line
            key={JSON.stringify(line)}
            {...line}
            stroke={'#0067ed'}
            strokeDasharray="4 4"></line>
        ))}
      </>
    );
  }
}
export default LegoActiveSpriteContainer;
