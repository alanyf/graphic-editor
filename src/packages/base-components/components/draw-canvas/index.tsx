import React, { useState, useEffect, useRef } from 'react';
import ColorPicker from 'color-selector-react';
import StrokeWidthSelect from '../stroke-width-select';
import {
  events,
  getCanvas,
  isSupportTouch,
  downloadBase64File,
  loadImage,
} from './helper';
import type { IImageInfo, Point } from './interface';

import PreviewSvg from './icon/preview';
import EraserSvg from './icon/eraser';
import PenColorIcon from './icon/pen-color';
import PenStrokeWidthIcon from './icon/pen-stroke-width';
import FillColorIcon from './icon/fill-color-icon';

import './index.less';
import { DownCircleFilled } from '@ant-design/icons';
 
const Tooltip = (props: any) => <span {...props}>{props.children}</span>;

const previewPNG = async (imgInfo: IImageInfo) => {
  const { base64, width, height } = imgInfo;
  const newWin: any = window.open('', '_blank');
  const imgHtml = `
    <img
      style="
        width: ${width}px;
        height: ${height}px;
        margin: 0 auto;
        display: block;
        box-shadow: 0 0 5px 5px #eee;
        margin-top: 30px;
      "
      src="${base64}"
    />
  `;
  newWin.document.write(imgHtml);
  newWin.document.title = 'png';
  newWin.document.close();
};

interface IProps {
  initImage?: string;
  initImageData?: ImageData;
  scale?: number;
  width: number;
  height: number;
  onFinish?: (imgInfo: IImageInfo) => void;
}

