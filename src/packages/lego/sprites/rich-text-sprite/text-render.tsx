import { useEffect, useRef } from 'react';

interface IProps {
  content: string;
}

export default ({ content = '' }: IProps) => {
  const contentRef = useRef<any>();
  useEffect(() => {
    const pList = contentRef.current?.querySelectorAll('p');
    pList.forEach((p: any) => {
      p.style.margin = 0;
      p.style.lineHeight = 1.5;
    });
  }, []);
  return (
    <div
      ref={contentRef}
      className="rich-text-editor-render"
      style={{
        height: '100%',
        outline: 'none',
        overflow: 'hidden',
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
