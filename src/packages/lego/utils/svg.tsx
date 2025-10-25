export default (props: any) => {
  const { width = 0, height = 0, style = {} } = props;
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${width} ${height}`}
      {...props}
      width={width}
      height={height}
      style={{ ...{ overflow: 'visible' }, ...style }}>
      {props.children}
    </svg>
  );
};
