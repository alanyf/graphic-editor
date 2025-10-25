import React from 'react';
import { Tooltip } from 'antd';
// import CubicCurveIcon from './icon/cubic-curve.svg';
import PolygonIcon from './icon/polygon.svg';
import Polyline from './icon/polyline.svg';
import ArcLine from './icon/arc-line.svg';
import SinCurve from './icon/sin-curve.svg';
import CoordinateSystem from './icon/coordinate-system.svg';
import DrawBoardIcon from './icon/draw-board.svg';
import QrCodeIcon from './icon/qr-code.svg';

import './index.less';

const graphicList: IGraphicIconType[] = [
  {
    title: '线条',
    children: [
      { title: '连接线：线段', name: 'line', y: 2080 },
      { title: '连接线：单箭头直线', name: 'arrowLine', y: 2048 },
      { title: '连接线：双箭头直线', name: 'doubleArrowLine', y: 1952 },
      { title: '连接线：垂直', name: 'connectLine', y: 1984 },
      { title: '连接线：曲线', name: 'curveConnectLine', y: 1824 },
      { title: '弧线', name: 'arcLine', icon: ArcLine },
      { title: '单箭头弧线', name: 'arrowArcLine', y: 1856 },
      { title: '曲线', name: 'curve', y: 1824 },
      { title: '折线', name: 'polyline', icon: Polyline },
      { title: '平滑曲线', name: 'smoothCurve', icon: SinCurve },
      { title: '手绘曲线', name: 'drawPath', y: 5376 },
    ],
  },
  {
    title: '基本形状',
    children: [
      { title: '圆点', name: 'point', y: 2208 },
      { title: '矩形', name: 'rect', y: 3008 },
      { title: '圆角矩形', name: 'rectRound', y: 3136 },
      { title: '菱形', name: 'rhombus', y: 2272 },
      { title: '椭圆', name: 'ellipse', y: 4768 },
      { title: '三角形', name: 'triangle', y: 4544 },
      { title: '平行四边形', name: 'parallelogram', y: 4800 },
      { title: '五边形', name: 'pentagon', y: 4896 },
      { title: '立方体', name: 'cuboid', y: 1632 },
      { title: '圆柱', name: 'cylinder', y: 4000 },
      { title: '扇形', name: 'fanShaped', y: 4832 },
    ],
  },
  {
    title: '其他形状',
    children: [
      { title: '自由多边形', name: 'polygon', icon: PolygonIcon },
      { title: '坐标系', name: 'coordinateSystem', icon: CoordinateSystem },
      { title: '画板', name: 'drawBoard', icon: DrawBoardIcon, editing: true },
      { title: '视频', name: 'video', y: 320 },
      { title: '音频', name: 'audio', y: 32 },
      { title: '二维码', name: 'qrCode', icon: QrCodeIcon },
    ],
  },
];

interface IGraphicIconType {
  title: string;
  children: IGraphicIconItem[];
}

interface IGraphicIconItem {
  name: string;
  title: string;
  y?: number;
  icon?: string;
  editing?: boolean;
}

interface IProps {
  onClick?: (e: IGraphicIconItem) => void;
}

export default (props: IProps) => {
  const { onClick = () => '' } = props;
  return (
    <div className="graphic-icon-panel">
      {graphicList.map(row => (
        <div className="graphic-icon-section">
          <div className="graphic-icon-list-title">{row.title}</div>
          <div className="graphic-icon-list">
            {row.children.map(e => (
              <Tooltip
                key={e.title}
                mouseEnterDelay={0.6}
                title={<span style={{ color: '#222' }}>{e.title}</span>}
                placement="top"
                color="white">
                <div
                  className="graphic-icon"
                  style={{
                    backgroundImage: e.icon ? `url(${e.icon})` : undefined,
                    backgroundPosition: e.icon ? undefined : `0 -${e.y}px`,
                  }}
                  onClick={() => onClick(e)}
                />
              </Tooltip>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
