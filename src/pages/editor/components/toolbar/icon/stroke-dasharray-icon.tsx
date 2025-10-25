import React from 'react';

export default (props: any) => (
  <svg
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    {...props}>
    <g stroke="#555" strokeWidth="2" fill="none" fillRule="evenodd">
      <line
        x1="0"
        y1="1"
        x2="20"
        y2="1"
        strokeDasharray="1 1"
        strokeWidth="1"></line>
      <line x1="0" y1="6" x2="20" y2="6" strokeDasharray="2 2"></line>
      <line x1="0" y1="12" x2="20" y2="12" strokeDasharray="4 1 4 1"></line>
      <line
        x1="0"
        y1="18"
        x2="19"
        y2="18"
        strokeDasharray="none"
        strokeWidth="3"></line>
    </g>
  </svg>
);
