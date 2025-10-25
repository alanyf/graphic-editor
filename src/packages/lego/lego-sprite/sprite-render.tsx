import React from 'react';
import type { ISprite, ISpriteMeta, IStageApis } from '../interface';

interface IProps {
  sprite: ISprite;
  stage: IStageApis;
  meta: ISpriteMeta;
  active: boolean;
}

export default class SpriteRender extends React.PureComponent<IProps> {
  SpriteComponent: React.JSXElementConstructor<any> = null as any;

  constructor(props: IProps) {
    super(props);
    this.SpriteComponent = props.meta?.spriteComponent as any;
  }

  render() {
    const { sprite, active, stage, children } = this.props;
    const { SpriteComponent } = this;
    if (!SpriteComponent) {
      return <text>{sprite.type} not defined</text>;
    }
    return <SpriteComponent stage={stage} sprite={sprite} active={active}>
      {children}
    </SpriteComponent>;
  }
}
