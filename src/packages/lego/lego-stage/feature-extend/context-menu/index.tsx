import React from 'react';
import {
  debounce,
  getStageMousePoint,
  setSpriteLevel,
  setSpriteListAlign,
} from '../../../utils/tools';
import { ISprite, IStageApis, Point } from '../../../interface';
import Menu, { IMenuItem } from './menu-base';
import defaultMenuList from './default-menu-list';
import { isGroupSprite } from '../../helper';
import './index.less';

export * from './menu-base';

interface IProps {
  scale?: number;
  stage: IStageApis;
  activeSpriteList: ISprite[];
}

interface IState {
  menuList: IMenuItem[];
  contextMenuPoint: Point;
  visiblePopover: boolean;
}
export default class ContextMenu extends React.Component<IProps, IState> {
  menuContainerRef: any = React.createRef();

  handleUpdate: () => void = () => '';

  readonly state: IState = {
    menuList: defaultMenuList,
    contextMenuPoint: { x: -5, y: -5 },
    visiblePopover: false,
  };

  handleContextMenu = (e: React.MouseEvent) => {
    this.hidePopover();
    e.stopPropagation();
    e.preventDefault();
    const { stage } = this.props;
    const { coordinate, scale = 1 } = stage.store();
    const point = getStageMousePoint(e as any, coordinate, scale);
    this.showPopover(point);
    return false;
  };

  handleMenuTrigger = (menuItem: IMenuItem) => {
    this.hidePopover();
    const opt = menuItem.key;
    const { stage } = this.props;
    switch (opt) {
      case 'selectAll':
        stage.apis.selectAllSprite();
        break;
      case 'delete':
        stage.apis.removeActiveSprite();
        break;
      case 'copy':
        stage.apis.copyActiveSpriteList();
        break;
      case 'cut':
        stage.apis.cutActiveSpriteList();
        break;
      case 'paste':
        stage.apis.pasteActiveSpriteList();
        break;
      case 'undo':
        stage.apis.history.undo();
        break;
      case 'redo':
        stage.apis.history.redo();
        break;
      case 'group':
        stage.apis.makeActiveSpriteGroup();
        break;
      case 'splitGroup':
        stage.apis.splitActiveSpriteGroup();
        break;
      default:
        // 层级移动
        const levelList = ['levelUp', 'levelDown', 'levelTop', 'levelBottom'];
        if (levelList.includes(opt)) {
          setSpriteLevel(stage, opt as any);
          break;
        }
        // 对齐
        const alignList = [
          'horizontalAlign',
          'verticalAlign',
          'horizontalVerticalAlign',
          'topAlign',
          'bottomAlign',
          'leftAlign',
          'rightAlign',
        ];
        if (alignList.includes(opt)) {
          setSpriteListAlign(stage, opt as any);
          break;
        }
        break;
    }
  };

  showPopover = (point: Point) => {
    this.setState({ contextMenuPoint: point, visiblePopover: true });
  };

  hidePopover = () => {
    this.setState({ visiblePopover: false });
  };

  handleActiveUpdate = () => {
    const { stage, activeSpriteList } = this.props;
    const { menuList } = this.state;
    const emptyDisableMap: any = { copy: true, cut: true, delete: true };
    menuList.forEach((menu: IMenuItem) => {
      const { key } = menu;
      if (
        emptyDisableMap[key] ||
        key.includes('align') ||
        key.includes('level')
      ) {
        menu.disable = activeSpriteList.length === 0;
      }
      if (key === 'paste') {
        const { shearPlate } = stage.store();
        menu.disable = !(
          shearPlate &&
          shearPlate.type === 'sprite' &&
          shearPlate.content.length > 0
        );
      }
      if (key === 'selectAll') {
        const { spriteList } = stage.store();
        menu.disable = spriteList.length === 0;
      }
      if (key === 'group') {
        const { activeSpriteList } = stage.store();
        menu.disable = activeSpriteList.length < 2;
      }
      if (key === 'splitGroup') {
        const { activeSpriteList } = stage.store();
        menu.disable = !(activeSpriteList.length === 1 && isGroupSprite(activeSpriteList[0]));
      }
    });
    this.setState({ menuList });
  };

  componentDidUpdate() {
    this.handleUpdate();
  }

  componentDidMount() {
    this.handleUpdate = debounce(this.handleActiveUpdate, 200);
    this.menuContainerRef.current?.parentNode?.addEventListener(
      'contextmenu',
      this.handleContextMenu,
    );
  }

  componentWillUnmount() {
    this.menuContainerRef.current?.parentNode?.removeEventListener(
      'contextmenu',
      this.handleContextMenu,
    );
  }

  render() {
    const { scale = 1 } = this.props;
    const { menuList, contextMenuPoint, visiblePopover } = this.state;
    return (
      <foreignObject
        ref={this.menuContainerRef}
        x={contextMenuPoint.x}
        y={contextMenuPoint.y}
        style={{ overflow: 'visible' }}>
        <div style={{ transform: `scale(${1 / scale})`, }}>
          <Menu
            visible={visiblePopover}
            menuList={menuList}
            onTrigger={this.handleMenuTrigger}
            onVisibleChange={(visible: boolean) => {
              if (!visible) {
                this.hidePopover();
              }
            }}
          />
        </div>
      </foreignObject>
    );
  }
}
