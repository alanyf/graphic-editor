// 扇形
import React, { useEffect, useState } from 'react';
import { angleEquidistantPoints } from '@packages/geometry-tools';
import {
  defaultFill,
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps } from '../../interface';

export const getPointByAngle = (angle: number, a: number, b: number) => {
  const reverseX = angle >= 90 && angle <= 270 ? -1 : 1;
  const reverseY = angle >= 180 && angle <= 360 ? -1 : 1;
  let degree = angle > 180 ? angle - 180 : angle;
  degree = degree > 90 ? 180 - degree : degree;
  const radian = (degree * Math.PI) / 180;
  const k = Math.tan(radian);
  const x = 1 / Math.sqrt(1 / a ** 2 + (k / b) ** 2);
  const y = k * x;
  return {
    x: a + x * reverseX,
    y: b + y * reverseY,
  };
};

export const getFanShapedPath = (
  startAngle: number,
  endAngle: number,
  width: number,
  height: number,
) => {
  const rx = width / 2;
  const ry = height / 2;
  const center = { x: rx, y: ry };
  const startPoint = getPointByAngle(startAngle, rx, ry);
  const endPoint = getPointByAngle(endAngle, rx, ry);
  const { x1, y1, x2, y2 } = angleEquidistantPoints(
    startPoint,
    center,
    endPoint,
  );
  const diff = endAngle - startAngle;
  let large = 0;
  let reverse = 1;
  if (diff < 180 && diff > 0) {
    large = 0;
    reverse = 1;
  } else if (diff > 180 || (diff < 0 && diff > -180)) {
    large = 1;
    reverse = 1;
  }
  const path = `
    M${startPoint.x},${startPoint.y}
    A${rx},${ry} 0 ${large}, ${reverse} ${endPoint.x},${endPoint.y}
    L${rx},${ry}
    Z
  `;
  const angleArcPath = `
    M${x1},${y1}
    A${15},${15} 0 ${large}, ${reverse} ${x2},${y2}
    L${rx},${ry}
    Z
  `;
  // console.log(startPoint, endPoint);
  return { path, angleArcPath };
};

interface IProps extends IDefaultGraphicProps {
  startAngle: number;
  endAngle: number;
  showAngle?: boolean;
  showArc?: boolean;
}

export default (props: IProps) => {
  const {
    width = 40,
    height = 20,
    startAngle = 0,
    endAngle = 270,
    showAngle = false,
    showArc = false,
    fill = defaultFill,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    ...rest
  } = props;
  const [d, setD] = useState('');
  const [arcPath, setArcPath] = useState('');
  const [angle, setAngle] = useState(0);
  useEffect(() => {
    const { path, angleArcPath } = getFanShapedPath(
      startAngle,
      endAngle,
      width,
      height,
    );
    setD(path);
    setArcPath(angleArcPath);
    // 计算弧度角
    let newAngle = endAngle - startAngle;
    newAngle = newAngle < 0 ? newAngle + 360 : newAngle;
    newAngle = Math.round(newAngle);
    setAngle(newAngle);
  }, [startAngle, endAngle, width, height]);
  return (
    <>
      <path
        {...rest}
        d={d}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap={strokeLinecap}
        strokeDasharray={strokeDasharray}
      />
      {showAngle && (
        <text
          x={width - 35}
          y={18}
          fill={stroke}
          style={{ userSelect: 'none' }}>
          {angle}°
        </text>
      )}
      {showArc && (
        <path
          {...rest}
          d={arcPath}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap={strokeLinecap}
          strokeDasharray={strokeDasharray}
        />
      )}
    </>
  );
};
