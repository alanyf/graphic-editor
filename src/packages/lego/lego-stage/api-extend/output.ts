import { IStageApis } from '@packages/lego/interface';
import { deepClone, getSvgHtml, IImageInfo, sleep, svgDomToPNGBase64 } from '@packages/lego/utils/tools';
import { getScreenShotAreaByDom } from '../helper';

export class OutputExtend {
  stage: IStageApis;

  constructor(stage: IStageApis) {
    this.stage = stage;
  }

  /**
   * 导出png base64图片
   * @param info IImageInfo
   * @returns
   */
  public exportPNG = async (info?: IImageInfo) => {
    const { stage } = this;
    const { stageDom } = stage.store();
    const svgDom: any = stageDom.cloneNode(true);
    svgDom.style.transform = 'scale(1)';
    svgDom.style.position = 'absolute';
    svgDom.style.zIndex = -1;
    svgDom.style.top = 0;
    svgDom.style.left = 0;

    document.body.appendChild(svgDom);
    await sleep(100);
    const rect = this.getScreenShotRect(svgDom);
    stage.apis.setActiveSpriteList([]);
    await sleep(0);
    const result = await svgDomToPNGBase64(svgDom, { ...rect, ...info });

    document.body.removeChild(svgDom);
    return result;
  };

  /**
   * 导出svg
   * @returns svg string
   */
  public exportSvg = () => {
    const { stage } = this;
    const { stageDom } = stage.store();
    stage.apis.setActiveSpriteList([]);
    stage.apis.setEditingSprite(null);
    return new Promise(resolve => {
      setTimeout(() => {
        const svgStr = getSvgHtml(stageDom);
        resolve(svgStr);
      }, 0);
    });
  };

  /**
   * 导出数据
   * @returns svg string
   */
  public exportData = () => {
    const { stage } = this;
    const { getMetaData } = stage.apis;
    return { meta: deepClone(getMetaData()) };
  };

  private getScreenShotRect = (stageDom: any) => {
    const spriteDomList = stageDom.querySelectorAll('.lego-sprite-container');
    return getScreenShotAreaByDom(
      spriteDomList,
      stageDom.getBoundingClientRect(),
    );
  };
}
