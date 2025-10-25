import { useEffect, useState } from 'react';
import { Point } from '@packages/lego/interface';

export const HelperPoints = () => {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    /**
     * 渲染多个点
     */
    (window as any).renderHelperPoints = (_points: Point[]) => setPoints(_points);
    /**
     * 渲染单个点
     */
    (window as any).renderHelperPoint = (point: Point, index = 0) => {
      const newPoints = [...points];
      newPoints[index] = point;
      setPoints(newPoints);
    };
  }, []);

  return (
    <g data-name="helper-pointz">
      {points?.map((p: any) => (
        <circle
          key={JSON.stringify(p)}
          r={4}
          cx={p.x}
          cy={p.y}
          fill={p.color || 'orange'}
        />
      ))}
    </g>
  );
};
