import React from 'react';
import type { ICoordinate, ISprite, IStageApis } from '../../../interface';
import { getStageMousePoint } from '../../../utils/tools';

interface IProps {
  stage: IStageApis;
}
interface IState {
  initMousePos: ICoordinate;
  currentMousePos: ICoordinate;
}

class SelectRect extends React.Component<IProps, IState> {
  readonly state = {
    initMousePos: { x: 0, y: 0 },
    currentMousePos: { x: 0, y: 0 },
  };

  private readonly onStageMouseDown = (e: any) => {
    const { stage } = this.props;
    if (e.target.classList.contains('lego-stage-container')) {
      const { coordinate, scale = 1 } = stage.store();
      const currentMousePos = getStageMousePoint(e, coordinate, scale);
      this.setState({
        initMousePos: { ...currentMousePos },
        currentMousePos: { ...currentMousePos },
      });
      document.addEventListener('mousemove', this.onStageMouseMove, false);
      document.addEventListener('mouseup', this.onStageMouseUp, false);
    }
  };

  private readonly onStageMouseUp = () => {
    this.setState({
      initMousePos: { x: 0, y: 0 },
      currentMousePos: { x: 0, y: 0 },
    });
    document.removeEventListener('mousemove', this.onStageMouseMove, false);
    document.removeEventListener('mouseup', this.onStageMouseUp, false);
  };

  private readonly onStageMouseMove = (e: any) => {
    const { stage } = this.props;
    const { coordinate, scale = 1 } = stage.store();
    const currentMousePos = getStageMousePoint(e, coordinate, scale);
    this.setState({ currentMousePos });
    this.handleSelectSprites();
  };

  private readonly handleSelectSprites = () => {
    const { stage } = this.props;
    const { spriteList } = stage.store();
    const { initMousePos, currentMousePos } = this.state;
    const minX = Math.min(initMousePos.x, currentMousePos.x);
    const maxX = Math.max(initMousePos.x, currentMousePos.x);
    const minY = Math.min(initMousePos.y, currentMousePos.y);
    const maxY = Math.max(initMousePos.y, currentMousePos.y);
    const activeSpriteList: ISprite[] = [];
    spriteList.forEach((sprite: ISprite) => {
      const { x, y } = sprite.attrs.coordinate;
      const { width, height } = sprite.attrs.size;
      if (x >= minX && x + width <= maxX && y >= minY && y + height <= maxY) {
        activeSpriteList.push(sprite);
      }
    });
    stage.apis.setActiveSpriteList(activeSpriteList);
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.onStageMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onStageMouseDown);
    document.removeEventListener('mousemove', this.onStageMouseMove);
  }

  render() {
    const { initMousePos, currentMousePos } = this.state;
    return (
      <rect
        x={Math.min(currentMousePos.x, initMousePos.x)}
        y={Math.min(currentMousePos.y, initMousePos.y)}
        width={Math.abs(currentMousePos.x - initMousePos.x)}
        height={Math.abs(currentMousePos.y - initMousePos.y)}
        stroke="#0067ed"
        strokeWidth="1"
        fill="#e6f6ff"
        opacity=".5"></rect>
    );
  }
}

export default SelectRect;
