// import { useEffect } from 'react';
import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import Arrow from './arrow';

export default (props: any) => {
  const {
    x = 0,
    y = 0,
    width = 200,
    height = 200,
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    unitPx = 25,
    cx: cxPercent = 0.5,
    cy: cyPercent = 0.5,
    showGridLine = true,
    dashGridLine = true,
    showTickText = true,
    showTickLine = true,
  } = props;
  // const row = Math.floor(height / unitPx) - 1;
  // const column = Math.floor(width / unitPx);
  const row = Math.ceil((cyPercent * height) / unitPx);
  const rowBottom = Math.ceil(((1 - cyPercent) * height) / unitPx);
  const column = Math.ceil((cxPercent * width) / unitPx);
  const columnRight = Math.ceil(((1 - cxPercent) * width) / unitPx);
  const cx = width * cxPercent;
  const cy = height * cyPercent;
  // useEffect(() => {}, [unitPx]);
  const getArray = (n: number, m: any = 1) => new Array(n).fill(m);
  const tickLineLen = 5;
  const tickLinePath = !showTickLine
    ? ''
    : `
    ${getArray(column)
      .map(
        (_: number, i: number) =>
          `M${cx - i * unitPx},${cy} L${cx - i * unitPx},${cy - tickLineLen}`,
      )
      .join('  ')}

    ${getArray(columnRight)
      .map(
        (_: number, i: number) =>
          `M${cx + i * unitPx},${cy} L${cx + i * unitPx},${cy - tickLineLen}`,
      )
      .join('  ')}


    ${getArray(row)
      .map(
        (_: number, i: number) =>
          `M${cx},${cy - i * unitPx} L${cx + tickLineLen},${cy - i * unitPx}`,
      )
      .join('  ')}

    ${getArray(rowBottom)
      .map(
        (_: number, i: number) =>
          `M${cx},${cy + i * unitPx} L${cx + tickLineLen},${cy + i * unitPx}`,
      )
      .join('  ')}
  `;
  const gridLinePath = !showGridLine
    ? ''
    : `
    ${getArray(column)
      .map(
        (_: number, i: number) =>
          `M${cx - i * unitPx},${0} L${cx - i * unitPx},${height}`,
      )
      .join('  ')}

    ${getArray(columnRight)
      .map(
        (_: number, i: number) =>
          `M${cx + i * unitPx},${0} L${cx + i * unitPx},${height}`,
      )
      .join('  ')}


    ${getArray(row)
      .map(
        (_: number, i: number) =>
          `M${0},${cy - i * unitPx} L${width},${cy - i * unitPx}`,
      )
      .join('  ')}

    ${getArray(rowBottom)
      .map(
        (_: number, i: number) =>
          `M${0},${cy + i * unitPx} L${width},${cy + i * unitPx}`,
      )
      .join('  ')}
  `;
  // 直接画不区分正负半轴，有无法对齐坐标轴的问题
  // `
  // ${columns.map((_: number, i: number) => `M${(i + 1) * unitPx},${cy} L${(i + 1) * unitPx},${cy - tickLineLen}`).join('  ')}

  // ${rows.map((_: number, i: number) => `M${cx},${(i + 1) * unitPx} L${cx + tickLineLen},${(i + 1) * unitPx}`).join('  ')}
  // `
  const tickTextX = !showTickText
    ? null
    : getArray(column).map((_: number, i: number) => (
        <text
          x={cx - i * unitPx}
          y={cy + 10}
          dominantBaseline="middle"
          textAnchor="middle"
          fill={'#999'}
          style={{ userSelect: 'none', fontSize: 8 }}>
          {i === 0 ? '' : -i}
        </text>
      ));
  const tickTextXRight = !showTickText
    ? null
    : getArray(columnRight).map((_: number, i: number) => (
        <text
          x={cx + i * unitPx}
          y={cy + 10}
          dominantBaseline="middle"
          textAnchor="middle"
          fill={'#999'}
          style={{ userSelect: 'none', fontSize: 8 }}>
          {i === 0 ? '' : i}
        </text>
      ));
  const tickTextY = !showTickText
    ? null
    : getArray(row).map((_: number, i: number) => (
        <text
          x={cx - 10}
          y={cy - i * unitPx}
          dominantBaseline="middle"
          textAnchor="middle"
          fill={'#999'}
          style={{ userSelect: 'none', fontSize: 8 }}>
          {i === 0 ? '' : i}
        </text>
      ));
  const tickTextYBottom = !showTickText
    ? null
    : getArray(rowBottom).map((_: number, i: number) => (
        <text
          x={cx - 10}
          y={cy + i * unitPx}
          dominantBaseline="middle"
          textAnchor="middle"
          fill={'#999'}
          style={{ userSelect: 'none', fontSize: 8 }}>
          {i === 0 ? '' : -i}
        </text>
      ));
  return (
    <g transform={`translate(${x},${y})`}>
      {/* 背景 */}
      {/* <rect
        x={0}
        y={0}
        fill={fill}
        width={width}
        height={height}
      /> */}
      {/* 网格线 */}
      {showGridLine && (
        <path
          d={gridLinePath}
          fill={'none'}
          stroke={'#ececec'}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeDasharray={dashGridLine ? '4,4' : 'none'}
          style={{ pointerEvents: 'none' }}
        />
      )}
      {/* 刻度 */}
      {showTickLine && (
        <path
          d={tickLinePath}
          fill={'none'}
          stroke={'#999'}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeDasharray={strokeDasharray}
        />
      )}
      {/* 横坐标轴 */}
      <line
        x1={0}
        y1={cy}
        x2={width}
        y2={cy}
        fill={'none'}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
      <line
        x1={0}
        y1={cy}
        x2={width}
        y2={cy}
        fill={'none'}
        stroke={'transparent'}
        strokeWidth={6}
      />
      {/* 横坐标轴箭头 */}
      <Arrow
        strokeWidth={strokeWidth}
        start={{ x: cx, y: cy }}
        end={{ x: width, y: cy }}
      />
      {/* 横坐标轴文字 */}
      <text x={width - 12} y={cy + 15} style={{ userSelect: 'none' }}>
        x
      </text>
      {/* 横坐标轴刻度文字 */}
      {tickTextX}
      {tickTextXRight}
      {/* 纵坐标轴 */}
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={height}
        fill={'none'}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
      />
      <line
        x1={cx}
        y1={0}
        x2={cx}
        y2={height}
        fill={'none'}
        stroke={'transparent'}
        strokeWidth={6}
      />
      {/* 纵坐标轴箭头 */}
      <Arrow
        strokeWidth={strokeWidth}
        start={{ x: cx, y: cy }}
        end={{ x: cx, y: 0 }}
      />
      {/* 纵坐标轴文字 */}
      <text x={cx - 15} y={15} style={{ userSelect: 'none' }}>
        y
      </text>
      {/* 纵坐标轴刻度文字 */}
      {tickTextY}
      {tickTextYBottom}
      {/* 原点文字 */}
      <text x={cx - 15} y={cy + 15} style={{ userSelect: 'none' }}>
        o
      </text>
    </g>
  );
};
