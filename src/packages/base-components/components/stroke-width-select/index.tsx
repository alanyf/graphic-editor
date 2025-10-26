import './index.less';

const CheckOutlined = (props: any) => <span {...props}>[]</span>;

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
        strokeDasharray={strokeDasharray}
      />
    </svg>
  );
};
const defaultStrokeWidthList = [0, 1, 2, 3, 4, 8, 12];

const getOptionList = (list: number[]) =>
  list.map((strokeWidth: number) => ({
    text: strokeWidth,
    icon: getLineSvg(strokeWidth, '', { height: 16 }),
    value: strokeWidth,
  }));

interface IProps {
  strokeWidth?: number;
  strokeWidthList?: number[];
  style?: React.CSSProperties;
  onChange?: (strokeWidth: number) => void;
}

export default (props: IProps) => {
  const {
    onChange = () => '',
    strokeWidth = 3,
    strokeWidthList = defaultStrokeWidthList,
  } = props;
  const optionList = getOptionList(strokeWidthList);
  return (
    <div className="popover-option-container">
      {optionList.map(({ text, icon, value }) => (
        <div
          key={value}
          className="popover-option-content"
          onClick={() => onChange(value)}>
          <div style={{ width: '30px', color: '#1890ff' }}>
            {strokeWidth === value && (
              <CheckOutlined className="popover-option-check-icon" />
            )}
          </div>
          <div style={{ width: '30px' }}>{text}</div>
          {icon}
        </div>
      ))}
    </div>
  );
};
