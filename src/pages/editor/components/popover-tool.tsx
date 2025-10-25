import React, { useState } from 'react';
import { Popover } from 'antd';

export default ({ content, icon, ...rest }: any) => {
  const [visible, setVisible] = useState(false);
  return (
    <Popover
      placement="bottom"
      content={content}
      visible={visible}
      trigger="click"
      onVisibleChange={(isVisible: boolean) => setVisible(isVisible)}
      {...rest}>
      {icon}
    </Popover>
  );
};
