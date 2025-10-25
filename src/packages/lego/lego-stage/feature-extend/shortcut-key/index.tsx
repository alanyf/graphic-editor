import React from "react";
import { ISprite, IStageApis } from "@packages/lego/interface";
import { isInputting } from "@packages/lego/utils/tools";
import { getOptType, KeyBoardOptEnum, pressMeta, pressShift } from "../../keyboard";

interface IProps {
  stage: IStageApis;
}

interface IState {

}

export class EditorShortcutKey extends React.Component<IProps, IState> {

  keyDownMap: Record<string, boolean> = {};

  componentDidMount() {
    const { stage } = this.props;
    const { stageDom } = stage.store();
    stageDom?.addEventListener('keydown', this.keyDownHandle, false);
    stageDom?.addEventListener('keyup', this.keyUpHandle, false);
  }

  componentWillUnmount() {
    const { stage } = this.props;
    const { stageDom } = stage.store();
    stageDom?.removeEventListener('keydown', this.keyDownHandle, false);
    stageDom?.removeEventListener('keyup', this.keyUpHandle, false);
  }

  private readonly keyDownHandle = (e: KeyboardEvent) => {
    e.stopPropagation();
    const { keyDownMap } = this;
    this.keyDownMap = {
      ...keyDownMap,
      [e.code]: true,
      pressMeta: pressMeta(e),
      pressShift: pressShift(e),
    };
    const opt = getOptType(e);
    this.handleShortCard(opt, e);
    return false;
  };

  private readonly keyUpHandle = (e: any) => {
    e.stopPropagation();
    const { keyDownMap } = this;
    delete keyDownMap[e.code];
    this.keyDownMap = {
      ...keyDownMap,
      pressMeta: pressMeta(e),
      pressShift: pressShift(e),
    };
    if (e.code === 'Meta') {
      this.keyDownMap = {};
    }
  };

  /**
   * 处理快捷键操作
   * @param opt 操作
   */
  private readonly handleShortCard = (
    opt: KeyBoardOptEnum,
    e: KeyboardEvent,
  ) => {
    const { stage } = this.props;
    if (isInputting()) {
      stage.apis.setState({ shearPlate: { type: '', content: '' } });
      return;
    }
    switch (opt) {
      case KeyBoardOptEnum.delete:
        stage.apis.removeActiveSprite();
        break;
      case KeyBoardOptEnum.selectAll:
        stage.apis.selectAllSprite();
        e.preventDefault();
        break;
      case KeyBoardOptEnum.copy:
        stage.apis.copyActiveSpriteList();
        e.preventDefault();
        break;
      case KeyBoardOptEnum.cut:
        stage.apis.cutActiveSpriteList();
        break;
      case KeyBoardOptEnum.paste:
        stage.apis.pasteActiveSpriteList();
        if (stage.apis.state.shearPlate?.content?.length) {
          e.preventDefault();
        }
        break;
      case KeyBoardOptEnum.undo:
        stage.apis.history.undo();
        break;
      case KeyBoardOptEnum.redo:
        stage.apis.history.redo();
        break;
      case KeyBoardOptEnum.up:
        this.moveActiveSprite(0, -1);
        break;
      case KeyBoardOptEnum.down:
        this.moveActiveSprite(0, 1);
        break;
      case KeyBoardOptEnum.left:
        this.moveActiveSprite(-1, 0);
        break;
      case KeyBoardOptEnum.right:
        this.moveActiveSprite(1, 0);
        break;
      default:
        break;
    }
  };

  private readonly moveActiveSprite = (moveX = 0, moveY = 0) => {
    const { stage } = this.props;
    const { activeSpriteList } = stage.store();
    activeSpriteList.forEach((sprite: ISprite) => {
      const { x, y } = sprite.attrs.coordinate;
      stage.apis.updateSpriteAttrs(sprite, {
        ...sprite.attrs,
        coordinate: { x: x + moveX, y: y + moveY },
      });
    });
  };

  render() {
    return null;
  }
}
