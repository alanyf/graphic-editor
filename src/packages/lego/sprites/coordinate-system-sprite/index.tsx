import React from 'react';
import CoordinateSystem from '../../material/graph/coordinate-system';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta, IDefaultGraphicProps, Point } from '../../interface';
import { EventTypeEnum } from '../../interface';
import './index.less';

interface IProps extends IDefaultGraphicProps {
  unitPx?: number;
  cx?: number;
  cy?: number;
  showGridLine?: boolean;
  dashGridLine?: boolean;
  showTickLine?: boolean;
  showTickText?: boolean;
}

const SpriteType = 'CoordinateSystemSprite';

export class CoordinateSystemSprite extends BaseSprite<IProps> {
  handleCheckChange = (props: string, value: boolean | number) => {
    const { sprite, stage } = this.props;
    stage.apis.updateSpriteProps(sprite, { [props]: value });
  };

  pointChangeHandle = (point: Point) => {
    const { sprite, stage } = this.props;
    const { attrs } = sprite;
    const { size } = attrs;
    const { width, height } = size;
    const ratio = 1000;
    let cx = Math.floor((point.x / width) * ratio) / ratio;
    let cy = Math.floor((point.y / height) * ratio) / ratio;
    cx = Math.max(Math.min(cx, 1), 0);
    cy = Math.max(Math.min(cy, 1), 0);
    stage.apis.updateSpriteProps(sprite, { cx, cy });
  };

  handleAnchorChange = ({ point, sprite }: any) => {
    if (sprite.id !== this.props.sprite.id) {
      return;
    }
    this.pointChangeHandle(point);
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
    const {
      unitPx = 35,
      showGridLine = true,
      dashGridLine = true,
      showTickText = true,
      showTickLine = true,
    } = props;
    return (
      <>
        <CoordinateSystem
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
          strokeWidth={0}
          stroke="transparent"
          fill="none"
        />
        <CoordinateSystem
          fill={'#fff'}
          {...props}
          x={0}
          y={0}
          width={width}
          height={height}
        />
        {attrs.editing && (
          <foreignObject
            x={0}
            y={-50}
            width={600}
            height={40}
            overflow={'visible'}>
            <div className="edit-form-container">
              <div className="edit-form-item">
                <label>刻度单位:</label>
                <input
                  value={unitPx}
                  type="number"
                  style={{ width: 60 }}
                  onChange={e =>
                    this.handleCheckChange(
                      'unitPx',
                      Number(e.target.value) || 35,
                    )
                  }
                />
              </div>
              <div className="edit-form-item">
                <label>显示刻度值:</label>
                <input
                  checked={showTickText}
                  type="checkbox"
                  onChange={e =>
                    this.handleCheckChange('showTickText', e.target.checked)
                  }
                />
              </div>
              <div className="edit-form-item">
                <label>显示刻度线:</label>
                <input
                  checked={showTickLine}
                  type="checkbox"
                  onChange={e =>
                    this.handleCheckChange('showTickLine', e.target.checked)
                  }
                />
              </div>
              <div className="edit-form-item">
                <label>显示网格线:</label>
                <input
                  checked={showGridLine}
                  type="checkbox"
                  onChange={e =>
                    this.handleCheckChange('showGridLine', e.target.checked)
                  }
                />
              </div>
              <div className="edit-form-item">
                <label>虚线网格:</label>
                <input
                  checked={dashGridLine}
                  type="checkbox"
                  onChange={e =>
                    this.handleCheckChange('dashGridLine', e.target.checked)
                  }
                />
              </div>
            </div>
          </foreignObject>
        )}
      </>
    );
  }
}

export const CoordinateSystemSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: CoordinateSystemSprite,
  initProps: {
    unitPx: 35,
    cx: 0.5,
    cy: 0.5,
  },
  anchors: {
    getPoints: ({ sprite }) => {
      const { width, height } = sprite.attrs.size;
      const { cx = 0.5, cy = 0.5 } = sprite.props as IProps;
      return [{ x: cx * width, y: cy * height }];
    },
  },
};

export default CoordinateSystemSpriteMeta;
