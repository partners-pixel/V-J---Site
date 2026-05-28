import { useEffect, useRef } from 'react';

// Lightweight WYSIWYG editor (no external deps). Emits HTML.
const exec = (cmd, arg = null) => document.execCommand(cmd, false, arg);

const toolBtn = {
  background: 'var(--white)',
  border: '1px solid rgba(0,0,0,.14)',
  borderRadius: 5,
  padding: '.3rem .55rem',
  fontSize: '.82rem',
  lineHeight: 1,
  cursor: 'pointer',
  color: 'var(--tdark)',
  fontFamily: 'Inter,sans-serif',
  minWidth: 30,
};

export default function RichTextEditor({ value, onChange, placeholder = 'Write the post…' }) {
  const ref = useRef(null);

  // Sync external value (e.g. when loading a post to edit) without clobbering typing.
  useEffect(() => {
    const el = ref.current;
    if (el && value !== el.innerHTML) el.innerHTML = value || '';
  }, [value]);

  const emit = () => onChange(ref.current?.innerHTML || '');

  // onMouseDown + preventDefault keeps the editor's selection while clicking a button.
  const run = (cmd, arg) => (e) => { e.preventDefault(); exec(cmd, arg); emit(); };

  const addLink = (e) => {
    e.preventDefault();
    const url = window.prompt('Link URL (https://…)');
    if (url) { exec('createLink', url.trim()); emit(); }
  };
  const addImage = (e) => {
    e.preventDefault();
    const url = window.prompt('Image URL (https://…)');
    if (url) { exec('insertImage', url.trim()); emit(); }
  };

  const Btn = ({ on, title, label, w }) => (
    <button type="button" title={title} onMouseDown={on} style={{ ...toolBtn, ...(w ? { minWidth: w } : null) }}>{label}</button>
  );

  return (
    <div style={{ border: '1px solid rgba(0,0,0,.18)', borderRadius: 8, overflow: 'hidden', background: 'var(--white)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', padding: '.5rem', borderBottom: '1px solid rgba(0,0,0,.1)', background: 'var(--off,#f6f7f9)' }}>
        <Btn on={run('bold')} title="Bold" label={<b>B</b>} />
        <Btn on={run('italic')} title="Italic" label={<i>I</i>} />
        <Btn on={run('underline')} title="Underline" label={<u>U</u>} />
        <Btn on={run('formatBlock', 'H2')} title="Heading" label="H2" />
        <Btn on={run('formatBlock', 'H3')} title="Subheading" label="H3" />
        <Btn on={run('formatBlock', 'P')} title="Paragraph" label="¶" />
        <Btn on={run('insertUnorderedList')} title="Bullet list" label="• List" w={48} />
        <Btn on={run('insertOrderedList')} title="Numbered list" label="1. List" w={52} />
        <Btn on={run('formatBlock', 'BLOCKQUOTE')} title="Quote" label="❝" />
        <Btn on={addLink} title="Insert link" label="🔗" />
        <Btn on={addImage} title="Insert image by URL" label="🖼" />
        <Btn on={run('removeFormat')} title="Clear formatting" label="✕ fmt" w={48} />
      </div>
      <div
        ref={ref}
        className="rte-area"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={emit}
        data-ph={placeholder}
        style={{ minHeight: 220, padding: '.9rem 1rem', fontSize: '.92rem', lineHeight: 1.7, color: 'var(--tdark)', outline: 'none' }}
      />
    </div>
  );
}
