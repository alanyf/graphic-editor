export interface Point {
  x: number;
  y: number;
}

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IProps {}

export interface IImageInfo {
  base64: number;
  imageData: ImageData;
  width: number;
  height: number;
  background?: string;
  scale?: number;
}
