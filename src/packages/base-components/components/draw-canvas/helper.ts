import type { IRect } from './interface';

export const events =
  'ontouchstart' in window
    ? ['touchstart', 'touchmove', 'touchend']
    : ['mousedown', 'mousemove', 'mouseup'];

/**
 * 生成canvas
 * @param param0
 * @returns
 */
export function getCanvas({ width = 0, height = 0, scale = 1, attrs = {} as Record<string, any> }) {
  const canvas: any = document.createElement('canvas');
  Object.keys(attrs).forEach((key) => {
    const value = attrs[key];
    canvas.setAttribute(key, value);
  });
  canvas.setAttribute('width', `${width * scale}`);
  canvas.setAttribute('height', `${height * scale}`);
  canvas.style = `${attrs.style || ''};width: ${width}px;height: ${height}px;`;
  const ctx = canvas.getContext('2d');
  ctx?.scale(scale, scale);
  return { canvas, ctx };
}

/**
 * 将base64下载为文件
 * @param data base64数据
 * @param filename 文件名
 */
export function downloadBase64File(dataUrl: string, filename: string) {
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
}

/**
 * 拷贝字符串到剪切板
 * @param value 字符串
 */
export function copyStr(value: string) {
  console.log('copyStr', value);
  const transfer = document.createElement('input');
  document.body.appendChild(transfer);
  transfer.value = value;
  transfer.setSelectionRange(0, 999999999);
  transfer.focus();
  transfer.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
  }
  transfer.blur();
  document.body.removeChild(transfer);
}

export function isSupportTouch() {
  return 'ontouchstart' in window;
}

export const resetRect = () => {
  return { x: 0, y: 0, width: 0, height: 0 } as IRect;
};
/**
 * 加载base64图片
 * @param base64
 * @returns
 */
export const loadImage = (base64: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
  });
};

/**
 * 清空圆形区域
 * @param x
 * @param y
 * @param r
 * @param cxt
 */
export function clearArc(pointX: number, pointY: number, r: number, cxt: any) {
  const x = pointX - r;
  const y = pointY - r;
  const size = 2 * r;
  const step = 1;
  const centerX = x + r;
  const centerY = y + r;
  for (let i = 0; i < size; i += step) {
    const px = x + i;
    for (let j = 0; j < size; j += step) {
      const py = y + j;
      const dis = Math.sqrt((px - centerX) ** 2 + (py - centerY) ** 2);
      if (dis <= r) {
        cxt.clearRect(px, py, step, step);
      }
    }
  }
}
