import { lineAngle, radianToAngle } from '@packages/geometry-tools';
import React from 'react';
import { EventTypeEnum, ICoordinate, ISizeCoordinate, ISprite, ISpriteOperation, IStageApis, Line } from '@packages/lego/interface';
import { getActiveSpriteRect } from '../helper';
import RotateIcon from './rotate-icon';

interface IProps {
  stage: IStageApis;
  activeSpriteList: ISprite[];
  activeRect: ISizeCoordinate;
  angle: number;
  scale: number;
  pressShift?: boolean;
  updateAuxiliaryLine: (lineList: Line[]) => void;
  getOperateConfig: () => ISpriteOperation;
  mousePointInStage: (e: MouseEvent) => ICoordinate;
}

export class Rotate extends React.Component<IProps> {

  state = {
    dragging: false,
    mousePos: { x: 0, y: 0 },
  };

  componentDidMount() {
    // 加载时监听鼠标按下事件
  }

  componentWillUnmount() {
    // 即将销毁时取消事件监听
    document.removeEventListener('pointerdown', this.handleMouseDown, false);
    document.removeEventListener('pointermove', this.handleMouseMove, false);
    document.removeEventListener('pointerup', this.handleMouseUp, false);
  }

  handleMouseDown = () => {
    document.addEventListener('pointermove', this.handleMouseMove, false);
    document.addEventListener('pointerup', this.handleMouseUp, false);
  };

  handleMouseUp = () => {
    const { stage } = this.props;
    const { dragging } = this.state;
    if (dragging) {
      stage.apis.history.pushHistory(stage.store().spriteList);
      this.setState({ dragging: false });
    }
    // e.stopPropagation();
    document.removeEventListener('pointermove', this.handleMouseMove, false);
    document.removeEventListener('pointerup', this.handleMouseUp, false);
  };

  handleMouseMove = (e: MouseEvent) => {
    // e.stopPropagation();
    const { activeSpriteList, stage } = this.props;
    const { pressShift } = this.props;
    const unitAngle = 5;
    const mousePos = this.props.mousePointInStage(e);
    const info = getActiveSpriteRect(activeSpriteList);
    const center = { x: info.x + info.width / 2, y: info.y + info.height / 2 };
    let angle = lineAngle(center, mousePos);
    // 鼠标点和中心的点组成角度的补偿处理
    angle += radianToAngle(Math.atan((info.height + 15) / info.width));
    angle += angle < 0 ? 360 : 0;
    // 按下shify以5度为倍数变化旋转角度
    angle = pressShift ? Math.floor(angle / unitAngle) * unitAngle : angle;
    const adsorbAngles = [0, 90, 180, 270, 360];
    // 角度吸附处理
    adsorbAngles.forEach((degree: number) => {
      angle = Math.abs(angle - degree) < 1 ? degree : angle;
    });
    angle = angle > 360 ? 360 : angle;
    this.setState({ mousePos, dragging: true });
    activeSpriteList.forEach((sprite: ISprite) => {
      const newAttrs = { ...sprite.attrs };
      newAttrs.angle = angle;
       
      sprite.attrs = newAttrs;
    });
    stage.apis.updateSpriteList(activeSpriteList);
    // 派发事件
    stage.apis.$event.emit(EventTypeEnum.UpdateSpriteList, {
      spriteList: activeSpriteList,
    });
  };

  render() {
    const { activeRect, angle, activeSpriteList } = this.props;
    const { mousePos, dragging } = this.state;
    const { canRotate } = this.props.getOperateConfig();
    const activeSingle = activeSpriteList.length === 1;
    return (
      <>
        {/* 旋转 */}
        {canRotate && activeSingle && (
          <RotateIcon
            x={activeRect.x + activeRect.width}
            y={activeRect.y - 20}
            className="operate-point-rotate-icon"
            onMouseDown={this.handleMouseDown}
          />
        )}
        <text
          x={mousePos.x + 15}
          y={mousePos.y}
          // 反旋转
          transform={`rotate(${-angle || 0}, ${activeRect.x + activeRect.width / 2} ${
            activeRect.y + activeRect.height / 2
          })`}
          className="operate-point-rotate-angle"
          style={{
            left: `${mousePos.x + 15}px`,
            top: `${mousePos.y}px`,
            display: dragging ? 'block' : 'none',
            userSelect: 'none',
          }}>
          {angle.toFixed(0)}°
        </text>
      </>
    );
  }
}