export default (props: IProps) => {
  const {
    scale = 2,
    width = 400,
    height = 300,
    onFinish = () => '',
    initImage = '',
    initImageData,
    ...rest
  } = props;
  const [canvas, setCanvas] = useState({} as any);
  const [ctx, setCtx] = useState({} as any);
  const canvasContainerRef = useRef({} as any);

  const [stroke, setStroke] = useState('#000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fill, setFill] = useState('transparent');
  const [isErasing, setIsErasing] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState({} as any);

  const getMouseCoordinate = (e: any) => {
    const supportTouch = isSupportTouch();
    const evt = supportTouch ? e.touches[0] : e;
    const coverPos = canvas.getBoundingClientRect();
    const mouseX = evt.clientX - coverPos.left;
    const mouseY = evt.clientY - coverPos.top;
    return { x: mouseX, y: mouseY } as Point;
  };
  // 画线
  const drawLine = ({ x, y }: Point) => {
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  // 擦除
  const erasingLine = ({ x, y }: Point) => {
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(
      x - strokeWidth / 2,
      y - strokeWidth / 2,
      strokeWidth,
      strokeWidth,
    );
    // clearArc(x, y, strokeWidth, ctx);
    ctx.imageSmoothingEnabled = false;
  };
  const draw = (e: any) => {
    const point = getMouseCoordinate(e);
    if (isErasing) {
      erasingLine(point);
    } else {
      drawLine(point);
    }
  };
  const handleMouseMove = (e: any) => {
    draw(e);
  };

  const handleMouseUp = (e: any) => {
    e.preventDefault();
    canvas.removeEventListener(events[1], handleMouseMove, false);
    canvas.removeEventListener(events[2], handleMouseUp, false);
  };

  const handleMouseDown = (e: any) => {
    ctx.beginPath();
    const supportTouch = isSupportTouch();
    const evt = supportTouch ? e.touches[0] : e;
    const coverPos = canvas.getBoundingClientRect();
    const mouseX = evt.clientX - coverPos.left;
    const mouseY = evt.clientY - coverPos.top;
    ctx.moveTo(mouseX, mouseY);
    draw(e);
    canvas.addEventListener(events[1], handleMouseMove, false);
    canvas.addEventListener(events[2], handleMouseUp, false);
  };
  const handleDownload = () => {
    const base64 = canvas.toDataURL('image/png');
    downloadBase64File(base64, `${Date.now()}.png`);
  };
  const handlePreview = () => {
    const base64 = canvas.toDataURL('image/png');
    const imageData = ctx.getImageData(0, 0, width * scale, height * scale);
    imageData.data = Array.from(imageData.data);
    previewPNG({ base64, imageData, width, height });
  };
  const handleFillChange = (color: string) => {
    setFill(color);
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  const handleEraser = () => {
    setIsErasing(!isErasing);
  };
  const drawImage = async (ctx: any, base64: string) => {
    const img: any = await loadImage(base64);
    ctx.drawImage(img, 0, 0, img.width / scale, img.height / scale);
  };
  useEffect(() => {
    const { canvas: canvasDom, ctx: context } = getCanvas({
      width,
      height,
      scale,
    });
    setCanvas(canvasDom);
    setCtx(context);
    canvasContainerRef?.current?.appendChild(canvasDom);

    context.beginPath();
    context.lineWidth = 3;
    context.strokeStyle = '#000';
    context.lineCap = 'round';
    context.lineJoin = 'round';
    // context.shadowBlur = 1;
    // context.shadowColor = '#000';
    if (initImageData) {
      context.putImageData(initImageData, 0, 0);
    } else if (initImage) {
      drawImage(context, initImage);
    }
    return () => {
      const base64 = canvasDom.toDataURL('image/png');
      const imageData = context.getImageData(
        0,
        0,
        width * scale,
        height * scale,
      );
      onFinish({ base64, imageData, width, height, scale, background: fill });
    };
  }, []);

  useEffect(() => {
    ctx.strokeStyle = stroke;
    ctx.shadowColor = stroke;
  }, [ctx, stroke]);
  useEffect(() => {
    ctx.lineWidth = strokeWidth;
  }, [ctx, strokeWidth]);
  return (
    <div {...rest} className="draw-canvas-container" style={{ width, height }}>
      <div className="draw-canvas-toolbar-container">
        <Tooltip
          color="#fff"
          trigger="click"
          visible={tooltipVisible.color}
          onVisibleChange={(visible: boolean) =>
            setTooltipVisible({ ...tooltipVisible, color: visible })
          }
          title={
            <ColorPicker
              color={stroke}
              style={{ boxShadow: 'none' }}
              onChange={({ color }) => setStroke(color)}
              onVisibleChange={(visible: boolean) =>
                setTooltipVisible({ ...tooltipVisible, color: visible })
              }
            />
          }>
          <Tooltip title="笔颜色">
            <PenColorIcon
              style={{ color: stroke }}
              className="draw-canvas-toolbar-tool"
            />
          </Tooltip>
        </Tooltip>

        <Tooltip
          color="#fff"
          trigger="click"
          visible={tooltipVisible.strokeWidth}
          onVisibleChange={(visible: boolean) =>
            setTooltipVisible({ ...tooltipVisible, strokeWidth: visible })
          }
          title={
            <StrokeWidthSelect
              strokeWidth={strokeWidth}
              style={{ color: 'black' }}
              onChange={(n: number) => {
                setStrokeWidth(n);
                setTooltipVisible({ ...tooltipVisible, strokeWidth: false });
              }}
            />
          }>
          <Tooltip title="笔触粗细">
            <PenStrokeWidthIcon
              strokeWidth={strokeWidth}
              className="draw-canvas-toolbar-tool"
            />
          </Tooltip>
        </Tooltip>

        <Tooltip
          color="#fff"
          trigger="click"
          visible={tooltipVisible.fill}
          onVisibleChange={(visible: boolean) =>
            setTooltipVisible({ ...tooltipVisible, fill: visible })
          }
          title={
            <ColorPicker
              color={stroke}
              style={{ boxShadow: 'none' }}
              onChange={({ color }) => handleFillChange(color)}
              onVisibleChange={(visible: boolean) =>
                setTooltipVisible({ ...tooltipVisible, fill: visible })
              }
            />
          }>
          <Tooltip title="填充">
            <FillColorIcon
              style={{ color: fill }}
              className="draw-canvas-toolbar-tool"
            />
          </Tooltip>
        </Tooltip>

        <Tooltip title="擦除">
          <EraserSvg
            className="draw-canvas-toolbar-tool"
            style={{
              backgroundColor: isErasing
                ? 'rgba(230 191 255 / 70%)'
                : undefined,
            }}
            onClick={handleEraser}
          />
        </Tooltip>

        <Tooltip title="查看图片">
          <PreviewSvg
            className="draw-canvas-toolbar-tool"
            onClick={handlePreview}
          />
        </Tooltip>

        <Tooltip title="下载图片">
          <DownCircleFilled
            className="draw-canvas-toolbar-tool"
            onClick={handleDownload}
          />
        </Tooltip>
      </div>
      <div
        className="canvas-container"
        ref={canvasContainerRef}
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};
