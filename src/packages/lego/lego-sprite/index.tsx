import React from 'react';
import type {
  ISprite,
  ISpriteAttrs,
  ICoordinate,
  IStageApis,
  ISize,
  ISpriteMeta,
} from '../interface';
import SpriteRender from './sprite-render';
import RichTextCenter from './rich-text-center';
import LinkPorts from './link-ports';
import './index.less';

interface IProps {
  className?: string;
  sprite: ISprite;
  stage: IStageApis;
  meta: ISpriteMeta;
  active: boolean;
  isShowLinkPoints: boolean;
  getSpriteMeta: (type: string) => ISpriteMeta;
  isSpriteActive: (type: string) => boolean;
}

class LegoSprite extends React.PureComponent<IProps> {
  canMove = true;

  componentWillMount() {
    const { meta } = this.props;
    this.canMove = !(
      meta &&
      meta.operation &&
      meta.operation.canMove === false
    );
  }

  render() {
    const { className, meta, sprite, stage, active, isShowLinkPoints, getSpriteMeta, isSpriteActive } = this.props;
    const { id, attrs, type, children } = sprite;
    const { size = {}, coordinate = {}, angle = 0 } = attrs;
    const { width = 0, height = 0 } = size as ISize;
    const { x = 0, y = 0 } = coordinate as ICoordinate;
    const rotateStr = `rotate(${angle || 0}, ${x + width / 2} ${
      y + height / 2
    })`;
    const translateStr = `translate(${x},${y})`;
    const transform = `${angle === 0 ? '' : rotateStr} ${translateStr}`;
    const { centerText } = meta;
    return (
      <g
        className={className}
        x={x}
        y={y}
        width={width}
        height={height}
        data-id={id}
        data-active={active}
        data-sprite-type={type}
        style={{ cursor: this.canMove ? 'move' : 'default' }}
        transform={transform}>
        {/* <rect x={-dis} y={-dis} width={width + dis * 2} height={height + dis * 2} fill="transparent" strokeWidth={0} /> */}
        {/* {children} */}
        <SpriteRender
          sprite={sprite}
          meta={meta}
          active={active}
          stage={stage}
        >
          {children && children?.length > 1 && children.map(child => (
            <LegoSprite
              key={child.id}
              sprite={child}
              stage={stage}
              meta={getSpriteMeta(child.type)}
              active={isSpriteActive(child.type)}
              isShowLinkPoints={isShowLinkPoints}
              getSpriteMeta={getSpriteMeta}
              isSpriteActive={isSpriteActive}
            />
          ))}
        </SpriteRender>
        {/* 锚点 */}
        {/* <AnchorPoints
          sprite={sprite}
          stage={stage}
          active={active}
        /> */}
        {/* 连接桩 */}
        <LinkPorts
          isShowLinkPoints={isShowLinkPoints}
          sprite={sprite}
          stage={stage}
        />
        {/* 富文本编辑 */}
        {centerText && (
          <RichTextCenter
            editable={Boolean(centerText?.editable)}
            sprite={sprite}
            stage={stage}
          />
        )}
      </g>
    );
  }
}

export default LegoSprite;
