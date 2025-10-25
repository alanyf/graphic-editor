import CheckIcon from './check-icon';
import './index.less';

interface IOption {
  value: any;
  label: React.ReactNode;
}

interface IProps {
  value: any;
  options: IOption[];
  style?: any;
  onChange?: (value: any, option: IOption) => void;
}

export default (props: IProps) => {
  const { onChange = () => '', value = 3, options = [], style = {} } = props;
  return (
    <div className="check-select-container" style={style}>
      {options.map((option: IOption) => (
        <div
          key={option.value}
          className="check-select-content"
          title={option.label as string}
          onClick={() => onChange(option.value, option)}
        >
          <div className="check-select-check-icon">{value === option.value && <CheckIcon />}</div>
          <div className="check-select-label">{option.label}</div>
        </div>
      ))}
    </div>
  );
};
