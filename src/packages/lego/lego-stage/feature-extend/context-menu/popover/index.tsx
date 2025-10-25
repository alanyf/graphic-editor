import { useState, useEffect, useRef, useCallback } from 'react';
import './index.less';

/**
 * 根据类名寻找父元素
 * @param dom dom元素
 * @param className css类名
 * @return dom | null
 */
export function findParentByClass(dom: any, className: string): any {
  if (!dom || dom.tagName === 'BODY') {
    return null;
  }
  if (dom.classList?.contains(className)) {
    return dom;
  }
  return findParentByClass(dom.parentNode, className);
}

interface IProps {
  visible?: boolean;
  onVisibleChange?: (visible?: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  className?: string;
  children?: any[] | any;
}

const isShowOnLeft = (dom: any) => {
  const { x, width } = dom.getBoundingClientRect();
  if (width + x + 200 > document.body.clientWidth) {
    return true;
  }
  return false;
};

export default (props: IProps) => {
  const {
    visible = undefined,
    onVisibleChange = () => '',
    onClick = () => '',
    style = {},
    className = '',
    children = [],
  } = props;
  const [showOnLeft, setShowOnLeft] = useState(false);
  const [visibleState, setVisibleState] = useState(false);
  const popoverRef = useRef<any>();
  const handleClick = useCallback((e: any) => {
    const dom = findParentByClass(e.target, 'popover-container');
    if (!dom) {
      if (visible === undefined) {
        setVisibleState(false);
      }
      onVisibleChange?.(false);
    }
  }, []);

  useEffect(() => {
    setVisibleState(Boolean(visible));
    if (visible) {
      const dom = popoverRef.current?.parentNode;
      if (!dom) {
        return;
      }
      const onLeft = isShowOnLeft(dom);
      setShowOnLeft(onLeft);
    }
  }, [visible]);

  useEffect(() => {
    const dom = popoverRef.current?.parentNode;
    if (dom) {
      const onLeft = isShowOnLeft(dom);
      setShowOnLeft(onLeft);
    }
    document.body.addEventListener('click', handleClick);
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, []);
  return (
    <div
      ref={popoverRef}
      className={`popover-container ${showOnLeft ? 'popover-left-container' : ''} ${
        visible || visibleState ? '' : 'popover-container-hidden'
      } ${className}`}
      style={style}
      onClick={onClick}>
        {/* <div className="popover-mask-container"></div> */}
        <div className="popover-content">
          {children}
        </div>
    </div>
  );
};
