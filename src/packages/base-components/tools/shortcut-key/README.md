# 快捷键配置


## 介绍
> 通用的前端快捷键配置


## 使用方法


```ts
import { ContextMenu, IMenuItem } from 'context-menu';

// 快捷键配置数据
export const shortcutOpts: IShortcutOpt[] = [
  {
    name: ShortcutNameEnum.copy,
    title: '复制',
    keys: ['c'],
    // 配置生效的区域
    containerSelectors: ['.div-1'],
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
];

new KeyBoardOperate({
  shortcutOpts,
  preventDefault: true,
  onTrigger: (opt: IShortcutOpt, e) => {
    console.info('bingo', opt, e);
  },
});

```


## 类型

```ts
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
```
