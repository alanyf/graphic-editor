/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable max-lines, max-statements */
import React, { ClipboardEvent } from 'react';
import { distance, getControlPoints, rotate } from '@packages/geometry-tools';
import type {
  ICoordinate,
  IPointOption,
  ISprite,
  ISpriteAttrs,
  ISpriteMeta,
  IStageApis,
  Point,
} from '../interface';
import { PortReferEnum, PortUnitEnum } from '../interface';

/**
 * Object.prototype.toString.call封装的数据类型判断工具
 * @method typeOf
 * @param {Any} param 需要判断类型的参数
 * @return {String} 小写类型字符串，例如'string' 'array' 'function'
 */
export function typeOf(param: any) {
  return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
}

/**
 * 对象深拷贝
 * @method deepClone
 * @param {Object} obj 对象输入
 * @return {Object}
 */
export function deepClone(obj: Record<string, unknown> | any[]) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 对象深拷贝
 * @method deepClone
 * @param {Object} obj 对象输入
 * @return {Object}
 */
export function createUuid() {
  const UUID_SIZE = 8;
  const repo = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  const getRandom = () => Math.floor(Math.random() * repo.length);
  for (let i = 0; i < UUID_SIZE; i += 1) {
    result += repo[getRandom()];
  }
  return result;
}

/**
 * 防抖
 */
export function debounce(fn: (e: any) => any, delay: number) {
  let timer: any = null;
  return () => {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    clearTimeout(timer); // 清除重新计时
    timer = setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      fn.apply(null, args as any);
    }, delay || 500);
  };
}

/**
 * 根据类名寻找父元素
 * @param dom dom元素
 * @param className css类名
 * @return dom | null
 */
export function findParentByClass(dom: any, className: string): any {
  if (!dom || dom.tagName === 'BODY') {
    return null;
  }
  if (dom.classList.contains(className)) {
    return dom;
  }
  return findParentByClass(dom.parentNode, className);
}

/**
 * 非递归遍历树和处理节点
 * @method traversalTree
 * @param {Object} tree 树
 * @param {Function} callback 处理每个节点的树
 * @return {Object} 组装为url字符串的参数，以'?'开头，多个参数用'&'拼接
 */
export function traversalTree(tree: any, callback: any) {
  if (callback(tree, null) === true) {
    return tree;
  }
  const array = [tree];
  for (let i = 0; i < array.length; i += 1) {
    const current = array[i];
    if (current.children && current.children.length > 0) {
      for (let j = 0; j < current.children.length; j += 1) {
        const child = current.children[j];
        if (callback(child, current, j) === true) {
          return child;
        }
        array.push(child);
      }
    }
  }
  return null;
}

/**
 * 浏览器下载保存文件
 * @method downloadFile
 * @param {String} filename 文件名
 * @param {String} content 文本内容
 * @param {String} url 链接
 */
export function downloadFile(filename: string, content: string, url?: string) {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.target = '_blank';
  eleLink.style.display = 'none';
  if (url) {
    eleLink.href = url;
  } else {
    // 字符内容转变成blob地址
    const blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
  }
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}

/**
 * 计算鼠标在舞台上的坐标
 * @param e
 * @param stageCoordinate
 * @returns
 */
export const getStageMousePoint = (
  e: MouseEvent,
  stageCoordinate: ICoordinate,
  scale = 1,
) => ({
  x: (e.pageX - stageCoordinate.x) / scale,
  y: (e.pageY - stageCoordinate.y) / scale,
});

/**
 * 计算精灵的中心点
 * @param attrs 精灵的属性
 * @returns
 */
export const getSpriteCenter = (attrs: ISpriteAttrs) => {
  const { coordinate, size } = attrs;
  return {
    x: coordinate.x + size.width / 2,
    y: coordinate.y + size.height / 2,
  };
};

/**
 * 计算鼠标在转回为0度的坐标系下的坐标
 * @param attrs 精灵的属性
 * @returns
 */
export const getOriginMousePointInSprite = (
  e: MouseEvent | React.MouseEvent,
  attrs: ISpriteAttrs,
  stage: IStageApis,
) => {
  const { pageX, pageY } = e;
  const { coordinate, scale = 1 } = stage.store();
  const { x, y } = coordinate;
  const mousePointInStage = { x: (pageX - x) / scale, y: (pageY - y) / scale };
  if (!attrs.angle) {
    return mousePointInStage;
  }
  const center = getSpriteCenter(attrs);
  return rotate(mousePointInStage, -attrs.angle, center);
};

