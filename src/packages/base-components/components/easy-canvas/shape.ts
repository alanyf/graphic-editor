import type { IListener, Point } from './interface';
import type { IHandler } from './interface';

// 图形的基类
class Shape {
  type = 'shape';
  props: any;
  listenerMap: Map<string, IListener[]> = new Map();
  on(eventName: string, listener: IHandler, onlySelf = true) {
    const listenerObj: IListener = {
      eventName,
      handler: listener,
      onlySelf,
    };
    if (this.listenerMap.has(eventName)) {
      this.listenerMap.get(eventName)?.push(listenerObj);
    } else {
      this.listenerMap.set(eventName, [listenerObj]);
    }
  }
  off(eventName: string, listener: IHandler) {
    if (this.listenerMap.has(eventName)) {
      const listeners = this.listenerMap.get(eventName) || [];
      for (let i = 0; i < listeners.length; i += 1) {
        if (listeners[i].handler === listener) {
          listeners.splice(i, 1);
          return;
        }
      }
    }
  }
  isPointInClosedRegion(point: Point) {
    console.log(point);
    return false;
  }
}

export default Shape;
