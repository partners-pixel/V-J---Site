import { useEffect, useRef } from 'react';

// Lightweight WYSIWYG editor (no external deps). Emits HTML.
const cmd = (name, arg = null) => document.execCommand(name, false, arg);

const FORMATS = [
  { label: 'Paragraph', tag: 'P' },
  { label: 'Heading 1', tag: 'H1' },
  { label: 'Heading 2', tag: 'H2' },
  { label: 'Heading 3', tag: 'H3' },
  { label: 'Heading 4', tag: 'H4' },
  { label: 'Heading 5', tag: 'H5' },
  { label: 'Heading 6', tag: 'H6' },
  { label: 'Preformatted', tag: 'PRE' },
];

const SIZES = ['13px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '40px'];

const toolBtn = {
  background: 'var(--white)',
  border: '1px solid rgba(0,0,0,.14)',
  borderRadius: 5,
  padding: '.32rem .55rem',
  fontSize: '.82rem',
  lineHeight: 1,
  cursor: 'pointer',
  color: 'var(--tdark)',
  fontFamily: 'Inter,sans-serif',
  minWidth: 30,
};
const selStyle = { ...toolBtn, padding: '.32rem .4rem', minWidth: 0 };

export default function RichTextEditor({ value, onChange, placeholder = 'Write the post…' }) {
  const ref = useRef(null);
  const savedRange = useRef(null);

  // Sync external value (e.g. loading a post to edit) without clobbering typing.
  useEffect(() => {
    const el = ref.current;
    if (el && value !== el.innerHTML) el.innerHTML = value || '';
  }, [value]);

  // Remember the last selection made inside the editor so toolbar <select>/color
  // controls (which steal focus) can restore it before running a command.
  useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection();
      if (sel && sel.rangeCount && ref.current && ref.current.contains(sel.anchorNode)) {
        savedRange.current = sel.getRangeAt(0).cloneRange();
      }
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  const emit = () => onChange(ref.current?.innerHTML || '');

  // Run a command while keeping focus/selection inside the editor.
  const apply = (fn) => {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (savedRange.current && sel) {
      sel.removeAllRanges();
      sel.addRange(savedRange.current);
    }
    fn();
    emit();
  };

  // Buttons: onMouseDown + preventDefault preserves the selection on click.
  const run = (name, arg) => (e) => { e.preventDefault(); cmd(name, arg); emit(); };

  const setFormat = (tag) => apply(() => cmd('formatBlock', tag));

  const setSize = (px) => apply(() => {
    cmd('styleWithCSS', false); // ensure fontSize produces <font size> we can rewrite
    cmd('fontSize', '7');
    ref.current.querySelectorAll('font[size="7"]').forEach((el) => {
      el.removeAttribute('size');
      el.style.fontSize = px;
    });
  });

  const setColor = (color) => apply(() => {
    cmd('styleWithCSS', true);
    cmd('foreColor', color);
  });

  const addLink = (e) => {
    e.preventDefault();
    const url = window.prompt('Link URL (https://…)');
    if (url) { cmd('createLink', url.trim()); emit(); }
  };
  const addImage = (e) => {
    e.preventDefault();
    const url = window.prompt('Image URL (https://…)');
    if (url) { cmd('insertImage', url.trim()); emit(); }
  };

  const Btn = ({ on, title, label, w }) => (
    <button type="button" title={title} onMouseDown={on} style={{ ...toolBtn, ...(w ? { minWidth: w } : null) }}>{label}</button>
  );

  return (
    <div style={{ border: '1px solid rgba(0,0,0,.18)', borderRadius: 8, overflow: 'hidden', background: 'var(--white)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', alignItems: 'center', padding: '.5rem', borderBottom: '1px solid rgba(0,0,0,.1)', background: 'var(--off,#f6f7f9)' }}>
        <select title="Format" value="" onChange={(e) => { if (e.target.value) { setFormat(e.target.value); e.target.value = ''; } }} style={{ ...selStyle, minWidth: 96 }}>
          <option value="">Format ▾</option>
          {FORMATS.map((f) => <option key={f.tag} value={f.tag}>{f.label}</option>)}
        </select>

        <select title="Font size" value="" onChange={(e) => { if (e.target.value) { setSize(e.target.value); e.target.value = ''; } }} style={{ ...selStyle, minWidth: 70 }}>
          <option value="">Size ▾</option>
          {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <label title="Text colour" style={{ display: 'inline-flex', alignItems: 'center', gap: '.25rem', ...toolBtn, padding: '.18rem .35rem', cursor: 'pointer' }}>
          <span style={{ fontWeight: 700 }}>A</span>
          <input type="color" defaultValue="#1C2437" onChange={(e) => setColor(e.target.value)} style={{ width: 22, height: 18, border: 'none', background: 'none', padding: 0, cursor: 'pointer' }} />
        </label>

        <Btn on={run('bold')} title="Bold" label={<b>B</b>} />
        <Btn on={run('italic')} title="Italic" label={<i>I</i>} />
        <Btn on={run('underline')} title="Underline" label={<u>U</u>} />
        <Btn on={run('strikeThrough')} title="Strikethrough" label={<s>S</s>} />

        <Btn on={run('justifyLeft')} title="Align left" label="⯇" />
        <Btn on={run('justifyCenter')} title="Align centre" label="≡" />
        <Btn on={run('justifyRight')} title="Align right" label="⯈" />

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
        style={{ minHeight: 240, padding: '.9rem 1rem', fontSize: '.92rem', lineHeight: 1.7, color: 'var(--tdark)', outline: 'none' }}
      />
    </div>
  );
}
