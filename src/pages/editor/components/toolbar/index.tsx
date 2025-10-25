import React, { useState, useEffect } from 'react';
import ColorPicker from 'color-selector-react';
import { CheckOutlined } from '@ant-design/icons';
import type { ISprite } from '@packages/lego';
import PopoverTool from '../popover-tool';
import FillIcon from './icon/fill-color-icon';
import TextIcon from './icon/text-color-icon';
import BorderIcon from './icon/border-color-icon';
import StrokeWidthIcon from './icon/stroke-width-icon';
import StrokeDasharrayIcon from './icon/stroke-dasharray-icon';
import EndPointIcon from './icon/end-point-icon';
import './index.less';

export default (props: any) => {
  const [fillColor, setFillColor] = useState('#000');
  const [textColor, setTextColor] = useState('#000');
  const [borderColor, setBorderColor] = useState('#000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeDasharray, setStrokeDasharray] = useState('none');
  const [visibleObj, setVisibleObj] = useState({} as Record<string, boolean>);
  const { stage, editingSprite } = props;

  const updateState = (activeSpriteList: ISprite[]) => {
    const sprite = activeSpriteList[0];
    if (!sprite) {
      return;
    }
     
    const {
      fill = '',
      color = '',
      stroke = '#000',
      strokeWidth = 1,
      strokeDasharray = 'none',
    } = sprite.props;
    setFillColor(fill);
    setTextColor(color);
    setBorderColor(stroke);
    setStrokeWidth(strokeWidth);
    setStrokeDasharray(strokeDasharray);
  };

  useEffect(() => {
    updateState(props.activeSpriteList);
  }, [props.activeSpriteList]);

  if (!stage) {
    return null;
  }
  const handlePropsChange = (newProps: Record<string, any>) => {
    const { stage } = props;
    const { activeSpriteList } = stage.store();
    activeSpriteList.forEach((sprite: ISprite) => {
       
      sprite.props = { ...sprite.props, ...newProps };
    });
     
    stage.apis.updateSpriteList(activeSpriteList, true);
  };
  const handleFillChange = (colorObj: any) => {
    setFillColor(colorObj.hex);
    handlePropsChange({ fill: colorObj.hex });
  };
  const handleTextChange = (colorObj: any) => {
    setFillColor(colorObj.hex);
    handlePropsChange({ color: colorObj.hex });
  };
  const handleBorderChange = (colorObj: any) => {
    setBorderColor(colorObj.hex);
    handlePropsChange({ stroke: colorObj.hex });
  };
  const handleStrokeWidthChange = (newProps: any) => {
    setStrokeWidth(newProps.strokeWidth);
    handlePropsChange(newProps);
  };
  const handleStrokeDasharrayChange = (newProps: any) => {
    setStrokeDasharray(newProps.strokeDasharray);
    handlePropsChange(newProps);
  };
   
  const getLineSvg = (
    strokeWidth: number,
    strokeDasharray?: string,
    svgProps: any = {},
  ) => {
    const { width = 80, height = 10 } = svgProps;
    return (
      <svg width={width} height={height} {...svgProps}>
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          strokeWidth={strokeWidth}
          stroke="#555"
          strokeDasharray={strokeDasharray}></line>
      </svg>
    );
  };
  const strokeDasharrayList = [
    'none',
    '2 2',
    '8 8',
    '2 4',
    '4 2',
    '2 6',
    '16 4 6 4',
    '16 6 6 6 6 6',
  ].map((val: string) => ({
    text: '',
    icon: getLineSvg(1, val),
    props: { strokeDasharray: val },
  }));
   
  const strokeWidthList = [0, 1, 2, 3, 4, 8, 12].map((strokeWidth: number) => ({
    text: strokeWidth,
    icon: getLineSvg(strokeWidth, '', { height: 16 }),
    props: { strokeWidth },
  }));
  const renderFillColor = () => (
    <PopoverTool
      overlayClassName="no-bg-popover"
      visible={visibleObj.fill}
      onVisibleChange={(visible: boolean) =>
        setVisibleObj({ ...visibleObj, fill: visible })
      }
      content={
        <ColorPicker
          color={fillColor}
          noneTitle="无填充"
          noneValue="none"
          onChange={({ color }) => handleFillChange({ hex: color })}
          onVisibleChange={(visible: boolean) =>
            setVisibleObj({ ...visibleObj, fill: visible })
          }
        />
      }
      icon={<FillIcon className="tool-icon-content" color={fillColor} />}
    />
  );
  const renderTextColor = () => (
    <PopoverTool
      overlayClassName="no-bg-popover"
      visible={visibleObj.text}
      onVisibleChange={(visible: boolean) =>
        setVisibleObj({ ...visibleObj, text: visible })
      }
      content={
        <ColorPicker
          color={textColor}
          onChange={({ color }) => handleTextChange({ hex: color })}
          onVisibleChange={(visible: boolean) =>
            setVisibleObj({ ...visibleObj, text: visible })
          }
        />
      }
      icon={<TextIcon className="tool-icon-content" color={textColor} />}
    />
  );
  const renderBorderColor = () => (
    <PopoverTool
      overlayClassName="no-bg-popover"
      visible={visibleObj.border}
      onVisibleChange={(visible: boolean) =>
        setVisibleObj({ ...visibleObj, border: visible })
      }
      content={
        <ColorPicker
          color={borderColor}
          noneTitle="无边框"
          noneValue="none"
          onChange={({ color }) => handleBorderChange({ hex: color })}
          onVisibleChange={(visible: boolean) =>
            setVisibleObj({ ...visibleObj, border: visible })
          }
        />
      }
      icon={<BorderIcon className="tool-icon-content" color={borderColor} />}
    />
  );
  const renderStrokeWidth = () => (
    <PopoverTool
      overlayClassName="no-bg-popover"
      content={
        <div className="popover-option-container">
          {strokeWidthList.map(({ text, icon, props }, i: number) => (
            <div
              key={i}
              className="popover-option-content"
              onClick={() => handleStrokeWidthChange(props)}>
              <div style={{ width: '30px', color: '#1890ff' }}>
                {strokeWidth === props.strokeWidth && (
                  <CheckOutlined className="popover-option-check-icon" />
                )}
              </div>
              <div style={{ width: '30px' }}>{text}</div>
              {icon}
            </div>
          ))}
        </div>
      }
      icon={<StrokeWidthIcon className="tool-icon-content" />}
    />
  );
  const renderStrokeDasharray = () => (
    <PopoverTool
      overlayClassName="no-bg-popover"
      content={
        <div className="popover-option-container">
          {strokeDasharrayList.map(({ text, icon, props }, i: number) => (
            <div
              key={i}
              className="popover-option-content"
              onClick={() => handleStrokeDasharrayChange(props)}>
              {/* <div style={{ width: '40px' }}>{text}</div> */}
              <div style={{ width: '30px', color: '#1890ff' }}>
                {strokeDasharray === props.strokeDasharray && (
                  <CheckOutlined className="popover-option-check-icon" />
                )}
                {text}
              </div>
              {icon}
            </div>
          ))}
        </div>
      }
      icon={<StrokeDasharrayIcon className="tool-icon-content" />}
    />
  );
  const renderEndPointSelect = (sprite: ISprite) => {
    const { start, end } = sprite.props;
    if (!start && !end) {
      return null;
    }
    const list = [
      { text: '无 -', type: '' },
      { text: '箭头 ▶', type: 'arrow' },
      { text: '圆点 ●', type: 'circle' },
      { text: '空心圆 〇', type: 'hollowCircle' },
      { text: '矩形 ◆', type: 'tiltRect' },
    ];
    return (
      <PopoverTool
        overlayClassName="no-bg-popover"
        visible={visibleObj.endPoint}
        content={
          <div className="popover-option-container">
            <div
              className="popover-option-content"
              style={{
                fontWeight: 'bold',
                padding: '15px 10px',
                color: '#000',
              }}>
              起点
            </div>
            {list.map((e: any) => (
              <div
                key={e.type}
                className="popover-option-content"
                style={{ padding: '15px 15px' }}
                onClick={() => {
                  stage.apis.updateSpriteProps(sprite, {
                    start: { ...start, type: e.type },
                  });
                }}>
                {e.text}
              </div>
            ))}
            <div
              className="popover-option-content"
              style={{
                fontWeight: 'bold',
                padding: '15px 10px',
                color: '#000',
              }}>
              终点
            </div>
            {list.map((e: any) => (
              <div
                key={e.type}
                className="popover-option-content"
                style={{ padding: '15px 15px' }}
                onClick={() => {
                  stage.apis.updateSpriteProps(sprite, {
                    end: { ...end, type: e.type },
                  });
                }}>
                {e.text}
              </div>
            ))}
          </div>
        }
        icon={<EndPointIcon className="tool-icon-content" />}
      />
    );
  };

  const renderTools = () => {
    const { activeSpriteList = [] } = props;
    if (activeSpriteList.length > 0) {
      return (
        <>
          {renderFillColor()}
          {/* {renderTextColor()} */}
          {renderBorderColor()}
          {renderStrokeWidth()}
          {renderStrokeDasharray()}
        </>
      );
    }
    return null;
  };

  const renderEditConfig = () => {
    if (!editingSprite) {
      return null;
    }
    return <>{renderEndPointSelect(editingSprite)}</>;
  };

  return (
    <div className="lego-toolbar-container">
      {renderTools()}
      {renderEditConfig()}
    </div>
  );
};
