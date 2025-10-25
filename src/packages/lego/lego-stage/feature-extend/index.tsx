import { ISprite, IStageApis } from '../../interface';
import ContextMenu from './context-menu';
import SelectRect from './select-rect';

import { HelperPoints } from './helper-points';
import { EditorShortcutKey } from './shortcut-key';
import { AnchorPointsExtend } from './anchor-points';
import { GridLineExtend } from './grid-line';

// 层级在精灵下方的扩展
export const UnderSpriteFeatureExtend = ({
  stage,
}: {
  stage: IStageApis;
  scale: number;
  activeSpriteList: ISprite[];
}) => {
  return (
    <>
      <GridLineExtend stage={stage} />
    </>
  );
};

// 层级在精灵上方的扩展
export const FeatureExtend = ({
  stage,
  scale = 1,
  activeSpriteList = [],
}: {
  stage: IStageApis;
  scale: number;
  activeSpriteList: ISprite[];
}) => {
  return (
    <>
      <AnchorPointsExtend stage={stage} />
      <HelperPoints />
      <SelectRect stage={stage} />
      <EditorShortcutKey stage={stage} />
      <ContextMenu stage={stage} scale={scale} activeSpriteList={activeSpriteList} />
    </>
  );
};