/**
 * 获取svg的html
 * @param svgDom
 * @returns
 */
export const getSvgHtml = (svgDom: SVGAElement) => {
  let svg = new XMLSerializer().serializeToString(svgDom);
  const filterAttr = [
    'class',
    'data\\-id',
    'data\\-rotate',
    'data\\-inspector\\-line',
    'data\\-inspector\\-column',
    'data\\-inspector\\-relative\\-path',
  ];

  const str = ` [${filterAttr.join('|')}]=\\'[0-9a-zA-Z\\-\\.\\/\\s]+\\'`;
  const reg = new RegExp(str, 'g');
  svg = svg.replace(reg, ' ');
  // filterAttr.forEach(attr => {
  //   const str = ` ${attr}=\\'[0-9a-zA-Z\\-\\.\\/\\s]+\\'`;
  //   const reg = new RegExp(str, 'g');

  //   svg = svg.replace(reg, ' ');
  // });
  svg = svg.replace(/[ ]+/g, ' ');
  // svg = svg.replace(/ [a-zA-Z\-]+=\'[\s\S]+\'/g, ' ').replace(/[ ]+/g, ' ');
  return svg;
};

export interface IImageInfo {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  background?: string;
  scale?: number;
  suffix?: 'png' | 'jpg' | 'jpeg' | 'gif';
}

/**
 * 睡眠
 * @param time
 * @returns
 */
export const sleep = (time = 0) =>
  new Promise(resolve => setTimeout(() => resolve(true), time));

/**
 * svg dom转化为png的base64，svg内含有foreignObject会无效或者失败
 * @param svgDom
 * @param info
 * @returns
 */
export const svgDomToPNGBase64 = async (
  svgDom: SVGElement,
  info?: IImageInfo,
) => {
  const fullSvgRect = svgDom.getBoundingClientRect();
  const svgHTML = new XMLSerializer().serializeToString(svgDom);
  const canvas = document.createElement('canvas');
  const rect = {
    x: 0,
    y: 0,
    width: fullSvgRect.width,
    height: fullSvgRect.height,
    scale: 2,
    background: 'transparent',
    suffix: 'png',
    padding: 2,
    ...(info || {}),
  };
  const { background, scale, suffix } = rect;
  let { x, y, width, height, padding } = rect;
  const result = {
    base64: '',
    width: width + padding * 2,
    height: height + padding * 2,
  };
  canvas.width = fullSvgRect.width * scale;
  canvas.height = fullSvgRect.height * scale;
  padding *= scale;
  x *= scale;
  y *= scale;
  width *= scale;
  height *= scale;
  const context = canvas.getContext('2d');
  const image = await loadSvgImage(svgHTML);
  if (!image || !context) {
    return result;
  }
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  // 无需部分截图，直接返回整张图
  if (!info || (!info.x && !info.y && !info.width && !info.height)) {
    result.base64 = canvas.toDataURL(`image/${suffix}`);
    return result;
  }
  return cropImage();

  // 裁剪图片，只截取有图像的部分
  function cropImage() {
    if (!image || !context) {
      return result;
    }
    const paddingRect = {
      x: x - padding,
      y: y - padding,
      width: width + padding * 2,
      height: height + padding * 2,
    };
    // 截取有图像的部分
    const imgData = context.getImageData(
      paddingRect.x,
      paddingRect.y,
      paddingRect.width,
      paddingRect.height,
    );
    // 清空画布
    context.clearRect(0, 0, canvas.width, canvas.height);
    // 重新画有图像的部分
    canvas.width = paddingRect.width;
    canvas.height = paddingRect.height;
    context?.putImageData(imgData, 0, 0);
    result.base64 = canvas.toDataURL('image/png');
    return result;
  }
  // 加载svg图像
  function loadSvgImage(svgHtml: string): Promise<CanvasImageSource> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const str = window.btoa(unescape(encodeURIComponent(svgHtml)));
      img.src = `data:image/svg+xml;base64,${str}`;
      img.onerror = err => reject(err);
      img.onload = () => resolve(img);
    });
  }
};

