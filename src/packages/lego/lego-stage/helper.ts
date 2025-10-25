import { lineAngle, rotate } from '@packages/geometry-tools';
import type {
  ICoordinate,
  ISize,
  ISprite,
  ISpriteAttrs,
  ISpriteMeta,
  IWidthHeightRatio,
} from '../interface';
import Sprite from '../lego-sprite/sprite';
import { createUuid } from '../utils/tools';
import { getActiveSpriteRect } from './active-sprites-rect/helper';

/**
 * 生成新的精灵，生成唯一id
 * @param param
 * @param registerSpriteMetaMap
 * @returns
 */
export const getNewSprite = (
  { type, id, props, attrs, children }: ISprite,
  registerSpriteMetaMap: Record<string, ISpriteMeta>,
) => {
  const newId = createUuid();
  const initAttrsValue: ISpriteAttrs = {
    coordinate: { x: 0, y: 0 },
    size: { width: 0, height: 0 },
    angle: 0,
    style: {},
    creating: false,
    editing: false,
  };
  const meta = registerSpriteMetaMap[type];
  if (!meta) {
    return null;
  }
  const { initProps = {}, initAttrs } = meta;
  const sprite = new Sprite({
    id: id || newId,
    type,
    props: { ...initProps, ...(props || {}) },
    attrs: {
      ...initAttrsValue,
      ...initAttrs,
      ...(attrs || {}),
    },
  });
  if (children && children?.length > 0) {
    sprite.children = children
      .map(e => getNewSprite(e, registerSpriteMetaMap))
      .filter(Boolean) as Sprite[];
  }
  return sprite;
};

/**
 * 获取截图区域
 * @param spriteList 精灵列表
 * @returns
 */
export const getScreenShotArea = (spriteList: ISprite[]) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  spriteList.forEach((sprite: ISprite) => {
    const { size, coordinate } = sprite.attrs;
    const { width, height } = size;
    const { x, y } = coordinate;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
};

/**
 * 获取截图区域
 * @param spriteList 精灵列表
 * @returns
 */
export const getScreenShotAreaByDom = (
  spriteDomList: any,
  coordinate: ICoordinate,
) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = 0;
  let maxY = 0;
  Array.from(spriteDomList).forEach((dom: any) => {
    const { x, y, width, height } = dom.getBoundingClientRect();
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);
  });
  return {
    x: minX - coordinate.x,
    y: minY - coordinate.y,
    width: maxX - minX,
    height: maxY - minY,
  };
};

// 计算画布初始尺寸
export const getInitStageSize = (WHRatio: IWidthHeightRatio = '16:9') => {
  const width = 1200;
  const height = 675;
  const ratioMap = {
    '16:9': 16 / 9,
    '4:3': 4 / 3,
    '1:1': 1,
  };
  const ratio = ratioMap[WHRatio] || ratioMap['16:9'];
  if (width / ratio > height) {
    return {
      width: Math.round(height * ratio),
      height,
    } as ISize;
  }
  return {
    width,
    height: Math.round(width / ratio),
  } as ISize;
};

/**
 * 根据类名寻找所有满足条件的父元素
 * @param dom dom元素
 * @param className css类名
 * @return dom | null
 */
export function findParentListByClass(_dom: any, _className: string): any {
  const domList: any[] = [];
  const dfs = (dom: any, className: string): any => {
    if (!dom || dom.tagName === 'BODY') {
      return;
    }
    if (dom.classList.contains(className)) {
      domList.push(dom);
    }
    return dfs(dom.parentNode, className);
  };

  dfs(_dom, _className);
  return domList;
}

/**
 * 根据类名寻找父元素
 * @param dom dom元素
 * @param className css类名
 * @return dom | null
 */
export function findSpriteDomByClass(dom: any, className: string): any {
  const domList = findParentListByClass(dom, className);
  return domList.pop();
}

export const isGroupSprite = (sprite?: ISprite) =>
  Boolean(sprite?.type === 'GroupSprite');

// 计算解组后内部精灵的旋转
export const getSplitSpriteAngleMove = (sprite: ISprite, groupSprite: ISprite) => {
  const getAngle = (n: any) => Number(n) || 0;
  const { coordinate, size } = sprite.attrs;
  const { coordinate: groupCoordinate, size: groupSize } = groupSprite.attrs;
  const spriteAngle = getAngle(sprite.attrs.angle);
  const groupAngle = getAngle(groupSprite.attrs.angle);
  const groupCenterPoint = {
    x: groupCoordinate.x + groupSize.width / 2,
    y: groupCoordinate.y + groupSize.height / 2,
  };
  const originCenterPoint = {
    x: coordinate.x + groupCoordinate.x + size.width / 2,
    y: coordinate.y + groupCoordinate.y + size.height / 2,
  };
  const rotateCenterPoint = rotate(originCenterPoint, groupAngle, groupCenterPoint);
  const dx = rotateCenterPoint.x - originCenterPoint.x;
  const dy = rotateCenterPoint.y - originCenterPoint.y;

  // 计算精灵旋转角，用右边中点，经精灵自身旋转，再经过组旋转，再与自身中心点一起计算出精灵实际旋转角
  const originRightPoint  = { x: originCenterPoint.x + size.width / 2, y: originCenterPoint.y };
  let rotateRightPoint = rotate(originRightPoint, spriteAngle, originCenterPoint);
  rotateRightPoint = rotate(rotateRightPoint, groupAngle, groupCenterPoint);
  const angle = lineAngle(rotateCenterPoint, rotateRightPoint);
  return { dx, dy, angle };
};

export const makeSpriteGroup = (activeSpriteList: ISprite[]) => {
  const { x, y, width, height } = getActiveSpriteRect(activeSpriteList);
  const groupSprite: ISprite = {
    type: 'GroupSprite',
    id: `Group_${Math.floor(Math.random() * 10000)}`,
    props: {},
    attrs: {
      size: { width, height },
      coordinate: { x, y },
      angle: 0
    } as ISpriteAttrs,
    children: activeSpriteList.map((sprite) => {
      const { coordinate } = sprite.attrs;
      return {
        ...sprite,
        attrs: {
          ...sprite.attrs,
          coordinate: {
            x: coordinate.x - x,
            y: coordinate.y - y
          }
        }
      };
    })
  };
  return groupSprite;
};

export const splitSpriteGroup = (sprite: ISprite) => {
  const { x, y } = getActiveSpriteRect([sprite]);
  if (!sprite?.children || sprite?.children?.length < 1) {
    return [];
  }
  const spriteList = sprite.children.map((child: ISprite) => {
    const { coordinate } = child.attrs;
    const { dx, dy, angle } = getSplitSpriteAngleMove(child, sprite);

    return {
      ...child,
      attrs: {
        ...child.attrs,
        angle,
        coordinate: {
          x: coordinate.x + x + dx,
          y: coordinate.y + y + dy,
        }
      }
    };
  });
  return spriteList;
};
