import React, { useRef, useEffect } from 'react';
import Canvas from './canvas';
import { Rect, Line, Circular } from './shapes';

import './index.less';

export default (props: any) => {
  const { width = 800, height = 600 } = props;
  const canvasRef = useRef({} as any);
  useEffect(() => {
    const canvas = new Canvas(canvasRef.current);
    const rect = new Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 100,
      attrs: {
        fillStyle: '#f5f5f5',
        strokeStyle: '#000000',
        lineWidth: 1,
      },
    });
    const line = new Line({
      x: 200,
      y: 200,
      x1: 0,
      y1: 0,
      x2: 60,
      y2: 80,
      width: 60,
      height: 80,
      attrs: {
        fillStyle: '#f5f5f5',
        strokeStyle: '#000000',
        lineWidth: 1,
      },
    });
    const circular = new Circular({
      x: 200,
      y: 50,
      r: 50,
      width: 100,
      height: 100,
      attrs: {
        fillStyle: '#f5f5f5',
        strokeStyle: '#000000',
        lineWidth: 2,
      },
    });
    // 添加
    canvas.add(rect);
    canvas.add(line);
    canvas.add(circular);
    return () => {
      canvas.handleDestroy();
    };
  }, []);
  return (
    <div
      className="easy-canvas-container"
      style={{ width, height, margin: '0 auto', backgroundColor: '#fff' }}
    >
      <canvas
        ref={canvasRef}
        className="easy-canvas-content"
        width={width * 2}
        height={height * 2}
      ></canvas>
    </div>
  );
};
