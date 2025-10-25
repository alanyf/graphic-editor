import React from 'react';
import type { IGridStyle } from '../../../../interface';
import { IGridThemeEnum } from '../../../../interface';
import { defaultGridLine } from './default-grid-line';

export * from './default-grid-line';

/**
 * 获得主题的样式
 * @param type
 * @param spacing
 * @returns
 */
export const getGridThemeStyle = (theme: IGridThemeEnum, spacing: number) => {
  const themeMap: Record<IGridThemeEnum, IGridStyle> = {
    SolidLine: {
      stroke: '#f8f8f8',
      strokeWidth: 1,
      strokeDasharray: 'none',
    },
    DottedLine: {
      stroke: '#f1f1f1',
      strokeWidth: 1,
      strokeDasharray: `${spacing / 5} ${spacing / 5}`,
    },
    Point: {
      stroke: '#bbb',
      strokeWidth: 1,
      strokeDasharray: `1 ${spacing - 1}`,
    },
  };
  return themeMap[theme];
};

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

interface IProps {
  width: number;
  height: number;
  theme?: IGridThemeEnum;
  spacing?: number;
  customStyle?: IGridStyle;
}

const getLines = (width: number, height: number, spacing: number) => {
  const getLineList = (size: number, spacing: number) => {
    const length = Math.floor(size / spacing);
    return new Array(length)
      .fill(1)
      .map((_: any, index: number) => [0, size, index * spacing]);
  };
  const xLines = getLineList(height, spacing).map((arr: number[]) => ({
    x1: 0,
    y1: arr[2],
    x2: width,
    y2: arr[2],
  }));
  const yLines = getLineList(width, spacing).map((arr: number[]) => ({
    x1: arr[2],
    y1: 0,
    x2: arr[2],
    y2: height,
  }));
  return { xLines, yLines };
};

const getPath = (line: Line) => `M${line.x1},${line.y1} L${line.x2},${line.y2}`;

export default (props: IProps) => {
  const { width = 0, height = 0 } = props;
  const {
    spacing = defaultGridLine.spacing,
    theme = IGridThemeEnum.SolidLine,
    customStyle = {},
  } = props;
  const { xLines, yLines } = getLines(width, height, spacing);
  const lines =
    theme === IGridThemeEnum.Point ? xLines : [...xLines, ...yLines];
  const style = { ...getGridThemeStyle(theme, spacing), ...customStyle };

  return (
    <path d={lines.map((line: Line) => getPath(line)).join(' ')} {...style} />
  );
};
