import React from 'react';
import { ISprite, IStageApis } from '@packages/lego/interface';
import AnchorPoints from '@packages/lego/lego-sprite/anchor-points';
import SpriteContainer from '@packages/lego/lego-sprite/sprite-container';

export const AnchorPointsExtend = ({ stage }: { stage: IStageApis }) => {
  const { spriteList, activeSpriteMap } = stage.store();
  return <g data-name="anchor-points">
    {
      spriteList.map((sprite: ISprite) => {
        const active = Boolean(activeSpriteMap[sprite.id]);
        if (!active) {
          return null;
        }
        return (
          <SpriteContainer key={sprite.id} sprite={sprite}>
            <AnchorPoints sprite={sprite} stage={stage} active={active} />
          </SpriteContainer>
        );
      })
    }
  </g>;
};
