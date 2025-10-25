import React from 'react';
import { Tooltip } from 'antd';

export default (props: any) => (
  <Tooltip
    placement="bottom"
    color="white"
    {...props}
    title={
      <span style={{ color: '#222', fontSize: '13px' }}>{props.title}</span>
    }>
    {props.children}
  </Tooltip>
);
