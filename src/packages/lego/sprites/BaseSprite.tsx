import React from 'react';
import type { IStageApis, ISprite } from '../interface';

export interface IBaseSpriteProps<IProps> {
  sprite: ISprite<IProps>;
  stage: IStageApis;
  active?: boolean;
  editing?: boolean;
  children?: React.ReactNode;
}

export class BaseSprite<IProps = any, IState = any> extends React.Component<
  IBaseSpriteProps<IProps>,
  IState
> {}
