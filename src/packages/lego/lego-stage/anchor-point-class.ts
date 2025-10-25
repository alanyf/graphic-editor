import type { Point } from '../interface';

export interface IAnchorPointListener {
  onMouseDown?: (point: Point, e: React.MouseEvent) => void;
  onMouseUp?: (point: Point, e: React.MouseEvent) => void;
  onMouseMove?: (point: Point, e: React.MouseEvent) => void;
  onChange?: (point: Point) => void;
}

export interface IAnchor {
  id: string;
  point: Point;
  listener: IAnchorPointListener;
}

export class AnchorPointClass {
  readonly anchorPointList: IAnchor[] = [];

  private createUuid() {
    return `anchor-point-${this.anchorPointList.length}`;
  }

  public createAnchorPoint(initPoint: Point, listener: IAnchorPointListener) {
    const anchorPoint = {
      id: this.createUuid(),
      point: initPoint,
      listener,
    };
    this.anchorPointList.push(anchorPoint);
    return anchorPoint;
  }

  public removeAnchorPoint(id: string) {
    for (let i = 0; i < this.anchorPointList.length; i += 1) {
      const anchorPoint = this.anchorPointList[i];
      if (anchorPoint.id === id) {
        this.anchorPointList.splice(i, 1);
        return anchorPoint;
      }
    }
    return null;
  }
}
