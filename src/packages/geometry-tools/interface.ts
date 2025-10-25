// 点
export interface Point {
  x: number;
  y: number;
}

// 线
export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// 方程
export interface Equation {
  k: number;
  b: number;
  x?: number; // 这个x表示在斜率无限大，也即直线垂直x轴方程为x = n;时 n 的值，正常情况为NaN
}

export interface Triangle {
  A: Point;
  B: Point;
  C: Point;
}
