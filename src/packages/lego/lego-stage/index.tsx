 
import React from 'react';
import type {
  IReadyContext,
  ISprite,
  ISpriteMeta,
  ISize,
  ICoordinate,
  IStageApis,
  IShearPlate,
  IGridLine,
  IAdsorbLine,
  Point,
  ISpriteAttrsLike,
  IWidthHeightRatio,
} from '../interface';
import {
  findSpriteInSpriteList,
  getOriginMousePointInSprite,
  deepClone,
  getPortCoordinate,
  debounce,
  traversalTree,
} from '../utils/tools';
import LegoSprite from '../lego-sprite';
import { HistoryRecord } from '../utils/history';
import EventCenter from '../utils/event-center';
import {
  findSpriteDomByClass,
  getInitStageSize,
  getNewSprite,
  isGroupSprite,
  makeSpriteGroup,
  splitSpriteGroup,
} from './helper';
import LegoActiveSpriteContainer from './active-sprites-rect';
import { defaultGridLine } from './feature-extend/grid-line/grid-line';
import { defaultAdsorbLine } from './config';
import { FeatureExtend, UnderSpriteFeatureExtend } from './feature-extend';
import { OutputExtend, HistoryExtend } from './api-extend';

import './index.less';

export interface IProps {
  WHRatio: IWidthHeightRatio;
  background: string;
  editable?: boolean;
  gridLine?: IGridLine;
  adsorbLine?: IAdsorbLine;
  onReady: (ctx: IReadyContext) => void;
  onActiveSpriteChange?: (activeSpriteList: ISprite[]) => void;
  onEditingSpriteChange?: (editingSprite: ISprite | null) => void;
}

export interface IState {
  background: string;
  scale: number;
  size: ISize;
  coordinate: ICoordinate;
  ready: boolean;
  spriteList: ISprite[];
  spriteMap: Record<string, ISprite>;
  activeSpriteList: ISprite[];
  activeSpriteMap: Record<string, ISprite>;
  editingSprite: ISprite | null;
  creatingSprite: ISprite | null;
  initMousePos: ICoordinate;
  currentMousePos: ICoordinate;
  shearPlate: IShearPlate;
  history: HistoryRecord<string>;
  keyDownMap: Record<string, boolean>;
  logObj: any;
}

// 舞台实例上的属性
export interface IStageInstanceProps {
  stageContainerRef: any;
  stageDom: any;
  stage: IStageApis;
  registerSpriteMetaMap: Record<string, ISpriteMeta>;
  $event: EventCenter;
}

/**
 * 舞台组件
 */
class LegoStage extends React.Component<IProps, IState> {
  stageContainerRef: any = React.createRef();

  stageDom: any = {};

  stage: IStageApis = { apis: {}, store: () => {} } as any;

  registerSpriteMetaMap: Record<string, ISpriteMeta> = {};

  $event: EventCenter = new EventCenter();

  hadMouseDown: boolean = false;

  output: OutputExtend = {} as OutputExtend;

  history: HistoryExtend = {} as HistoryExtend;

  creatingMouseEventHandler: (e: any) => boolean | void = () => true;

  readonly state: IState = {
    background: '',
    scale: 1,
    size: { width: 0, height: 0 },
    coordinate: { x: 0, y: 0 },
    ready: false,
    spriteList: [],
    spriteMap: {},
    activeSpriteList: [],
    activeSpriteMap: {},
    editingSprite: null,
    creatingSprite: null,
    initMousePos: { x: 0, y: 0 },
    currentMousePos: { x: 0, y: 0 },
    shearPlate: { type: '', content: '' },
    history: new HistoryRecord<string>(150),
    keyDownMap: {},
    logObj: {},
  };

  constructor(props: IProps) {
    super(props);
    this.handleWindowResizeChange = debounce(this.handleWindowResize, 240);
  }

