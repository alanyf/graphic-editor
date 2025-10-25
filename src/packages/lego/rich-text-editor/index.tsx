import { useEffect, useRef } from 'react';
import RichTextEditor from 'wangeditor';
import TextRender from './text-render';
import './index.less';

interface IProps {
  content: string;
  editing?: boolean;
  id?: string;
  toolbarId?: string;
  onChange?: (html: string) => void;
}

const initEditor = ({
  id,
  content,
  toolbarId = '',
  onChange,
}: {
  id: string;
  content?: string;
  toolbarId?: string;
  onChange: (html: string) => void;
}) => {
  const editor = new RichTextEditor(
    toolbarId || `#rich-text-render-editor-toolbar__${id}`,
    `#rich-text-render-editor-container__${id}`,
  );
  editor.config.menus = [
    'undo',
    'redo',
    'fontName',
    'fontSize',
    'bold',
    'italic',
    'underline',
    'strikeThrough',
    'foreColor',
    'backColor',
    'justify',
    'link',
    'list',
    'splitLine',
    // 'code',
  ];
  // 监听变化
  editor.config.onchange = (value: string) => onChange?.(value);
  editor.create();
  if (content) {
    editor.txt.html(content);
  }
  setTimeout(() => {
    const wEText = editor.$textElem.elems[0];
    wEText?.classList.remove('w-e-text');
    wEText?.classList.add('rich-text-render-editor-container');
  }, 500);
  return editor;
};
export default (props: IProps) => {
  const {
    content = '',
    editing = false,
    id = 'default',
    toolbarId = '',
    onChange = () => '',
  } = props;

  useEffect(() => {
    if (editing) {
      initEditor({ id, content, toolbarId, onChange });
    }
  }, [editing]);
  return (
    <>
      {editing && (
        <>
          {!toolbarId && (
            <div
              id={`rich-text-render-editor-toolbar__${id}`}
              className="rich-text-render-editor-toolbar"
              style={{ display: editing ? '' : 'none', top: -40 }}
            />
          )}
          <div
            id={`rich-text-render-editor-container__${id}`}
            className={`rich-text-render-editor-content rich-text-render-editor-${
              editing ? 'edit' : 'render'
            }`}
            spellCheck="false"
            style={{
              cursor: editing ? 'text' : undefined,
              display: editing ? '' : 'none',
              height: 'auto',
            }}
          />
        </>
      )}
      {!editing && <TextRender content={content} />}
    </>
  );
};