/**
 * 拟合曲线
 * @param points
 * @returns path
 */
export const fittingCurve = (points: Point[], rate = 0.4) => {
  if (points.length < 3) {
    return '';
  }
  let path = `M${points[0].x},${points[0].y} `;
  const controlPoints: Point[] = [];
  for (let i = 1; i < points.length - 1; i += 1) {
    const [control1, control2] = getControlPoints(
      [points[i - 1], points[i], points[i + 1]],
      rate,
    );
    controlPoints.push(control1, control2);
  }
  const ps = points.map((p: Point) => ({
    x: p.x.toFixed(1),
    y: p.y.toFixed(1),
  }));
  const c = controlPoints.map((p: Point) => ({
    x: p.x.toFixed(1),
    y: p.y.toFixed(1),
  }));
  for (let i = 0; i < ps.length - 1; i += 1) {
    const n = i * 2 - 1;
    if (i === 0) {
      path += `  Q${c[i].x},${c[i].y}`;
    } else if (i === ps.length - 2) {
      path += `  Q${c[n].x},${c[n].y}`;
    } else {
      path += `  C${c[n].x},${c[n].y} ${c[n + 1].x},${c[n + 1].y}`;
    }
    path += ` ${ps[i + 1].x},${ps[i + 1].y}`;
  }
  return path;
};

/**
 * 计算锚点真实坐标
 * @param params
 * @returns
 */
export const getPortCoordinate = (params: {
  stage: IStageApis;
  sprite: ISprite;
  meta: ISpriteMeta;
  pointIndex: number;
}) => {
  const { stage, sprite, meta, pointIndex } = params;
  const { ports } = meta;
  const { attrs } = sprite;
  if (ports) {
    const {
      getPoints,
      unit = PortUnitEnum.px,
      refer = PortReferEnum.sprite,
    } = ports;
    let { points = [] } = ports;
    if (getPoints) {
      points = getPoints({ sprite, stage } as any);
    }
    const info = { ...attrs.coordinate, ...attrs.size };
    let { x, y } = points[pointIndex];
    if (unit === PortUnitEnum.percent) {
      x = info.x + (info.width / 100) * x;
      y = info.y + (info.height / 100) * y;
    } else if (refer === PortReferEnum.sprite) {
      x = info.x + x;
      y = info.y + y;
    }
    let point: Point = { x, y };
    if (typeof attrs.angle === 'number' && attrs.angle !== 0) {
      const center = {
        x: info.x + info.width / 2,
        y: info.y + info.height / 2,
      };
      point = rotate(point, attrs.angle, center);
    }

    return point;
  }
  return null;
};

/**
 * 将base64下载为文件
 * @param data base64数据
 * @param filename 文件名
 */
export const downloadBase64File = (dataUrl: string, filename: string) => {
  const data = base64Img2Blob(dataUrl);
  window.URL = window.URL || window.webkitURL;
  const urlBlob = window.URL.createObjectURL(data);
  const link = document.createElement('a');
  link.style.display = 'none';
  link.href = urlBlob;
  const downloadFileName = filename;
  link.setAttribute('download', downloadFileName);
  document.body.appendChild(link);
  link.click();
  function base64Img2Blob(code: string) {
    const parts = code.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; i += 1) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  }
};

/**
 * 改变精灵层级
 * @param stage 舞台
 * @param pos 方向
 */
export const setSpriteLevel = (
  stage: IStageApis,
  pos: 'levelUp' | 'levelDown' | 'levelTop' | 'levelBottom',
) => {
  const { spriteList, activeSpriteList } = stage.store();
  if (activeSpriteList.length !== 1) {
    return;
  }
  const activeSprite = activeSpriteList[0];
  const len = spriteList.length;
  for (let i = 0; i < len; i++) {
    if (spriteList[i]?.id === activeSprite?.id) {
      if (
        ((pos === 'levelUp' || pos === 'levelTop') && i === len - 1) ||
        ((pos === 'levelDown' || pos === 'levelBottom') && i === 0)
      ) {
        return;
      }
      let n = 0;
      if (pos === 'levelUp') {
        n = 1;
      } else if (pos === 'levelDown') {
        n = -1;
      } else if (pos === 'levelTop') {
        n = len - 1 - i;
      } else if (pos === 'levelBottom') {
        n = -i;
      } else {
        throw new Error('精灵层级变化不存在!');
        return;
      }
      const newSpriteList = [...spriteList];
      newSpriteList[i] = newSpriteList[i + n];
      newSpriteList[i + n] = activeSprite;
      stage.apis.setSpriteList(newSpriteList);
      return;
    }
  }
};

