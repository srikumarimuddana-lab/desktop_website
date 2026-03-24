'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon,
  Undo, Redo, Quote
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCallback } from 'react'

const MenuButton = ({ onClick, isActive, children, title }) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    onClick={onClick}
    title={title}
    className={cn(
      "h-8 w-8 p-0 hover:bg-muted",
      isActive && "bg-primary/10 text-primary hover:bg-primary/20"
    )}
  >
    {children}
  </Button>
)

export default function RichTextEditor({ content, onChange, placeholder = "Start writing..." }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-primary underline cursor-pointer' },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) return

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return <div className="border rounded-lg p-4 min-h-[350px] bg-muted/30 animate-pulse" />
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50/50">
        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 className="w-4 h-4" /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold"><Bold className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic"><Italic className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline"><UnderlineIcon className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough"><Strikethrough className="w-4 h-4" /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left"><AlignLeft className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center"><AlignCenter className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right"><AlignRight className="w-4 h-4" /></MenuButton>
        </div>

        <div className="flex items-center gap-1 border-r pr-2 mr-1">
          <MenuButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List"><List className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List"><ListOrdered className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote"><Quote className="w-4 h-4" /></MenuButton>
        </div>

        <div className="flex items-center gap-1">
          <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Link"><LinkIcon className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().undo().run()} isActive={false} title="Undo"><Undo className="w-4 h-4" /></MenuButton>
          <MenuButton onClick={() => editor.chain().focus().redo().run()} isActive={false} title="Redo"><Redo className="w-4 h-4" /></MenuButton>
        </div>
      </div>

      <EditorContent editor={editor} />

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        /* ProseMirror Styles for Admin Editor */
        .ProseMirror { min-height: 200px; }
        .ProseMirror h1 { font-size: 2em; font-weight: bold; margin-top: 0.5em; margin-bottom: 0.5em; }
        .ProseMirror h2 { font-size: 1.5em; font-weight: bold; margin-top: 0.5em; margin-bottom: 0.5em; }
        .ProseMirror h3 { font-size: 1.17em; font-weight: bold; margin-top: 0.5em; margin-bottom: 0.5em; }
        .ProseMirror ul { list-style-type: disc; padding-left: 1.5em; }
        .ProseMirror ol { list-style-type: decimal; padding-left: 1.5em; }
        .ProseMirror blockquote { border-left: 3px solid #dfe2e5; padding-left: 1em; color: #6b7280; font-style: italic; }
        .ProseMirror a { color: #e11d48; text-decoration: underline; }
      `}</style>
    </div>
  )
}
