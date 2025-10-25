import { IShortcutOpt, ShortcutNameEnum } from './types';

/**
 * 快捷键配置
 */
export const shortcutOpts: IShortcutOpt[] = [
  {
    name: ShortcutNameEnum.copy,
    title: '复制',
    keys: ['c'],
    containerSelectors: ['.div-1'],
    option: { metaPress: true },
  },
  {
    name: ShortcutNameEnum.cut,
    title: '剪切',
    keys: ['x'],
    option: { metaPress: true },
  },
  {
    name: ShortcutNameEnum.paste,
    title: '粘贴',
    keys: ['v'],
    option: { metaPress: true },
  },
  {
    name: ShortcutNameEnum.redo,
    title: '撤销',
    keys: ['z'],
    option: { metaPress: true },
  },
  {
    name: ShortcutNameEnum.undo,
    title: '重做',
    keys: ['z'],
    option: { metaPress: true, shiftPress: true },
  },
  {
    name: ShortcutNameEnum.save,
    title: '保存快照',
    keys: ['s'],
    option: { metaPress: true },
  },
];
