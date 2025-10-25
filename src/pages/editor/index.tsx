/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import LegoStage, { IGridThemeEnum, SpritesMeta as SpriteMetaObj } from '@packages/lego';
import type {
  IReadyContext,
  IStageApis,
  ISprite,
  IGridLine,
  IAdsorbLine,
} from '@packages/lego';
import defaultMeta from './default-meta';
import Header from './components/header';
import './index.less';

interface IState {
  background: string;
  editable: boolean;
  stage: IStageApis;
  activeSpriteList: ISprite[];
  editingSprite: ISprite | null;
  gridLine: IGridLine;
  adsorbLine: IAdsorbLine;
}

class LegoShowcase extends React.Component<any, IState> {
  legoStageRef: any = React.createRef();

  readonly state: IState = {
    background: '',
    editable: true,
    stage: null as any,
    activeSpriteList: [],
    editingSprite: null,
    gridLine: {
      enable: false,
      visible: true,
      theme: IGridThemeEnum.Point,
      spacing: 50,
      adsorbDis: 8,
      customStyle: { stroke: '#000' },
    },
    adsorbLine: {
      enable: true,
      visible: true,
      distance: 5,
      maximum: 5,
    },
  };

  onReady = ({ stage }: IReadyContext) => {
    const spriteMetaList: any[] = [];
    Object.keys(SpriteMetaObj).forEach((key: string) => {
      if (key.includes('Meta')) {
        spriteMetaList.push({ key, meta: (SpriteMetaObj as any)[key] });
      }
    });
    spriteMetaList.forEach(({ meta }) => {
      stage.apis.registerSprite(meta);
    });

    stage.apis.setSpriteList(defaultMeta as any, true);
    console.log(defaultMeta);
    this.setState({ stage });
    stage.apis.handleWindowResize();
  };

  setBackground = (bg: string) => {
    this.setState({ background: bg });
  };

  getActiveSpriteList = () => {
    const { stage } = this.state;
    if (!stage) {
      return;
    }
    this.setState({ activeSpriteList: stage.store().activeSpriteList });
  };

  onActiveSpriteChange = (activeSpriteList: ISprite[]) => {
    this.setState({ activeSpriteList });
  };

  onEditingSpriteChange = (editingSprite: ISprite | null) => {
    this.setState({ editingSprite });
  };

  // updateStageContainerSize = () => {
  //   const stageDom = document.querySelector('.lego-showcase-content');
  //   if (!stageDom) {
  //     return;
  //   }
  //   const { stage } = this.state;
  //   const { width, height } = stageDom?.getBoundingClientRect();
  //   const { width: stageWidth } = stage.store().size;
  //   const scale = width / stageWidth;
  //   this.setState({ scale });
  //   // stage?.apis.handleWindowResize();
  // };

  // componentDidMount() {
  //   window.addEventListener('resize', this.updateStageContainerSize);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.updateStageContainerSize);
  // }

  render() {
    const {
      background = '',
      editable = true,
      stage,
      activeSpriteList,
      editingSprite,
      gridLine,
      adsorbLine,
    } = this.state;
    return (
      <div className="lego-showcase-container">
        <Header
          stage={stage}
          editable={editable}
          gridLine={gridLine}
          adsorbLine={adsorbLine}
          activeSpriteList={activeSpriteList}
          editingSprite={editingSprite}
          onGridLineChange={(gridLine: IGridLine) =>
            this.setState({ gridLine })
          }
          onAdsorbLineChange={(adsorbLine: IAdsorbLine) =>
            this.setState({ adsorbLine })
          }
          onBackgroundChange={this.setBackground}
          onEditableChange={(v: boolean) => this.setState({ editable: v })}
          onFullscreenChange={() => {
            const content = document.querySelector('.lego-showcase-content');
            content?.requestFullscreen();
            setTimeout(() => {
              this.state.stage?.apis.handleWindowResize();
            }, 1000);
          }}
        />
        <div
          className={`lego-showcase-content ${
            editable ? 'lego-showcase-content-disable' : ''
          }`}>
          <LegoStage
            ref={this.legoStageRef}
            background={background}
            editable={editable}
            gridLine={gridLine}
            adsorbLine={adsorbLine}
            WHRatio={'16:9'}
            onReady={this.onReady}
            onActiveSpriteChange={this.onActiveSpriteChange}
            onEditingSpriteChange={this.onEditingSpriteChange}
          />
        </div>
      </div>
    );
  }
}

export default LegoShowcase;