/**
 * 改变精灵位置，对齐
 * @param stage 舞台
 * @param pos 方向
 */
export const setSpriteListAlign = (
  stage: IStageApis,
  pos:
    | 'horizontalAlign'
    | 'verticalAlign'
    | 'horizontalVerticalAlign'
    | 'topAlign'
    | 'bottomAlign'
    | 'leftAlign'
    | 'rightAlign',
) => {
  const { activeSpriteList } = stage.store();
  const newSpriteList = [...activeSpriteList];
  const { width: stageWidth, height: stageHeight } = stage.store().size;
  newSpriteList.forEach((sprite: ISprite) => {
    const { attrs } = sprite;
    const { width, height } = attrs.size;

    if (pos === 'horizontalAlign') {
      attrs.coordinate.x = stageWidth / 2 - width / 2;
    } else if (pos === 'verticalAlign') {
      attrs.coordinate.y = stageHeight / 2 - height / 2;
    } else if (pos === 'horizontalVerticalAlign') {
      attrs.coordinate.x = stageWidth / 2 - width / 2;
      attrs.coordinate.y = stageHeight / 2 - height / 2;
    } else if (pos === 'topAlign') {
      attrs.coordinate.y = 0;
    } else if (pos === 'bottomAlign') {
      attrs.coordinate.y = stageHeight - height;
    } else if (pos === 'leftAlign') {
      attrs.coordinate.x = 0;
    } else if (pos === 'rightAlign') {
      attrs.coordinate.x = stageWidth - width;
    } else {
      throw new Error('精灵对齐变化不存在!');
      return;
    }
  });

  stage.apis.updateSpriteList(newSpriteList);
};

/**
 * 寻找精灵索引
 */
export const findSpriteInSpriteList = (
  spriteList: ISprite[],
  sprite: ISprite | string,
) => {
  for (let i = 0; i < spriteList.length; i += 1) {
    const targetSprite = spriteList[i];
    const ok =
      targetSprite.id === (typeof sprite === 'string' ? sprite : sprite.id);
    if (ok) {
      return {
        sprite: targetSprite,
        index: i,
      };
    }
  }
  return {
    sprite: null,
    index: -1,
  };
};

// 利用原生Js获取操作系统版本
export function getOS() {
  const sUserAgent = navigator.userAgent;
  const isWin =
    navigator.platform == 'Win32' || navigator.platform == 'Windows';
  const isMac =
    navigator.platform == 'Mac68K' ||
    navigator.platform == 'MacPPC' ||
    navigator.platform == 'Macintosh' ||
    navigator.platform == 'MacIntel';
  if (isMac) {
    return 'Mac';
  }
  const isUnix = navigator.platform == 'X11' && !isWin && !isMac;
  if (isUnix) {
    return 'Unix';
  }
  const isLinux = String(navigator.platform).includes('Linux');
  if (isLinux) {
    return 'Linux';
  }
  if (isWin) {
    const isWin2K =
      sUserAgent.includes('Windows NT 5.0') ||
      sUserAgent.includes('Windows 2000');
    if (isWin2K) {
      return 'Win2000';
    }
    const isWinXP =
      sUserAgent.includes('Windows NT 5.1') ||
      sUserAgent.includes('Windows XP');
    if (isWinXP) {
      return 'WinXP';
    }
    const isWin2003 =
      sUserAgent.includes('Windows NT 5.2') ||
      sUserAgent.includes('Windows 2003');
    if (isWin2003) {
      return 'Win2003';
    }
    const isWinVista =
      sUserAgent.includes('Windows NT 6.0') ||
      sUserAgent.includes('Windows Vista');
    if (isWinVista) {
      return 'WinVista';
    }
    const isWin7 =
      sUserAgent.includes('Windows NT 6.1') || sUserAgent.includes('Windows 7');
    if (isWin7) {
      return 'Win7';
    }
    const isWin10 =
      sUserAgent.includes('Windows NT 10') || sUserAgent.includes('Windows 10');
    if (isWin10) {
      return 'Win10';
    }
  }
  return 'other';
}

