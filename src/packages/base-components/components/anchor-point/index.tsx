import React, { useState, useEffect, useRef } from 'react';

const defaultFun = () => '';

export interface Point {
  x: number;
  y: number;
}

interface IProps {
  x?: number;
  y?: number;
  radius?: number;
  stroke?: string;
  strokeWidth?: number;
  fill?: string;
  id?: string;
  className?: string;
  style?: Record<string, any>;
  onChange?: (point: Point) => void;
  onMouseDown?: (point: Point, e: React.MouseEvent) => void;
  onMouseMove?: (point: Point, e: MouseEvent) => void;
  onMouseUp?: (point: Point, e: MouseEvent) => void;
}
const initPoint: Point = { x: -1, y: -1 };

export default (props: IProps) => {
  const {
    x = 0,
    y = 0,
    radius = 4,
    stroke = '#fff',
    strokeWidth = '1',
    fill = '#1e7fff',
    className = '',
    style = {},
    onChange = defaultFun,
    onMouseDown: mouseDown= defaultFun,
    onMouseMove: mouseMove= defaultFun,
    onMouseUp: mouseUp= defaultFun,
    ...rest
  } = props;
  const [startPoint, setStartPoint] = useState(initPoint);
  const [startAnchorPoint, setStartAnchorPoint] = useState(initPoint);
  const [currentPoint, setCurrentPoint] = useState(initPoint);
  const [moving, setMoving] = useState(false);
  const pointRef = useRef<any>();

  const getStatePoint = (e: MouseEvent) => {
    const { pageX, pageY } = e;
    // 计算在鼠标相对锚点的坐标
    const point = {
      x: pageX - startPoint.x + startAnchorPoint.x,
      y: pageY - startPoint.y + startAnchorPoint.y,
    };
    return point;
  };
  // 鼠标拖动锚点
  const onMouseMove = (e: MouseEvent) => {
    const newPoint = getStatePoint(e);
    setCurrentPoint(newPoint);
    onChange(newPoint);
    mouseMove(newPoint, e);
  };

  // 鼠标抬起锚点
  const onMouseUp = (e: MouseEvent) => {
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('mouseup', onMouseUp, true);
    setStartPoint(initPoint);
    setMoving(false);
    mouseUp(currentPoint, e);
  };
  // 鼠标按下锚点
  const onMouseDown = (e: React.MouseEvent) => {
    const { pageX, pageY } = e;
    setStartPoint({ x: pageX, y: pageY });
    setStartAnchorPoint({ x, y });
    setMoving(true);
    mouseDown({ x, y }, e);
  };

  // useEffect(() => {
  //   pointRef.current?.addEventListener('mousedown', onMouseDown);
  //   return () => {
  //     pointRef.current?.removeEventListener('mousedown', onMouseDown);
  //   };
  // }, []);

  useEffect(() => {
    if (moving) {
      document.addEventListener('mousemove', onMouseMove, true);
      document.addEventListener('mouseup', onMouseUp, true);
    }
  }, [moving]);

  return (
    <circle
      ref={pointRef}
      style={{ cursor: 'pointer', ...style }}
      filter="drop-shadow(rgba(0, 0, 0, 0.4) 0 0 5)"
      {...rest}
      className={className}
      stroke={stroke}
      strokeWidth={strokeWidth}
      fill={fill}
      cx={x}
      cy={y}
      r={radius}
      onMouseDown={onMouseDown}
    />
  );
};
