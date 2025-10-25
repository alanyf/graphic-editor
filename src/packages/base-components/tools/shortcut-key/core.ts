import hotkeys from 'hotkeys-js';
import { getHotkeysStr, selectParents } from './helper';
import { IShortcutOpt, ITriggerCallback } from './types';

export class KeyBoardOperate {
  // 快捷键映射
  shortcutKeyMap: Record<string, IShortcutOpt[]> = {};

  onTrigger: ITriggerCallback;

  preventDefault: boolean = true;

  clickEle: any;

  constructor({
    shortcutOpts = [],
    preventDefault = true,
    onTrigger = () => '',
  }: {
    shortcutOpts: IShortcutOpt[];
    preventDefault?: boolean;
    onTrigger?: ITriggerCallback;
  }) {
    this.preventDefault = preventDefault;
    this.onTrigger = (opt: IShortcutOpt, e: KeyboardEvent) => {
      onTrigger?.(opt, e);
    };
    shortcutOpts.forEach(opt => this.registerShortcutKey(opt));
    document.addEventListener('click', (e: MouseEvent) => {
      this.clickEle = e.target;
    });
  }

  /**
   * 注册快捷键
   *
   * @param shortcutOpt - 快捷键操作
   * @param shortcutOpt.name - 快捷键操作名字，同时作为映射的key，要保证唯一性
   * @param shortcutOpt.keys - 按键数组
   * @param shortcutOpt.option - 配置
   */
  public registerShortcutKey(shortcutOpt: IShortcutOpt) {
    const { name, keys } = shortcutOpt;
    if (!Array.isArray(keys)) {
      throw new Error('注册快捷键时, keys 参数是必要的!');
    }
    // 避免重复
    if (this.shortcutKeyMap[name]) {
      throw new Error(`快捷键操作「${name}」已存在，请更换`);
    }
    this.addEventListener(shortcutOpt);
  }

  public removeAllEventListener() {
    hotkeys.unbind();
  }

  private addEventListener(shortcutOpt: IShortcutOpt) {
    const keyStr = getHotkeysStr(shortcutOpt);
    hotkeys(keyStr, (e: KeyboardEvent) => this.handleKeyTrigger(e, shortcutOpt));
  }

  private removeEventListener(shortcutOpt: IShortcutOpt) {
    const keyStr = getHotkeysStr(shortcutOpt);
    hotkeys.unbind(keyStr);
  }

  private handleKeyTrigger = (event: KeyboardEvent, shortcutOpt: IShortcutOpt) => {
    if (this.preventDefault) {
      event.preventDefault();
    }
    // 如果配置了生效区域，但是触发快捷键的节点不在容器里，就认为是无效操作
    const { containerSelectors = [] } = shortcutOpt;
    if (containerSelectors.length > 0) {
      const parents = selectParents(this.clickEle, containerSelectors);
      if (parents.length === 0) {
        return;
      }
    }
    // 成功命中快捷键
    this.onTrigger(shortcutOpt, event);
  };
}
