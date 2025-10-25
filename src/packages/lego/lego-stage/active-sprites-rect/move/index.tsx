import React from 'react';
import { EventTypeEnum, IAdsorbLine, ICoordinate, ISprite, ISpriteOperation, IStageApis, Line, Point } from '@packages/lego/interface';
import { findParentByClass, isInputting } from '@packages/lego/utils/tools';
import { getAuxiliaryLine, getRectFromSprite, handleAdsorb, handleGridAdsorb } from '../helper';

interface IProps {
  stage: IStageApis;
  angle: number;
  activeSpriteList: ISprite[];
  getInitAttrMapData: () => any;
  getOperateConfig: () => ISpriteOperation;
  updateAuxiliaryLine: (lineList: Line[]) => void;
  mousePointInStage: (e: MouseEvent) => ICoordinate;
}

export class Move extends React.Component<IProps> {

  state = {
    moving: false
  };

  componentDidMount() {
    // 加载时监听鼠标按下事件
    document.addEventListener('pointerdown', this.handleMouseDown, false);
  }

  componentWillUnmount() {
    // 即将销毁时取消事件监听
    document.removeEventListener('pointerdown', this.handleMouseDown, false);
    document.removeEventListener('pointermove', this.handleMouseMove, false);
    document.removeEventListener('pointerup', this.handleMouseUp, false);
  }

  handleMouseDown = (e: MouseEvent) => {
    const spriteDom = findParentByClass(e.target, 'lego-sprite-container');
    console.log('yf123 down', spriteDom);

    if (!spriteDom || isInputting() || e.button !== 0) {
      return;
    }
    document.addEventListener('pointermove', this.handleMouseMove, false);
    document.addEventListener('pointerup', this.handleMouseUp, false);
  };

  handleMouseUp = () => {
    const { stage } = this.props;
    const { moving } = this.state;
    if (moving) {
      stage.apis.history.pushHistory(stage.store().spriteList);
      this.setState({ moving: false });
      this.props.updateAuxiliaryLine?.([]);
    }

    document.removeEventListener('pointermove', this.handleMouseMove, false);
    document.removeEventListener('pointerup', this.handleMouseUp, false);
  };

  handleMouseMove = (e: MouseEvent) => {
    if (isInputting()) {
      return;
    }
    const { activeSpriteList, stage } = this.props;
    const { initMousePos, initActiveInfo, initPosMap } = this.props.getInitAttrMapData();
    const mousePoint = this.props.mousePointInStage(e);
    if (
      Math.abs(mousePoint.x - initMousePos.x) < 4 &&
        Math.abs(mousePoint.y - initMousePos.y) < 4
    ) {
      return;
    }
    const adsorbInfo = this.handleMoveAdsorbent(mousePoint);
    const { x, y } = adsorbInfo;
    const newActiveSpriteList = [...activeSpriteList];
    newActiveSpriteList.forEach((sprite: ISprite, i: number) => {
      const coordinate = initPosMap[sprite.id];
      newActiveSpriteList[i] = {
        ...sprite,
        attrs: {
          ...sprite.attrs,
          coordinate: {
            x: coordinate.x + x - initActiveInfo.x,
            y: coordinate.y + y - initActiveInfo.y,
          },
        },
      };
    });
    stage.apis.updateSpriteList(newActiveSpriteList);
    stage.apis.setActiveSpriteList(newActiveSpriteList);
    this.setState({ moving: true });
    // 派发事件
    stage.apis.$event.emit(EventTypeEnum.UpdateSpriteList, {
      spriteList: newActiveSpriteList,
    });
  };

  handleMoveAdsorbent = (mousePoint: Point) => {
    const { stage, angle } = this.props;
    const { gridLine } = stage.store();
    const { initActiveInfo, initMousePos } = this.props.getInitAttrMapData();
    const { spriteList, activeSpriteMap, adsorbLine, registerSpriteMetaMap, size } =
        stage.store();
    const { enable, visible } = adsorbLine as IAdsorbLine;
    const info = { ...initActiveInfo };
    const move = {
      x: mousePoint.x - initMousePos.x,
      y: mousePoint.y - initMousePos.y,
    };
    const notActiveSpriteList = spriteList.filter((sprite: ISprite) => {
      const meta = registerSpriteMetaMap[sprite.type];
      const canAlign = !(
        meta &&
          meta.operation &&
          meta.operation.canAlign === false
      );
      return canAlign && !activeSpriteMap[sprite.id];
    });
    info.x += move.x;
    info.y += move.y;
    if (angle !== 0) {
      return info;
    }
    let dx = Infinity;
    let dy = Infinity;
    if (enable) {
      const alignRes = getAuxiliaryLine(
          adsorbLine as IAdsorbLine,
          info,
          notActiveSpriteList.map(getRectFromSprite),
          size,
      );
      dx = alignRes.dx;
      dy = alignRes.dy;

      if (visible !== false) {
        this.props.updateAuxiliaryLine?.(alignRes.lines);
      }
    }
    if (gridLine?.enable) {
      const res = handleGridAdsorb(
        info,
        gridLine?.spacing || 50,
        gridLine?.spacing || 50,
        gridLine?.adsorbDis || 8,
        gridLine?.adsorbDis || 8,
        'move',
      );
      dx = Math.abs(res.dx) < Math.abs(dx) ? res.dx : dx;
      dy = Math.abs(res.dy) < Math.abs(dy) ? res.dy : dy;
    }
    const adsorbInfo = handleAdsorb({
      rect: info,
      dx: (dx === Infinity ? 0 : dx),
      dy: (dy === Infinity ? 0 : dy),
      mode: 'move',
    });
    move.x = adsorbInfo.x;
    move.y = adsorbInfo.y;

    return adsorbInfo;
  };

  render() {
    return (
      <>move</>
    );
  }
}
