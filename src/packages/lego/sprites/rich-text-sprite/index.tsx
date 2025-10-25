import React from 'react';
import RichTextEditor from 'wangeditor';
import { BaseSprite } from '../BaseSprite';
import type { ISpriteMeta } from '../../interface';
// import RichTextToolbar from './rich-text-toolbar';
import TextRender from './text-render';
import { colors, fontFamily } from './config';
// import './index.less';

interface IProps {
  width: number;
  height: number;
  content: string;
}

interface IState {
  content: string;
}

const SpriteType = 'RichTextSprite';

export class RichTextSprite extends BaseSprite<IProps, IState> {
  editorRef: any = React.createRef();

  editor: any = null;

  setHtml = (value: string) => {
    const { sprite, stage } = this.props;
    const { id } = sprite;
    const newProps = { content: value };
    stage.apis.updateSpriteProps(id, newProps);
  };

  initEditor() {
    const { sprite } = this.props;
    const { content } = sprite.props;
    const { id } = sprite;
    const editor = new RichTextEditor(
      `#wang-editor-toolbar__${id}`,
      `#wang-editor-container__${id}`,
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
    editor.config.fontNames = fontFamily;
    editor.config.colors = colors;
    // 监听变化
    editor.config.onchange = (value: string) => this.setHtml(value);
    editor.create();
    if (content) {
      editor.txt.html(content);
    }
    setTimeout(() => {
      const wEText = editor.$textElem.elems[0];
      wEText?.classList.remove('w-e-text');
      wEText?.classList.add('rich-text-editor-render');
    }, 500);
    this.editor = editor;
  }

  componentDidMount() {
    this.initEditor();
  }

  render() {
    const { sprite } = this.props;
    const { id, props, attrs } = sprite;
    const { editing, size } = attrs;
    const { width, height } = size;
    return (
      <foreignObject
        {...props}
        x={0}
        y={0}
        width={width}
        height={height}
        className="rich-text-sprite-container"
        style={{
          position: 'relative',
          width: `${width}px`,
          height: `${height}px`,
          padding: '3px 5px',
          userSelect: 'none',
          overflow: 'visible',
        }}>
        {/* {editing && <div className="rich-text-editor-container">
          <RichTextToolbar/>
        </div>}
        {!editing && <div
          ref={this.editorRef}
          style={{ height: '100%', outline: 'none', cursor: editing ? 'text': undefined }}
          contentEditable={editing}
          dangerouslySetInnerHTML={{ __html: props.content }}
        />} */}
        <div
          id={`wang-editor-toolbar__${id}`}
          className="rich-text-editor-toolbar"
          style={{ display: editing ? '' : 'none', bottom: height + 10 }}
        />
        <div
          id={`wang-editor-container__${id}`}
          className={`rich-text-editor-content rich-text-editor-${
            editing ? 'edit' : 'render'
          }`}
          spellCheck="false"
          style={{
            cursor: editing ? 'text' : undefined,
            display: editing ? '' : 'none',
          }}
        />
        {/* {!editing && <div
          ref={this.editorRef}
          className="rich-text-editor-render"
          style={{
            height: '100%',
            outline: 'none',
            cursor: editing ? 'text': undefined,
            overflow: 'hidden',
          }}
          contentEditable={editing}
          dangerouslySetInnerHTML={{ __html: props.content }}
        />} */}
        {!editing && <TextRender content={props.content} />}
        {/* {!editing && <div className="rich-text-sprite-mask"/>} */}
      </foreignObject>
    );
  }
}

export const RichTextSpriteMeta: ISpriteMeta<IProps> = {
  type: SpriteType,
  spriteComponent: RichTextSprite,
  initProps: {
    width: 100,
    height: 40,
    content: '',
  },
};

export default RichTextSpriteMeta;
