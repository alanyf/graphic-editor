import React from 'react';

export default (props: any) => (
  <svg
    viewBox="0 0 20 20"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    {...props}
    style={{
      overflow: 'visible',
      ...(props.style || {}),
    }}
  >
    <circle cx="10" cy="10" r="9" stroke="black" stroke-width="2" fill="none" />
    <circle
      cx="10"
      cy="10"
      r={(props.strokeWidth || 6) / 2}
      stroke="none"
      stroke-width="0"
      fill="currentColor"
    />
  </svg>
);
