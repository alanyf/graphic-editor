import { getOS } from '../utils/tools';

export const isMac = getOS() === 'Mac';

export enum KeyBoardOptEnum {
  copy = 'copy', // 复制
  cut = 'cut', // 剪切
  paste = 'paste', // 粘贴
  delete = 'delete', // 删除
  undo = 'undo', // 撤销
  redo = 'redo', // 重做
  search = 'search', // 搜索
  none = 'none',
  selectAll = 'selectAll',
  up = 'up',
  down = 'down',
  left = 'left',
  right = 'right',
}

export const pressMeta = (e: KeyboardEvent) => (isMac ? e.metaKey : e.ctrlKey);

export const pressShift = (e: KeyboardEvent) => e.shiftKey;

/**
 * 获得操作名称
 * @param map 键盘按下映射
 * @returns 操作
 */
export const getOptType = (e: KeyboardEvent): KeyBoardOptEnum => {
  const metaPress = pressMeta(e);
  const shiftPress = pressShift(e);
  const map = { [e.code]: true };
  // 删除
  if (map.Backspace) {
    return KeyBoardOptEnum.delete;
  }
  // 复制
  if (metaPress && map.KeyC) {
    return KeyBoardOptEnum.copy;
  }
  // 剪切
  if (metaPress && map.KeyX) {
    return KeyBoardOptEnum.cut;
  }
  // 粘贴
  if (metaPress && map.KeyV) {
    return KeyBoardOptEnum.paste;
  }
  // 全选
  if (metaPress && map.KeyA) {
    return KeyBoardOptEnum.selectAll;
  }
  // 重做
  if (metaPress && shiftPress && map.KeyZ) {
    return KeyBoardOptEnum.redo;
  }
  // 撤销
  if (metaPress && map.KeyZ) {
    return KeyBoardOptEnum.undo;
  }
  // 上
  if (map.ArrowUp) {
    return KeyBoardOptEnum.up;
  }
  // 下
  if (map.ArrowDown) {
    return KeyBoardOptEnum.down;
  }
  // 左
  if (map.ArrowLeft) {
    return KeyBoardOptEnum.left;
  }
  // 右
  if (map.ArrowRight) {
    return KeyBoardOptEnum.right;
  }
  // 默认为none
  return KeyBoardOptEnum.none;
};
