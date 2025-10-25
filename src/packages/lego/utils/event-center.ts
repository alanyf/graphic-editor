export type IEventHandler = (e: any) => void;

export interface ISubscribe {
  handler: IEventHandler;
}
export interface IEventMsg {
  name: string;
  subscribes: ISubscribe[];
}

/**
 * 事件中心
 */
class EventCenter {
  // 消息映射
  $msgMap: Record<string, IEventMsg> = {};

  // 发布
  emit(name: string, param: any) {
    const msg = this.$msgMap[name];
    if (msg) {
      msg.subscribes.forEach(subscribe => {
        subscribe.handler(param);
      });
    }
  }

  // 订阅
  on(name: string, handler: IEventHandler) {
    const msg = this.$msgMap[name];
    if (msg) {
      msg.subscribes.push({ handler });
    } else {
      this.$msgMap[name] = {
        name,
        subscribes: [{ handler }],
      };
    }
  }

  // 取消订阅
  off(name: string, handler: IEventHandler) {
    const msg = this.$msgMap[name];
    if (msg) {
      for (let i = 0; i < msg.subscribes.length; i += 1) {
        const subscribe = msg.subscribes[i];
        if (subscribe.handler === handler) {
          msg.subscribes.splice(i, 1);
          break;
        }
      }
    }
  }
}

export default EventCenter;
