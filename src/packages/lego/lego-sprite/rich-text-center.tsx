import type { ISize, ISprite, IStageApis } from '../interface';
import RichTextEditor from '../rich-text-render-editor';

interface IProps {
  sprite: ISprite;
  stage: IStageApis;
  editable?: boolean;
}

export default (editorProps: IProps) => {
  const { sprite, stage } = editorProps;
  const { id, attrs, props } = sprite;
  const { size = {}, editing = false } = attrs;
  const { width = 0, height = 0 } = size as ISize;
  const { editable = true, content = '' } = props;
  const padding = 5;
  return (
    <foreignObject
      {...props}
      x={padding}
      y={padding}
      width={Math.max(width - padding * 2, 0)}
      height={Math.max(height - padding * 2, 0)}
      className="rich-text-sprite-container"
      style={{
        position: 'relative',
        width: width - padding * 2,
        height: height - padding * 2,
        userSelect: 'none',
        overflow: 'visible',
        pointerEvents: 'none',
      }}>
      {editing && editable && (
        <div
          id={`outer-rich-text-toolbar__${id}`}
          className="rich-text-render-editor-toolbar"
          style={{
            position: 'absolute',
            top: -50,
            left: 0,
            pointerEvents: 'all',
          }}
        />
      )}
      <div
        className="rich-text-sprite-content"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          padding: '0 5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 30,
          pointerEvents: editing ? 'all' : 'none',
          cursor: 'text',
        }}
        // onMouseDown={(e: React.MouseEvent) => {
        //   e.stopPropagation();
        //   stage.apis.setActiveSpriteList([sprite]);
        //   stage.apis.setEditingSprite(sprite);
        // }}
      >
        <RichTextEditor
          id={id}
          toolbarId={`#outer-rich-text-toolbar__${id}`}
          editing={editing}
          editable={editable}
          content={content}
          onChange={(content: string) =>
            stage.apis.updateSpriteProps(id, { content })
          }
        />
      </div>
    </foreignObject>
  );
};
