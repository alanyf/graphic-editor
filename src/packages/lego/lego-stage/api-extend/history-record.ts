import { ISprite, IStageApis } from "@packages/lego/interface";
import { HistoryRecord } from "@packages/lego/utils/history";

export class HistoryExtend {
  stage: IStageApis;

  private history = new HistoryRecord<string>(100);

  constructor(stage: IStageApis) {
    this.stage = stage;
  }

  // 历史记录 - 添加
  public pushHistory = (spriteList: ISprite[]) => {
    const { history } = this;
    const { getMetaData } = this.stage.apis;
    history.push(
      JSON.stringify({
        ...getMetaData(),
        children: spriteList,
      }),
    );
  };

  // 历史记录 - 撤销
  public undo = () => {
    const { history } = this;
    if (history.getLength() > 1) {
      history.undo();
      history.currentValue &&
        this.stage.apis.setSpriteList(JSON.parse(history.currentValue).children, false);
    }
  };

  // 历史记录 - 重做
  public redo = () => {
    const { history } = this;
    history.redo();
    history.currentValue &&
      this.stage.apis.setSpriteList(JSON.parse(history.currentValue).children, false);
  };

  // 记录当前历史记录
  public recordHistory = () => {
    const { spriteList } = this.stage.store();
    this.pushHistory(spriteList);
  };
}
