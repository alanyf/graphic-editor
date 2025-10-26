 
import React from 'react';
import { Button, Drawer, Input, Switch, Popover, message, Select, Slider } from 'antd';
import type {
  ISprite,
  IStageApis,
  IGridLine,
  IAdsorbLine,
  ICoordinate,
  IImageInfo,
} from '@packages/lego';
import { LegoTools } from '@packages/lego';
import {
  DownloadOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ExportOutlined,
  SettingOutlined,
  CaretDownOutlined,
  CodepenOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { ColorBlock } from '@packages/base-components';
import ColorPicker from 'color-selector-react';
import SmallTooltip from '../SmallTooltip';
import Toolbar from '../toolbar';
import GraphicPanel from '../graphic-panel';
import PopoverTool from '../popover-tool';
import { templateList } from '../../default-meta';
import Logo from './icon/logo';
import UndoIcon from './icon/undo-icon';
import RedoIcon from './icon/redo-icon';
import TextareaIcon from './icon/textarea-icon';
import ImageIcon from './icon/image-icon';
import LinkIcon from './icon/link-icon';
import GraphicIcon from './icon/graphic-icon';

import ExportPngIcon from './icon/export-png-icon';
import { getSpriteInitMeta } from './init-sprite-meta';
import './index.less';
import GridIcon from './icon/grid-icon';

const { getClipboardContent, downloadBase64File, downloadFile, isInputting } =
  LegoTools;

const getBase64ImageInfo = (
  base64: string,
): Promise<{ base64: string; width: number; height: number; img: any }> =>
  new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.src = base64;
    img.onerror = (err: any) => reject(err);
    img.onload = () => {
      resolve({
        base64,
        width: img.width,
        height: img.height,
        img,
      });
    };
  });
/**
 * 获取上传图片文件的信息
 * @param e
 * @returns
 */
const getImageInfo = (
  e: any,
): Promise<{ base64: string; width: number; height: number; img: any }> =>
  new Promise((resolve, reject) => {
    const file = new FileReader();
    file.onload = (e: any) => {
      const base64 = e.target.result;
      getBase64ImageInfo(base64)
        .then((info: any) => resolve(info))
        .catch(err => reject(err));
    };
    if (e.target.files && e.target.files.length > 0) {
      file.readAsDataURL(e.target.files[0]);
    }
    file.onerror = (err: any) => reject(err);
  });

interface IProps {
  stage: IStageApis;
  activeSpriteList: ISprite[];
  editingSprite: ISprite | null;
  editable?: boolean;
  gridLine: IGridLine;
  adsorbLine: IAdsorbLine;
  onEditableChange?: (editable: boolean) => void;
  onGridLineChange: (e: IGridLine) => void;
  onAdsorbLineChange: (e: IAdsorbLine) => void;
  onBackgroundChange: (bg: string) => void;
  onFullscreenChange?: () => void;
}
interface IState {
  showMeta: boolean;
  metaStr: string;
  graphicPopoverVisible: boolean;
  exportPngConfig: IImageInfo;
}

class Header extends React.Component<IProps, IState> {
  readonly state: IState = {
    showMeta: false,
    metaStr: '',
    graphicPopoverVisible: false,
    exportPngConfig: {
      background: 'transparent',
      scale: 2,
      suffix: 'jpg',
    },
  };

  addSprite = (spriteType: string) => {
    const { stage } = this.props;
    let type = spriteType;
    type = type[0].toUpperCase() + type.slice(1);
    const spriteLike = getSpriteInitMeta({ type, stage });
    const sprite = stage.apis.addSprite(spriteLike, true);
    if (sprite && !sprite.attrs.creating) {
      stage.apis.setActiveSpriteList([sprite]);
    }
    return sprite;
  };

  handleAddImageToStage = (e: any) => {
    getImageInfo(e)
      .then(params => {
        this.addImageSprite(params);
      })
      .catch(err => message.error(`上传文件失败, ${err}`));
  };

