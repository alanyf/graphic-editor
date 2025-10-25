import type { ObjectAny, ISprite, ISpriteAttrs } from '../interface';
// import { SpriteSizeClass, SpriteCoordinateClass } from '../interface';

class Sprite {
  constructor(params: ISprite) {
    const {
      id = '',
      type = '',
      props = {},
      attrs = {
        style: {},
        zIndex: 0,
        size: { width: 0, height: 0 },
        coordinate: { x: 0, y: 0 },
        angle: 0,
        transform: {},
      },
      children,
    } = params;
    this.id = id;
    this.type = type;
    this.props = props;
    this.attrs = attrs as any;
    if (children) {
      this.children = children as any;
    }
  }

  public id: string;

  public type: string;

  public props: ObjectAny;

  public attrs: ISpriteAttrs;

  public children?: ISprite[];
}

export default Sprite;