/**
 * 计算带箭头的线的终点坐标
 * @param start
 * @param end
 * @param strokeWidth
 * @returns
 */
export const getArrowLineEndPoint = (
  start: IPointOption,
  end: IPointOption,
  strokeWidth = 1,
) => {
  let { x: x1, y: y1 } = start;
  let { x: x2, y: y2 } = end;
  const dis = distance(start, end);
  const d = strokeWidth * 2;
  if (start.type === 'arrow') {
    x1 -= (d * (start.x - end.x)) / dis;
    y1 -= (d * (start.y - end.y)) / dis;
  }
  if (end.type === 'arrow') {
    x2 -= (d * (end.x - start.x)) / dis;
    y2 -= (d * (end.y - start.y)) / dis;
  }
  return {
    start: { ...start, x: x1, y: y1 },
    end: { ...end, x: x2, y: y2 },
  };
};

/**
 * 获取剪切板文本内容
 * @param e
 * @returns
 */
export const getClipboardString = (e: ClipboardEvent) =>
  new Promise(resolve => {
    const { items } = e.clipboardData;
    for (let i = 0; i < items.length; i += 1) {
      const item = items[i];
      if (item.kind === 'string') {
        item.getAsString((str: string) => {
          resolve(str || '');
        });
      }
    }
    setTimeout(() => resolve(''), 100);
  });

const readFile = (file: File) =>
  new Promise(async (resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result || null;
      resolve({ base64: result });
    };
    reader.onerror = (err: ProgressEvent<FileReader>) => {
      reject(err);
    };
  });

/**
 * 获取剪切板拖片内容
 * @param e
 * @returns
 */
export const getClipboardImage = (e: ClipboardEvent) =>
  new Promise(async (resolve, reject) => {
    try {
      const { files } = e.clipboardData;
      if (files.length > 0) {
        const images = Array.from(files).filter((file: File) =>
          file.type.includes('image/'),
        );
        const filesRes = await Promise.all(
          images.map((image: File) => readFile(image)),
        );
        resolve(filesRes);
      } else {
        resolve([]);
      }
    } catch (err: any) {
      reject(err);
    }
  });

/**
 * 获取剪切板内容
 * @param e
 * @returns
 */
export const getClipboardContent = (e: ClipboardEvent) =>
  new Promise(async resolve => {
    const { items, files } = e.clipboardData;
    const textArr = Array.from(items).filter(
      (item: any) => item.kind === 'string',
    );
    if (textArr.length > 0) {
      const str = await getClipboardString(e);
      resolve({ type: 'string', string: str });
      return;
    }

    const imageFiles = Array.from(files).filter((file: File) =>
      file.type.includes('image/'),
    );
    if (imageFiles.length > 0) {
      const images = await getClipboardImage(e);
      resolve({ type: 'images', images });
      return;
    }

    // if (files.length > 0) {
    //   const filesRes = await Promise.all(Array.from(files).map((image: File) => readFile(image)));
    //   resolve({ type: 'files', files: filesRes });
    //   return;
    // }
    if (files.length > 0) {
      resolve({ type: 'files', files });
    }
  });

/**
 * 是否正在输入
 * @returns boolean
 */
export const isInputting = () => {
  const ele = document.activeElement;
  const inputTags = ['input', 'textarea'];
  if (ele) {
    const contentEditable = ele.getAttribute('contenteditable') === 'true';
    const tagName = ele.tagName.toLocaleLowerCase() || '';
    if (inputTags.includes(tagName) || contentEditable) {
      return true;
    }
  }
  return false;
};

// 拍平精灵数组
export const flattenSpriteList = (root: ISprite | ISprite[]) => {
  const flattenList: ISprite[] = [];
  const nodeList = Array.isArray(root) ? root : [root];
  nodeList.forEach((e: ISprite) => {
    traversalTree(e, (node: ISprite) => {
      if (node.id) {
        flattenList.push(node);
      }
    });
  });
  return flattenList;
};

// 精灵数组变映射
export const spriteListToMap = (sprite: ISprite | ISprite[]) => {
  const flattenList = flattenSpriteList(sprite);
  return flattenList.reduce((acc, e) => ({ ...acc, [e.id]: e }), {});
};
