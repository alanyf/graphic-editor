import { IShortcutOpt } from './types';

// 利用原生Js获取操作系统版本
export function getOS() {
  const isWin =
    navigator.platform === 'Win32' || navigator.platform === 'Windows';
  const isMac =
    navigator.platform === 'Mac68K' ||
    navigator.platform === 'MacPPC' ||
    navigator.platform === 'Macintosh' ||
    navigator.platform === 'MacIntel';
  if (isMac) {
    return 'Mac';
  }
  const isLinux = String(navigator.platform).includes('Linux');
  if (isLinux) {
    return 'Linux';
  }
  if (isWin) {
    return 'Win';
  }
  return 'other';
}

export const isMac = getOS() === 'Mac';

export const getMetaStr = () => (isMac ? 'command' : 'ctrl');

export const getHotkeysStr = (opt: IShortcutOpt) => {
  const { metaPress, shiftPress, altPress } = opt.option || {};
  let key = '';
  if (metaPress) {
    key += `${getMetaStr()}+`;
  }
  if (shiftPress) {
    key += 'shift+';
  }
  if (altPress) {
    key += 'alt+';
  }
  key += `${opt.keys.join('+')}`;
  return key;
};

export const findDomParents = (dom: any) => {
  const arr: any = [];
  const findParent = (e: any) => {
    if (e?.parentNode) {
      arr.push(e);
      findParent(e.parentNode);
    }
  };
  findParent(dom);
  return arr;
};

export const selectParents = (dom: any, selectors: string[]) => {
  const results: any[] = [];
  const parents = findDomParents(dom);
  selectors.forEach((selector: string) => {
    for (const node of parents) {
      const selectorName = selector.slice(1);
      if (selector.startsWith('#')) {
        if (
          node.getAttribute('id') === selectorName &&
          !results.find(e => e === node)
        ) {
          results.push(node);
        }
      } else if (selector.startsWith('.')) {
        if (
          node.classList.contains(selectorName) &&
          !results.find(e => e === node)
        ) {
          results.push(node);
        }
      }
    }
  });
  return results;
};
