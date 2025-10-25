import React from 'react';

export default (props: any) => (
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    {...props}>
    <path
      d="M834.5 704.9H714.3L644.1 515H423.6l-70.2 189.9H233.1L483.7 85.2H584l250.5 619.7zM619 447l-80.2-218.5h-10L448.7 447H619z"
      fill="#555555"
      p-id="3634"></path>
    <path d="M64.2 787.3h886.1v189.6H64.2z" fill={props.color || '#555'}></path>
  </svg>
);