  // 添加图片精灵
  addImageSprite = (params: any) => {
    const { base64 } = params;
    let { width, height } = params;
    const { stage } = this.props;
    const { size } = stage.store();
    if (width > size.width || height > size.height) {
      const rate = Math.min(size.width / width, size.height / height);
      width *= rate;
      height *= rate;
    }
    const sprite: any = {
      type: 'ImageSprite',
      props: { url: base64 },
      attrs: {
        size: { width, height },
        coordinate: {
          x: (size.width - width) / 2,
          y: (size.height - height) / 2,
        },
      },
    };
    return stage.apis.addSprite(sprite, true);
  };

  private readonly pasteHandle = async (e: any) => {
    if (isInputting()) {
      return;
    }
    const { stage } = this.props;
    const res: any = await getClipboardContent(e);
    const { size: stageSize } = stage.store();
    const getSpriteCenterInStage = (width: number, height: number) =>
      ({
        x: stageSize.width / 2 - width / 2,
        y: stageSize.height / 2 - height / 2,
      } as ICoordinate);
    if (res.type === 'string' && res.string) {
      const sprite = stage.apis.addSprite(
        {
          type: 'RichTextSprite',
          props: { content: res.string },
          attrs: {
            coordinate: getSpriteCenterInStage(400, 30),
            size: { width: 400, height: 40 },
          },
        } as any,
        true,
      );
      sprite && stage.apis.setActiveSpriteList([sprite]);
    } else if (res.type === 'images') {
      res.images.forEach(async ({ base64 }: { base64: string }) => {
        const info = await getBase64ImageInfo(base64);
        const sprite = this.addImageSprite(info);
        sprite && stage.apis.setActiveSpriteList([sprite]);
      });
    }
  };

  saveMeta = () => {
    try {
      const { stage } = this.props;
      const { metaStr } = this.state;
      const meta = JSON.parse(metaStr);
      stage.apis.setSpriteList(meta.children, true);
      this.props?.onBackgroundChange(meta.background || '');
    } catch (err) {
      console.error('解析json数据失败！', err);
    }
  };

  showMetaDrawer = () => {
    const { output } = this.props.stage.apis;
    this.setState({
      metaStr: JSON.stringify(output.exportData().meta, null, 4),
      showMeta: true,
    });
  };

  previewSvg = async () => {
    const { output } = this.props.stage.apis;
    const svg = await output.exportSvg();
    const newWin: any = window.open('', '_blank');
    newWin.document.write(svg);
    newWin.document.title = 'svg';
    newWin.document.close();
  };

  getStageImageInfo = async ({
    background = '',
    scale = 2,
    suffix = 'png',
  }: IImageInfo) => {
    const { output } = this.props.stage.apis;
    return output
      .exportPNG({ background, scale, suffix })
      .catch(() => null);
  };

  previewPNG = async (imgInfo: IImageInfo) => {
    const res = await this.getStageImageInfo(imgInfo);
    if (!res) {
      message.error('导出图片失败');
      return;
    }
    const { base64, width, height } = res;
    const newWin: any = window.open('', '_blank');
    const imgHtml = `
      <img
        style="
          width: ${width}px;
          height: ${height}px;
          margin: 0 auto;
          display: block;
          box-shadow: 0 0 5px 5px  rgba(0,0,0,0.1);
          margin-top: 30px;
        "
        src="${base64}"
      />
    `;
    newWin.document.write(imgHtml);
    newWin.document.title = 'png';
    newWin.document.close();
  };

  downloadPng = async (imgInfo: IImageInfo) => {
    const { suffix = 'png' } = imgInfo;
    if (suffix === 'jpg') {
       
      imgInfo.background = '#fff';
    }
    const res = await this.getStageImageInfo(imgInfo);
    if (!res) {
      message.error('导出图片失败');
      return;
    }
    downloadBase64File(res.base64, `${Date.now()}.${suffix}`);
  };

