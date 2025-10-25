import React from 'react';
import Popover from './popover';
import './index.less';

const CaretRightOutlined = (props: any) => <div {...props}>▶</div>;

export interface IMenuItem {
  text: string;
  key: string;
  disable?: boolean;
  icon?: React.ReactNode;
  children?: IMenuItem[];
  [key: string]: any;
}

interface IProps {
  visible?: boolean;
  menuList: IMenuItem[];
  onTrigger?: (menuItem: IMenuItem) => void;
  onVisibleChange?: (visible: boolean) => void;
}

export default (props: IProps) => {
  const {
    menuList,
    visible = false,
    onTrigger = () => '',
    onVisibleChange = () => '',
  } = props;
  const renderMenuItem = (menu: IMenuItem) => {
    const { text, icon, disable = false, shortcutKey, children } = menu;
    return (
      <div
        key={menu.key}
        onClick={() => {
          if (disable || children) {
            return;
          }
          onTrigger(menu);
          onVisibleChange(false);
        }}
        className={`context-menu-item ${
          disable ? 'context-menu-item-disable' : ''
        } ${children ? 'popover-parent-container' : ''}`}>
        <div className="context-menu-icon">{icon}</div>
        <div className="context-menu-text">{text}</div>
        <div className="context-menu-shortcut-key">{shortcutKey}</div>
        {children && (
          <>
            <div className="context-menu-more">
              < CaretRightOutlined />
            </div>
            <Popover>
              <div className="context-menu-list">
                {children.map((child: IMenuItem) => renderMenuItem(child))}
              </div>
            </Popover>
          </>
        )}
      </div>
    );
  };
  return (
    <>
      {visible && <Popover visible={visible} onVisibleChange={onVisibleChange as any}>
        <div className="context-menu-list">
          {menuList.map((menu: any) => renderMenuItem(menu))}
        </div>
      </Popover>}
    </>
  );
};
