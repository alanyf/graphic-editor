// 平行四边形
import React, { useState, useEffect } from 'react';
import {
  defaultStroke,
  defaultStrokeWidth,
  defaultStrokeLinecap,
  defaultStrokeDasharray,
} from '../defaultSvgConfig';
import type { IDefaultGraphicProps, Point } from '../../interface';
import { fittingCurve } from '../../utils/tools';

interface IProps extends IDefaultGraphicProps {
  points: Point[];
  curvature?: number;
}

export default (props: IProps) => {
  const {
    points = [],
    curvature = 0.4,
    stroke = defaultStroke,
    strokeWidth = defaultStrokeWidth,
    strokeLinecap = defaultStrokeLinecap,
    strokeDasharray = defaultStrokeDasharray,
    ...rest
  } = props;
  const [d, setD] = useState('');

  useEffect(() => {
    const path = fittingCurve(points, curvature);
    setD(path);
  }, [points, curvature]);
  return (
    <path
      fill={'none'}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeDasharray={strokeDasharray}
      {...rest}
      d={d}
    />
  );
};
