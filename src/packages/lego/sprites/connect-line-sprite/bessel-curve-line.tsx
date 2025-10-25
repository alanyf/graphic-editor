import { useState, useEffect, useCallback } from 'react';
import { angleToRadian } from '@packages/geometry-tools';
import type { ISprite } from '../../interface';
import type { IPort, IPortPointOption } from '.';

interface IProps {
  start: IPortPointOption;
  end: IPortPointOption;
  spriteMap: Record<string, ISprite>;
  [key: string]: unknown;
}

export default (props: IProps) => {
  const { start, end, spriteMap, ...rest } = props;
  const [d, setD] = useState('');
  const getPortRadian = useCallback(
    (isEnd: boolean, port?: IPort) => {
      const defaultRadian = isEnd ? Math.PI : 0;
      if (!port) {
        return defaultRadian;
      }
      const { spriteId, arcAngle = 0 } = port;
      const targetSprite = spriteMap[spriteId];
      if (!targetSprite) {
        return defaultRadian;
      }
      const spriteAngle = targetSprite.attrs.angle;
      return angleToRadian(spriteAngle + arcAngle);
    },
    [spriteMap],
  );
  useEffect(() => {
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    const r = Math.max(Math.abs(x2 - x1) / 4, 50);
    const startRadian = getPortRadian(start.x - end.x > 0, start.port);
    const endRadian = getPortRadian(end.x - start.x > 0, end.port);
    const cx1 = x1 + r * Math.cos(startRadian);
    const cy1 = y1 + r * Math.sin(startRadian);
    const cx2 = x2 + r * Math.cos(endRadian);
    const cy2 = y2 + r * Math.sin(endRadian);
    const path = `
      M${x1},${y1}
      C${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}
    `;
    setD(path);
  }, [start, end, getPortRadian]);
  return (
    <>
      <path fill="none" strokeWidth={1} stroke="#000" {...rest} d={d} />
      <path
        d={d}
        fill="none"
        strokeWidth={6}
        strokeDasharray="none"
        stroke="transparent"
      />
    </>
  );
};
