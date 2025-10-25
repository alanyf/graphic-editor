import React from 'react';
// import RichTextEditor from '../../../rich-text-editor';

const RichTextEditor = (props: any) => <div {...props}>toolbar</div>;

const toolList = [
  'fontName',
  'fontSize',
  'bold',
  'italic',
  'underline',
  'strikeThrough',
  'foreColor',
  'superscript',
  'subscript',
];
export default () => <RichTextEditor toolList={toolList} />;