  downloadSvg = async () => {
    const { output } = this.props.stage.apis;
    let svg = await output.exportSvg();
    const stage = document.querySelector('.lego-stage-container');
    if (stage) {
      svg = new XMLSerializer().serializeToString(stage);
      // const base64 = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
      downloadFile(`${Date.now()}.svg`, svg as string);
    }
  };

  componentDidMount() {
    setTimeout(() => {
      const { stageDom } = this.props.stage?.store();
      stageDom?.addEventListener('paste', this.pasteHandle, false);
    }, 1000);
  }

  componentWillUnmount() {
    const { stageDom } = this.props.stage?.store();
    stageDom?.removeEventListener('paste', this.pasteHandle, false);
  }

  render() {
    const {
      editable = true,
      stage,
      gridLine,
      adsorbLine,
      editingSprite,
      activeSpriteList,
      onGridLineChange,
      onAdsorbLineChange,
    } = this.props;
    const { showMeta, metaStr, graphicPopoverVisible, exportPngConfig } =
      this.state;
    const buttonSize = 'small';
    return (
      <header className="lego-showcase-header">
        <Logo style={{ marginRight: '20px' }} />

        <SmallTooltip title="撤回">
          <UndoIcon
            className="toolbar-icon"
            onClick={() => stage.apis.history.undo()}
          />
        </SmallTooltip>

        <SmallTooltip title="重做">
          <RedoIcon
            className="toolbar-icon"
            onClick={() => stage.apis.history.redo()}
          />
        </SmallTooltip>

        <SmallTooltip title="文本">
          <TextareaIcon
            className="toolbar-icon"
            onClick={() => this.addSprite('RichText')}
          />
        </SmallTooltip>
        <SmallTooltip title="图片">
          <div className="image-upload-input-container">
            <ImageIcon className="toolbar-icon" />
            <input
              className="image-upload-input"
              type="file"
              onChange={this.handleAddImageToStage}
              accept="image/png,image/gif,image/jpeg,image/svg"
            />
          </div>
        </SmallTooltip>
        <SmallTooltip title="链接">
          <LinkIcon
            className="toolbar-icon"
            onClick={() => this.addSprite('Link')}
          />
        </SmallTooltip>
        <Popover
          visible={graphicPopoverVisible}
          placement="bottomLeft"
          onVisibleChange={(visible: boolean) =>
            this.setState({ graphicPopoverVisible: visible })
          }
          content={
            <GraphicPanel
              onClick={(e: any) => {
                const newSprite = this.addSprite(e.name);
                this.setState({ graphicPopoverVisible: false });
                if (e.editing) {
                  stage.apis.setEditingSprite(newSprite);
                }
              }}
            />
          }
          trigger="click">
          <SmallTooltip placement="top" title="几何图形">
            <div
              className="toolbar-icon"
              style={{ display: 'flex', alignItems: 'center' }}>
              <GraphicIcon />
              <CaretDownOutlined style={{ fontSize: '10px', color: '#666' }} />
            </div>
          </SmallTooltip>
        </Popover>

        <Toolbar
          stage={stage}
          editingSprite={editingSprite}
          activeSpriteList={activeSpriteList}
          activeSprite={activeSpriteList[0] || null}
        />

        <div style={{ marginLeft: 'auto' }}></div>

        <SmallTooltip
          title={
            <>
              <h3>查看模版</h3>
              <div className="template-meta-list">
                {templateList.map((item: any) => (
                  <div
                    key={item.title}
                    className="template-meta-item"
                    onClick={() => {
                      this.props.stage.apis.setSpriteList(item.spriteList);
                      this.props?.onBackgroundChange(item.background || '');
                    }}>
                    {item.title}
                  </div>
                ))}
              </div>
            </>
          }>
          <CodepenOutlined />
        </SmallTooltip>

        <SmallTooltip
          title={
            <>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  padding: '6px 4px',
                }}>
                是否可以编辑：
                <Switch
                  checkedChildren="可以"
                  unCheckedChildren="不可以"
                  checked={editable}
                  onChange={(checked: boolean) =>
                    this.props?.onEditableChange?.(checked)
                  }
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  padding: '6px 4px',
                }}>
                是否开启对齐吸附功能：
                <Switch
                  checkedChildren="关闭"
                  unCheckedChildren="打开"
                  checked={adsorbLine.enable}
                  onChange={(checked: boolean) =>
                    onAdsorbLineChange({ ...adsorbLine, enable: checked })
                  }
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  padding: '6px 4px',
                }}>
                是否显示对齐吸附线：
                <Switch
                  checkedChildren="隐藏"
                  unCheckedChildren="显示"
                  checked={adsorbLine.visible}
                  onChange={(checked: boolean) =>
                    onAdsorbLineChange({ ...adsorbLine, visible: checked })
                  }
                />
              </div>
            </>
          }>
          <Button
            type="text"
            size={buttonSize}
            style={{ marginLeft: '5px' }}
            icon={<SettingOutlined />}
            onClick={this.showMetaDrawer}
          />
        </SmallTooltip>

        <SmallTooltip
          zIndex={2}
          title={
            <div style={{ width: 240, zIndex: 10000, position: 'relative' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  padding: '6px 4px',
                }}>
                是否开启网格功能：
                <Switch
                  checkedChildren="关闭"
                  unCheckedChildren="打开"
                  checked={gridLine.enable}
                  onChange={(checked: boolean) =>
                    onGridLineChange({ ...gridLine, enable: checked })
                  }
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                  padding: '6px 4px',
                }}>
                是否显示网格：
                <Switch
                  checkedChildren="隐藏"
                  unCheckedChildren="显示"
                  checked={gridLine.visible}
                  onChange={(checked: boolean) =>
                    onGridLineChange({ ...gridLine, visible: checked })
                  }
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '6px 4px' }}>
                网格大小：
                <Slider
                  value={gridLine.spacing}
                  min={5}
                  max={100}
                  style={{ flexGrow: 1 }}
                  onChange={(spacing) => onGridLineChange({ ...gridLine, spacing })}
                />
                {gridLine.spacing}px
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '6px 4px' }}>
                网格吸附距离：
                <Slider
                  value={gridLine.adsorbDis}
                  min={0}
                  max={gridLine.spacing}
                  style={{ flexGrow: 1 }}
                  onChange={(adsorbDis) => onGridLineChange({ ...gridLine, adsorbDis })}
                />
                {gridLine.adsorbDis}px
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '6px 4px' }}>
                网格样式：
                <Select
                  size='small'
                  value={gridLine.theme}
                  options={[
                    { label: '点', value: 'Point' },
                    { label: '实线', value: 'SolidLine' },
                    { label: '虚线', value: 'DottedLine' },
                  ]}
                  style={{ flexGrow: 1 }}
                  onSelect={(theme) => onGridLineChange({ ...gridLine, theme })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', padding: '6px 4px' }}>
                网格颜色：
                <PopoverTool
                  overlayClassName="no-bg-popover"
                  placement="left"
                  icon={<ColorBlock color={gridLine.customStyle?.stroke} />}
                  content={
                    <ColorPicker
                      color={gridLine.customStyle?.stroke}
                      onChange={({ color }) => {
                        this.setState({
                          exportPngConfig: {
                            ...exportPngConfig,
                            background: color,
                          },
                        });
                        onGridLineChange({
                          ...gridLine,
                          customStyle:{
                            ...(gridLine.customStyle || {}),
                            stroke: color,
                          },
                        });
                      }}
                    />
                  }
                />
              </div>
            </div>
          }
        >
          <GridIcon />
        </SmallTooltip>

        <SmallTooltip title="查看原数据">
          <Button
            type="text"
            size={buttonSize}
            style={{ marginLeft: '5px' }}
            icon={
              !showMeta ? (
                <EyeOutlined style={{ fontSize: '16px' }} />
              ) : (
                <EyeInvisibleOutlined style={{ fontSize: '16px' }} />
              )
            }
            onClick={this.showMetaDrawer}
          />
        </SmallTooltip>

        <SmallTooltip
          placement="leftBottom"
          trigger="click"
          zIndex={2}
          title={
            <div style={{ width: '160px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 4px',
                }}>
                背景填充：
                <PopoverTool
                  overlayClassName="no-bg-popover"
                  placement="left"
                  icon={<ColorBlock color={exportPngConfig.background} />}
                  content={
                    <ColorPicker
                      color={exportPngConfig.background}
                      onChange={({ color }) => {
                        this.setState({
                          exportPngConfig: {
                            ...exportPngConfig,
                            background: color,
                          },
                        });
                        this.props?.onBackgroundChange(color);
                      }}
                    />
                  }
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 4px',
                }}>
                清晰度：
                <Select
                  style={{ width: '80px' }}
                  size="small"
                  defaultValue={exportPngConfig.scale}
                  options={[
                    { label: '普通', value: 1 },
                    { label: '清晰', value: 2 },
                    { label: '高清', value: 4 },
                    { label: '超清', value: 6 },
                    { label: '超高清', value: 10 },
                  ]}
                  onChange={(value: number) =>
                    this.setState({
                      exportPngConfig: { ...exportPngConfig, scale: value },
                    })
                  }
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 4px',
                }}>
                文件类型：
                <Select
                  size="small"
                  defaultValue={exportPngConfig.suffix}
                  options={[
                    { label: '.png', value: 'png' },
                    { label: '.jpg', value: 'jpg' },
                  ]}
                  onChange={(value: any) =>
                    this.setState({
                      exportPngConfig: { ...exportPngConfig, suffix: value },
                    })
                  }
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px 4px',
                }}>
                <Button
                  size="small"
                  onClick={() => this.previewPNG(exportPngConfig)}>
                  预览图片
                </Button>
                <Button
                  size="small"
                  type="primary"
                  style={{ marginLeft: '8px' }}
                  onClick={() => this.downloadPng(exportPngConfig)}>
                  下载图片
                </Button>
              </div>
            </div>
          }>
          <Button
            type="text"
            size={buttonSize}
            icon={<ExportPngIcon style={{ fontSize: '16px' }} />}
          />
        </SmallTooltip>

        <SmallTooltip title={'全屏显示'}>
          <Button
            type="text"
            size={buttonSize}
            icon={<FullscreenOutlined style={{ fontSize: '16px' }} />}
            onClick={this.props?.onFullscreenChange}
          />
        </SmallTooltip>

        <SmallTooltip title="查看svg">
          <Button
            type="text"
            size={buttonSize}
            icon={<ExportOutlined style={{ fontSize: '16px' }} />}
            onClick={this.previewSvg}
          />
        </SmallTooltip>

        <SmallTooltip title="下载svg">
          <Button
            type="text"
            size={buttonSize}
            icon={<DownloadOutlined style={{ fontSize: '16px' }} />}
            onClick={this.downloadSvg}
          />
        </SmallTooltip>

        <Drawer
          title="元数据"
          placement="right"
          width="400"
          closable={true}
          onClose={() => this.setState({ showMeta: false })}
          visible={showMeta}>
          <Input.TextArea
            style={{
              width: '100%',
              height: '90%',
              borderRadius: '3px',
              border: '1px solid #eee',
              overflow: 'auto',
            }}
            value={metaStr}
            onChange={(e: any) => this.setState({ metaStr: e.target.value })}
          />
          <Button style={{ marginTop: '10px' }} onClick={this.saveMeta}>
            保存
          </Button>
        </Drawer>
      </header>
    );
  }
}

export default Header;
