export interface IShortcutOption {
  metaPress?: boolean;
  shiftPress?: boolean;
  altPress?: boolean;
}

export type ITriggerCallback = (opt: IShortcutOpt, e: KeyboardEvent) => void;

export interface IShortcutOpt {
  // 快捷键的名字，不能重复，否则会报错
  name: string;
  // 按键数组
  keys: string[];
  // 容器选择器，选择快捷键生效的触发区域，支持class选择器和id选择器，例如：['.title', '#root']
  containerSelectors?: string[];
  // 名称
  title?: string;
  // 配置
  option?: IShortcutOption;
}

export enum ShortcutNameEnum {
  copy = 'copy',
  cut = 'cut',
  paste = 'paste',
  redo = 'redo',
  undo = 'undo',
  save = 'save',
}
