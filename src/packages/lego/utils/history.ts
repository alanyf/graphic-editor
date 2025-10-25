// 最大历史栈长度
const MAX_HISTORY_LENGTH = 100;

// 获取数组最后一个元素
const last = (arr: any) => arr[arr.length - 1];
// 清空数组
const clear = (arr: any) => arr.splice(0, arr.length);

// // 历史记录
// export interface IHistory<RecordItem> {
//   currentValue: RecordItem;
//   push: (record: RecordItem) => void;
//   undo: () => void;
//   redo: () => void;
//   clear: () => void;
//   isFull: () => boolean;
//   length: () => number;
//   getHistoryStack: () => RecordItem[];
//   getUndoStack: () => RecordItem[][];
// }

/**
 * 历史记录构造函数版（栈为私有属性）
 * @param {number} maxLength 最大长度
 */
export class HistoryRecord<RecordItem> {
  currentValue: RecordItem;

  push: (record: RecordItem) => void;

  undo: () => void;

  redo: () => void;

  clear: () => void;

  isFull: () => boolean;

  getLength: () => number;

  getHistoryStack: () => RecordItem[];

  getUndoStack: () => RecordItem[][];

  constructor(maxLength: number = MAX_HISTORY_LENGTH) {
    // 历史记录栈
    const stack: RecordItem[] = [];
    // 撤销栈
    const undoStack: RecordItem[][] = [];
    // 最新的值
    this.currentValue = null as any;

    /**
     * 满
     */
    this.isFull = () => stack.length >= maxLength;

    /**
     * 历史栈长度
     */
    this.getLength = () => stack.length;

    /**
     * 获取历史栈
     */
    this.getHistoryStack = () => [...stack];

    /**
     * 获取撤销栈
     */
    this.getUndoStack = () => [...undoStack];

    /**
     * 添加历史记录
     * @param {*} value 历史记录值
     */
    this.push = (value: RecordItem) => {
      stack.push(value);
      clear(undoStack);
      this.currentValue = value;
      if (stack.length > maxLength) {
        stack.splice(0, 1);
      }
    };

    /**
     * 撤销
     */
    this.undo = () => {
      if (stack.length === 0) {
        return;
      }
      const value = stack.pop();
      undoStack.push([value as RecordItem]);
      this.currentValue = last(stack);
    };

    /**
     * 重做
     */
    this.redo = () => {
      if (undoStack.length === 0) {
        return;
      }
      const valueList = undoStack.pop();
      stack.push(...(valueList as RecordItem[]));
      this.currentValue = last(stack);
    };

    /**
     * 清空历史栈
     */
    this.clear = () => {
      undoStack.push([...stack]);
      clear(stack);
    };
  }
}
