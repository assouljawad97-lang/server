import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import HorizontalRule from '@tiptap/extension-horizontal-rule';

export function createEditor({ element, onUpdate }) {
  if (!element) throw new Error('Editor element is required.');
  const editor = new Editor({
    element,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true
      }),
      Image.configure({
        inline: false,
        allowBase64: false
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      HorizontalRule,
      Placeholder.configure({
        placeholder: 'Write your post content here...'
      })
    ],
    content: '',
    onUpdate: ({ editor: instance }) => {
      if (typeof onUpdate === 'function') onUpdate(instance);
    }
  });

  const chain = () => editor.chain().focus();

  return {
    editor,
    destroy() {
      editor.destroy();
    },
    getHTML() {
      return editor.getHTML();
    },
    getText() {
      return editor.getText();
    },
    onUpdate(handler) {
      if (typeof handler !== 'function') return;
      editor.on('update', ({ editor: instance }) => handler(instance));
    },
    setHTML(html) {
      editor.commands.setContent(String(html || ''), false);
    },
    clear() {
      editor.commands.clearContent(true);
    },
    toggleBold() { chain().toggleBold().run(); },
    toggleItalic() { chain().toggleItalic().run(); },
    toggleUnderline() { chain().toggleUnderline().run(); },
    setHeading(level) { chain().toggleHeading({ level }).run(); },
    toggleBulletList() { chain().toggleBulletList().run(); },
    toggleOrderedList() { chain().toggleOrderedList().run(); },
    toggleBlockquote() { chain().toggleBlockquote().run(); },
    toggleCodeBlock() { chain().toggleCodeBlock().run(); },
    setAlign(value) {
      if (!value || value === 'left') chain().unsetTextAlign().run();
      else chain().setTextAlign(value).run();
    },
    setLink(url) {
      const value = String(url || '').trim();
      if (!value) {
        chain().unsetLink().run();
        return;
      }
      chain().extendMarkRange('link').setLink({ href: value }).run();
    },
    insertImage(url) {
      const value = String(url || '').trim();
      if (!value) return;
      chain().setImage({ src: value, alt: 'blog image' }).run();
    },
    insertDivider() { chain().setHorizontalRule().run(); },
    clearFormatting() {
      chain().unsetAllMarks().clearNodes().run();
    },
    undo() { chain().undo().run(); },
    redo() { chain().redo().run(); }
  };
}