  componentDidMount() {
    const { WHRatio } = this.props;
    const stageDom = this.stageContainerRef.current;
    this.stageDom = stageDom;
    const { x, y } = stageDom.parentNode.getBoundingClientRect();
    const apis = {
      ...this,
      state: undefined,
    } as LegoStage;
    const size = getInitStageSize(WHRatio);
    this.setState(
      {
        size,
        coordinate: { x, y },
        background: '',
      },
      () => {
        setTimeout(() => {
          const stage = {
            apis,
            store: () => {
              const { gridLine, adsorbLine, background = '' } = this.props;
              return {
                ...this.state,
                background,
                stageDom,
                registerSpriteMetaMap: this.registerSpriteMetaMap,
                gridLine: { ...defaultGridLine, ...(gridLine || {}) },
                adsorbLine: { ...defaultAdsorbLine, ...(adsorbLine || {}) },
                output: this.output,
              } as IState;
            },
          } as any;
          this.stage = stage;
          this.output = new OutputExtend(stage);
          apis.output = this.output;
          this.history = new HistoryExtend(stage);
          apis.history = this.history;
          this.props.onReady({ stage });
          this.setState({ ready: true });
          setTimeout(() => {
            this.handleWindowResize();
          }, 900);
        }, 10);
      },
    );
    window.addEventListener('resize', this.handleWindowResizeChange, false);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResizeChange, false);
  }

  /**
   * 获取精灵映射
   * @param spriteList
   * @returns
   */
  public getSpriteMap(spriteList: ISprite[]) {
    const spriteMap: Record<string, ISprite> = {};
    // spriteList.forEach((sprite: ISprite) => {
    //   spriteMap[sprite.id] = sprite;
    // });
    traversalTree({ children: spriteList }, (sprite: ISprite) => {
      if (sprite?.id) {
        spriteMap[sprite.id] = sprite;
      }
    });
    return spriteMap;
  }

  /**
   * 添加精灵
   * @param sprite
   */
  public addSprite = (spriteLike: ISprite, addToHistory = false, isActive = false) => {
    const sprite = getNewSprite(spriteLike, this.registerSpriteMetaMap);
    if (!sprite) {
      // eslint-disable-next-line no-console
      console.warn(`Sprite ${spriteLike.type} is not registered.`);
      return sprite;
    }
    this.setState(({ spriteList }: IState) => {
      const newSpriteList = [...spriteList, sprite];
      addToHistory && this.history.pushHistory(newSpriteList);
      const newState = {
        spriteList: newSpriteList,
        spriteMap: this.getSpriteMap(newSpriteList),
      } as IState;
      if (isActive) {
        newState.activeSpriteList = [sprite];
      }
      return newState;
    });
    return sprite;
  };

  /**
   * 移除精灵
   * @param {ISprite} sprite
   */
  public removeSprite = (_sprite: ISprite | ISprite[], addToHistory = false) => {
    this.setState(({ spriteList, spriteMap, activeSpriteList, activeSpriteMap }: IState) => {

      const newState = {
        spriteList: [...spriteList],
        spriteMap: { ...spriteMap },
        activeSpriteList: [...activeSpriteList],
        activeSpriteMap: { ...activeSpriteMap },
      } as IState;
      const _spriteList = Array.isArray(_sprite) ? _sprite  : [_sprite];
      _spriteList.forEach((sprite) => {
        delete newState.spriteMap[sprite.id];
        newState.spriteList = newState.spriteList.filter(
          (item: ISprite) => item.id !== sprite.id,
        );

        if (newState.activeSpriteMap[sprite.id]) {
          delete newState.activeSpriteMap[sprite.id];
          newState.activeSpriteList = newState.activeSpriteList.filter(
            (item: ISprite) => item.id !== sprite.id,
          );
        }
      });
      addToHistory && this.history.pushHistory(newState.activeSpriteList);
      return newState;
    });
  };

  /**
   * 注册精灵
   * @param {ISprite} sprite
   */
  public registerSprite = (spriteMeta: ISpriteMeta) => {
    if (this.registerSpriteMetaMap[spriteMeta.type]) {
      // eslint-disable-next-line no-console
      console.warn(`Sprite ${spriteMeta.type} is already registered.`);
      return;
    }
    this.registerSpriteMetaMap[spriteMeta.type] = spriteMeta;
  };

  /**
   * 更新精灵的配置
   * @param sprite
   * @param attrs
   * @param addToHistory
   */
  public updateSpriteAttrs = (
    sprite: ISprite | string,
    attrs: ISpriteAttrsLike,
    addToHistory = false,
  ) => {
    this.setState(({ spriteList, activeSpriteList }: IState) => {
      const newSpriteList = [...spriteList];
      const newActiveSpriteList = [...activeSpriteList];

      const { sprite: targetSprite, index } = findSpriteInSpriteList(
        spriteList,
        sprite,
      );
      if (targetSprite) {
        const newSprite = {
          ...targetSprite,
          attrs: {
            ...targetSprite.attrs,
            ...attrs,
          },
        };
        newSpriteList[index] = newSprite;
        addToHistory && this.history.pushHistory(newSpriteList);
        const { index: j } = findSpriteInSpriteList(activeSpriteList, sprite);
        if (j !== -1) {
          newActiveSpriteList[j] = newSprite;
        }
      }
      return {
        spriteList: newSpriteList,
        activeSpriteList: newActiveSpriteList,
        spriteMap: this.getSpriteMap(newSpriteList),
      };
    });
  };

  /**
   * 更新精灵的属性
   * @param sprite
   * @param props
   * @param addToHistory
   */
  public updateSpriteProps = (
    sprite: ISprite | string,
    props: Record<string, any>,
    addToHistory = false,
  ) => {
    this.setState(({ spriteList, activeSpriteList }: IState) => {
      const newSpriteList = [...spriteList];
      const newActiveSpriteList = [...activeSpriteList];

      const { sprite: targetSprite, index } = findSpriteInSpriteList(
        spriteList,
        sprite,
      );
      if (targetSprite) {
        const { index: j } = findSpriteInSpriteList(activeSpriteList, sprite);
        const newSprite = {
          ...targetSprite,
          props: {
            ...targetSprite.props,
            ...props,
          },
        };
        newSpriteList[index] = newSprite;
        if (j !== -1) {
          newActiveSpriteList[j] = newSprite;
        }
        addToHistory && this.history.pushHistory(newSpriteList);
      }
      return {
        spriteList: newSpriteList,
        activeSpriteList: newActiveSpriteList,
        spriteMap: this.getSpriteMap(newSpriteList),
      };
    });
  };

  /**
   * 更新精灵列表
   * @param spriteList
   * @param addToHistory
   */
  public updateSpriteList = (spriteList: ISprite[], addToHistory = false) => {
    const needUpdateSpriteList = spriteList;
    const spriteMap = {} as any;
     
    needUpdateSpriteList.forEach(
      (sprite: ISprite) => (spriteMap[sprite.id] = sprite),
    );
     
    this.setState(({ spriteList }: IState) => {
      const newSpriteList = spriteList.map((sprite: ISprite) => {
        const newSprite = spriteMap[sprite.id];
        if (!newSprite) {
          return sprite;
        }
        return { ...newSprite };
      });
      addToHistory && this.history.pushHistory(newSpriteList);
      return {
        spriteList: newSpriteList,
      };
    });
  };

  /**
   * 获取精灵列表
   * @returns
   */
  public getActiveSpriteList = () => this.state.activeSpriteList;

  /**
   * 选中精灵变化
   * @param newActiveSpriteList
   */
  public onActiveSpriteChange = (newActiveSpriteList: ISprite[]) => {
    if (this.props.onActiveSpriteChange) {
      this.props.onActiveSpriteChange(newActiveSpriteList);
    }
  };

  /**
   * 编辑精灵变化
   * @param newEditingSpriteList
   */
  public onEditingSpriteChange = (newEditingSprite: ISprite | null) => {
    if (this.props.onEditingSpriteChange) {
      this.props.onEditingSpriteChange(newEditingSprite);
    }
  };

  public setActiveSprite = (sprite: ISprite) => {
    this.setState(({ activeSpriteList }: IState) => {
      const newActiveSpriteList = [...activeSpriteList, sprite];
      this.onActiveSpriteChange(newActiveSpriteList);
      return {
        activeSpriteList: newActiveSpriteList,
        activeSpriteMap: this.getSpriteMap(newActiveSpriteList),
      };
    });
  };

  public setEditingSprite = (sprite: ISprite | null) => {
    const { editingSprite } = this.state;
    this.onEditingSpriteChange(sprite);
    if (sprite && editingSprite && editingSprite.id === sprite.id) {
      return;
    }
    if (editingSprite) {
      this.updateSpriteAttrs(editingSprite, {
        ...editingSprite.attrs,
        editing: false,
      });
    }
    if (sprite) {
      this.updateSpriteAttrs(sprite, { ...sprite.attrs, editing: true });
    }
    this.setState({ editingSprite: sprite });
  };

  public setCreatingSprite = (sprite: ISprite | null) => {
    this.setState(({ creatingSprite }: IState) => {
      if (sprite && creatingSprite && creatingSprite.id === sprite.id) {
        return { creatingSprite };
      }
      if (!sprite && creatingSprite) {
        this.updateSpriteAttrs(creatingSprite, { creating: false });
      }
      if (sprite) {
        this.updateSpriteAttrs(sprite, { creating: true });
      }
      return { creatingSprite: sprite };
    });
  };

  public setActiveSpriteList = (spriteList: ISprite[]) => {
    this.onActiveSpriteChange(spriteList);
    this.setState({
      activeSpriteList: spriteList,
      activeSpriteMap: this.getSpriteMap(spriteList),
    });
  };

  public removeActiveSprite = (addToHistory = true) => {
    this.onActiveSpriteChange([]);
    this.setState(({ spriteList, activeSpriteMap }: IState) => {
      const newSpriteList = spriteList.filter(
        (sprite: ISprite) => !activeSpriteMap[sprite.id],
      );
      addToHistory && this.history.pushHistory(newSpriteList);
      return {
        spriteList: newSpriteList,
        activeSpriteList: [],
        activeSpriteMap: {},
      };
    });
  };

  /**
   * 选中所有精灵
   */
  public selectAllSprite = () => {
    this.setState(({ spriteList }: IState) => {
      this.onActiveSpriteChange(spriteList);
      const newSpriteList = [...spriteList];
      return {
        activeSpriteList: newSpriteList,
        activeSpriteMap: this.getSpriteMap(newSpriteList),
      };
    });
  };

  public setSpriteList = (spriteLikeList: ISprite[], addToHistory = true) => {
    const spriteList = spriteLikeList
      .map((sprite: ISprite) =>
        getNewSprite(sprite, this.registerSpriteMetaMap),
      )
      .filter((e: any) => Boolean(e)) as ISprite[];
    addToHistory && this.history.pushHistory(spriteList);
    this.setState({
      spriteList,
      activeSpriteList: [],
      activeSpriteMap: {},
      spriteMap: this.getSpriteMap(spriteList),
    });
  };

  public getMetaData = () => {
    const { background } = this.props;
    const { size, coordinate, spriteList } = this.state;
    return { background, size, coordinate, children: spriteList };
  };

  // 组合
  public makeActiveSpriteGroup = () => {
    const { stage } = this;
    const { activeSpriteList } = this.state;
    const groupSprite = makeSpriteGroup(activeSpriteList);
    stage.apis.addSprite(groupSprite, true, true);
    setTimeout(() => {
      stage.apis.removeSprite(activeSpriteList);
    }, 0);
  };

  // 解组
  public splitActiveSpriteGroup = () => {
    const { stage } = this;
    const { activeSpriteList } = this.state;
    if (!(activeSpriteList.length === 1 && isGroupSprite(activeSpriteList[0]))) {
      return;
    }
    const groupSprite = activeSpriteList[0];
    const spriteList = splitSpriteGroup(activeSpriteList[0]);
    spriteList.forEach(e => stage.apis.addSprite(e));
    setTimeout(() => {
      stage.apis.removeSprite(groupSprite);
      // 清空选中
      this.setState({ activeSpriteList: [], activeSpriteMap: {} });
    }, 0);
  };

  // 重置创建精灵
  public resetCreatingSprite = () => {
    this.creatingMouseEventHandler = () => true;
    this.stageDom.style.cursor = 'default';
    this.stage.apis.setCreatingSprite(null);
  };

  // 开始创建精灵
  public startCreatingSprite = ({
    sprite,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  }: {
    sprite: ISprite;
    onMouseDown?: (p: Point, e: React.MouseEvent) => void;
    onMouseMove?: (p: Point, e: MouseEvent) => void;
    onMouseUp?: (p: Point, e: MouseEvent) => void;
  }) => {
    const { stage, stageDom } = this;
    if (this.state.creatingSprite) {
      this.resetCreatingSprite();
    }
    // 获取鼠标点坐标
    const getMousePoint = (e: any) => {
      let event: any = e;
      const { target } = e;
      if (target && target.classList.contains('link-port-point-container')) {
        const rect = target.getBoundingClientRect();
        const { x, y, width, height } = rect;
        event = {
          pageX: x + width / 2,
          pageY: y + height / 2,
        };
      }
      const point = getOriginMousePointInSprite(event, sprite.attrs, stage);
      return point;
    };
    // 处理事件
    const eventHandler = (e: MouseEvent | React.MouseEvent) => {
      const { type } = e;
      e.stopPropagation();
      const p = getMousePoint(e);

      if ((type === 'pointerdown' || type === 'mousedown') && onMouseDown) {
        this.hadMouseDown = true;
        onMouseDown(p, e as React.MouseEvent);
      } else if ((type === 'pointermove' || type === 'mousemove') && onMouseMove && this.hadMouseDown) {
        onMouseMove(p, e as MouseEvent);
      } else if ((type === 'pointerup' || type === 'mouseup') && onMouseUp) {
        this.hadMouseDown = false;
        onMouseUp(p, e as MouseEvent);
      }
      return false;
    };
    this.creatingMouseEventHandler = eventHandler;

    stageDom.style.cursor = 'crosshair';
    stage.apis.setCreatingSprite(sprite);
  };

  // 获取锚点坐标
  public getPortCoordinate = (id: string, index: number) => {
    const { stage, registerSpriteMetaMap } = this;
    const { spriteList } = this.state;
    const { sprite } = findSpriteInSpriteList(spriteList, id);
    if (!sprite) {
      return null;
    }
    const meta = registerSpriteMetaMap[sprite.type];
    const point = getPortCoordinate({
      stage,
      sprite,
      meta,
      pointIndex: index,
    });
    return point;
  };

  public setStageSize = (size: ISize) => {
    this.setState({ size });
  };

  private readonly activeHandle = (sprite: ISprite) => {
    if (this.state.keyDownMap.pressMeta) {
      this.setActiveSprite(sprite);
    } else {
      this.setActiveSpriteList([sprite]);
    }
  };

  public copyActiveSpriteList = () => {
    const { activeSpriteList } = this.state;
    this.setState({
      shearPlate: { type: 'sprite', content: deepClone(activeSpriteList) },
    });
  };

  public cutActiveSpriteList = () => {
    const { activeSpriteList } = this.state;
    this.setState({
      shearPlate: { type: 'sprite', content: deepClone(activeSpriteList) },
    });
    this.removeActiveSprite();
  };

  public pasteActiveSpriteList = () => {
    const { shearPlate } = this.state;
    shearPlate.type === 'sprite' &&
      shearPlate.content.forEach((sprite: ISprite) => {
        const newSprite = { ...sprite, id: '' };
        const { x, y } = sprite.attrs.coordinate;
        newSprite.attrs = {
          ...sprite.attrs,
          coordinate: { x: x + 10, y: y + 10 },
        };
        this.addSprite(newSprite, true);
      });
  };

  // 获取点击的精灵
  private readonly getClickSprite = (e: React.MouseEvent) => {
    const spriteDom = findSpriteDomByClass(e.target, 'lego-sprite-container');
    const { spriteList } = this.state;
    if (!spriteDom) {
      return null;
    }
    const id = spriteDom.getAttribute('data-id');
    const sprite = spriteList.filter((item: ISprite) => item.id === id)[0];

    return sprite || null;
  };

  private readonly clickStageHandle = (e: any) => {
    if (this.props.editable === false) {
      return;
    }
    // 运行创建处理函数
    const stop = this.creatingMouseEventHandler?.(e);
    if (stop === false) {
      return;
    }
    const { activeSpriteMap, editingSprite } = this.state;
    const sprite = this.getClickSprite(e);
    if (sprite) {
      // 如果当前精灵已选中，则不取消其他精灵的选中状态
      !activeSpriteMap[sprite.id] && this.activeHandle(sprite);
      if (editingSprite && editingSprite.id !== sprite.id) {
        this.setEditingSprite(null);
      }
    } else if (e.target.classList.contains('lego-stage-container')) {
      this.setActiveSpriteList([]);
      this.setEditingSprite(null);
    }
  };

  private readonly handleDoubleClick = (e: React.MouseEvent) => {
    const sprite = this.getClickSprite(e);
    if (sprite) {
      this.setEditingSprite(sprite);
    }
  };

  private readonly handleStageMouseMove = (e: MouseEvent) => {
    // 运行创建处理函数
    this.creatingMouseEventHandler?.(e);
  };

  private readonly handleStageMouseUp = (e: MouseEvent) => {
    // 运行创建处理函数
    this.creatingMouseEventHandler?.(e);
  };

  // 获取舞台的大小和位置
  getStageInfo = () => {
    const stageDom = this.stageContainerRef.current;
    const info = stageDom.getBoundingClientRect();
    const stageParentDom = stageDom.parentNode;
    const { size } = this.state;
    const { width, height } = stageParentDom.getBoundingClientRect();
    const { width: stageWidth, height: stageHeight } = size;
    const scale = Math.min(width / stageWidth, height / stageHeight);
    const { x, y } = info;
    return {
      x,
      y,
      scale,
    };
  };

  handleWindowResizeChange = () => {};

  // 浏览器窗口大小变化，更新舞台位置
  handleWindowResize = () => {
    const { scale } = this.getStageInfo();
    this.setState({ scale }, () => {
      const { x, y } = this.getStageInfo();
      this.setState({ coordinate: { x, y } });
    });
  };

  // 控制连接桩是否显示，可连接的精灵正在操作
  getIsShowLinkPoints = () => {
    const { registerSpriteMetaMap } = this;
    const { activeSpriteList, creatingSprite } = this.state;
    const creatingSpriteMeta =
      creatingSprite && registerSpriteMetaMap[creatingSprite.type];
    const activeSpriteMeta =
      activeSpriteList.length === 1
        ? this.registerSpriteMetaMap[activeSpriteList[0]?.type]
        : null;
    const isShowLinkPoints =
      creatingSpriteMeta?.operation?.canConnect ||
      activeSpriteMeta?.operation?.canConnect;
    return Boolean(isShowLinkPoints);
  };

  getSpriteMeta = (sprite: ISprite | string) => {
    const type = typeof sprite === 'string' ? sprite : sprite.type;
    return this.registerSpriteMetaMap[type];
  };

  isSpriteActive = (sprite: ISprite | string) => {
    const type = typeof sprite === 'string' ? sprite : sprite.type;
    return Boolean(this.state.activeSpriteMap[type]);
  };

  render() {
    const { background, editable = true } = this.props;
    const {
      size,
      spriteList,
      activeSpriteList,
      activeSpriteMap,
      keyDownMap,
      scale = 1,
      ready,
    } = this.state;
    const { width, height } = size;
    const isShowLinkPoints = this.getIsShowLinkPoints();
    return (
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        ref={this.stageContainerRef}
        className="lego-stage-container"
        width={width}
        height={height}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
          outline: 'none',
        }}
        onPointerDown={this.clickStageHandle}
        onMouseMove={(e: any) => this.handleStageMouseMove(e)}
        onMouseUp={(e: any) => this.handleStageMouseUp(e)}
        onDoubleClick={this.handleDoubleClick}
        tabIndex={-1}>
        {background && (
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={background}
            stroke="none"
            style={{ pointerEvents: 'none' }}
          />
        )}
        {ready && (
          <UnderSpriteFeatureExtend
            scale={scale}
            stage={this.stage}
            activeSpriteList={activeSpriteList}
          />
        )}
        {spriteList.map(sprite => {
          const { type, id } = sprite;
          const meta: any = this.registerSpriteMetaMap[type];
          const active = Boolean(activeSpriteMap[id]);
          if (!meta) {
            console.warn('精灵不存在：', type);
            return null;
          }
          return (
            <LegoSprite
              key={sprite.id}
              className="lego-sprite-container"
              stage={this.stage}
              sprite={sprite}
              active={active}
              meta={meta}
              isShowLinkPoints={isShowLinkPoints}
              getSpriteMeta={this.getSpriteMeta}
              isSpriteActive={this.isSpriteActive}
            />
          );
        })}
        {editable && (
          <>
            <LegoActiveSpriteContainer
              scale={scale}
              activeSpriteList={activeSpriteList}
              registerSpriteMetaMap={this.registerSpriteMetaMap}
              stage={this.stage}
              pressShift={Boolean(keyDownMap.pressShift)}
            />
            {ready && (
              <FeatureExtend
                scale={scale}
                stage={this.stage}
                activeSpriteList={activeSpriteList}
              />
            )}
          </>
        )}
        {!editable && (
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="transparent"
            stroke="none"
            style={{ cursor: 'default' }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onMouseDown={(e: React.MouseEvent) => e.stopPropagation()}
            onMouseMove={(e: React.MouseEvent) => e.stopPropagation()}
            onMouseUp={(e: React.MouseEvent) => e.stopPropagation()}
          />
        )}
      </svg>
    );
  }
}

export default LegoStage;
