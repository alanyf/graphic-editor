import React from 'react';
import Cylinder from '../../material/graph/cylinder';
import { EventTypeEnum } from '../../interface';
import type { ISpriteMeta, Point } from '../../interface';
import { BaseSprite } from '../BaseSprite';

interface IProps {
  width: number;
  height: number;
  offset?: number;
}

const SpriteType = 'CylinderSprite';

export class CylinderSprite extends BaseSprite<IProps> {
  anchorMove = (point: Point) => {
    const { sprite, stage } = this.props;
    const { id, attrs } = sprite;
    const { height } = attrs.size;
    let { y } = point;
    y = Math.max(y, 0);
    y = Math.min(y, height / 2);
    const newProps = { offset: (100 * y) / height };
    stage.apis.updateSpriteProps(id, newProps);
  };

  handleAnchorChange = ({ point, sprite }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.anchorMove(point);
  };

  componentDidMount() {
    this.props.stage.apis.$event.on(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
  }

  componentWillUnmount() {
    this.props.stage.apis.$event.off(
      EventTypeEnum.SpriteAnchorPointChange,
      this.handleAnchorChange,
    );
  }

  render() {
    const { sprite } = this.props;
    const { props, attrs } = sprite;
    const { width, height } = attrs.size;
    let { offset = 10 } = props;
    offset = (offset * height) / 100;
    return (
      <g>
        <Cylinder
          {...props}
          offset={offset}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={6}
          stroke="transparent"
          fill="none"
        />
        <Cylinder
          {...props}
          offset={offset}
          x={0}
          y={0}
          width={width}
          height={height}
        />
      </g>
    );
  }
}

export const CylinderSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: CylinderSprite,
  initProps: {
    width: 100,
    height: 70,
    offset: 40,
  },
  anchors: {
    getPoints: ({ sprite }) => {
      const { width, height } = sprite.attrs.size;
      const { offset = 0 } = sprite.props as IProps;
      return [{ x: width / 2, y: (offset * height) / 100 }];
    },
  },
};

export default CylinderSpriteMeta;
