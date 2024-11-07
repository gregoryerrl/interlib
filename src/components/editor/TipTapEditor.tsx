import "./styles.css";
import { useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CodeBlock from "@tiptap/extension-code-block";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";

type TipTapEditorProps = {
  content: string;
  onUpdate: (content: string) => void;
  editable?: boolean;
};

const TipTapEditor = ({
  content,
  onUpdate,
  editable = true,
}: TipTapEditorProps) => {
  const [isCodeBlockOpen, setIsCodeBlockOpen] = useState(false);
  const [codeBlockLanguage, setCodeBlockLanguage] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
      }),
      CodeBlock,
      Color,
      TextStyle,
      ListItem,
    ],
    editable,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "min-h-[200px] border p-4 rounded-md",
      },
    },
    content,
  });

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  useEffect(() => {
    if (editor) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  const handleAddCodeBlock = () => {
    if (editor) {
      editor
        .chain()
        .focus()
        .setCodeBlock({ language: codeBlockLanguage })
        .run();
      setIsCodeBlockOpen(false);
      setCodeBlockLanguage("");
    }
  };

  return (
    <div>
      {editor && (
        <div
          className={`${
            !editable ? "hidden" : ""
          } flex justify-between items-center mb-2 control-group p-5 bg-zinc-300`}
        >
          <div className="button-group">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`${
                editor.isActive("bold") ? "is-active" : ""
              } font-bold`}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`${
                editor.isActive("italic") ? "is-active" : ""
              } italic`}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={`${
                editor.isActive("strike") ? "is-active" : ""
              } line-through`}
            >
              Strike
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              disabled={!editor.can().chain().focus().toggleCode().run()}
              className={editor.isActive("code") ? "is-active" : ""}
            >
              Code
            </button>
            <button
              onClick={() => editor.chain().focus().unsetAllMarks().run()}
            >
              Clear marks
            </button>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>
              Clear nodes
            </button>
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={editor.isActive("paragraph") ? "is-active" : ""}
            >
              Paragraph
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }
            >
              H1
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }
            >
              H2
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "is-active" : ""
              }
            >
              H3
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 4 }).run()
              }
              className={
                editor.isActive("heading", { level: 4 }) ? "is-active" : ""
              }
            >
              H4
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 5 }).run()
              }
              className={
                editor.isActive("heading", { level: 5 }) ? "is-active" : ""
              }
            >
              H5
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 6 }).run()
              }
              className={
                editor?.isActive("heading", { level: 6 }) ? "is-active" : ""
              }
            >
              H6
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={editor?.isActive("bulletList") ? "is-active" : ""}
            >
              Bullet list
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={editor?.isActive("orderedList") ? "is-active" : ""}
            >
              Ordered list
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
              className={editor?.isActive("codeBlock") ? "is-active" : ""}
            >
              Code block
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleBlockquote().run()}
              className={editor?.isActive("blockquote") ? "is-active" : ""}
            >
              Blockquote
            </button>
            <button
              onClick={() => editor?.chain().focus().setHorizontalRule().run()}
            >
              Horizontal rule
            </button>
            <button
              onClick={() => editor?.chain().focus().setHardBreak().run()}
            >
              Hard break
            </button>
            <button
              onClick={() => editor?.chain().focus().undo().run()}
              disabled={!editor?.can().chain().focus().undo().run()}
            >
              Undo
            </button>
            <button
              onClick={() => editor?.chain().focus().redo().run()}
              disabled={!editor?.can().chain().focus().redo().run()}
            >
              Redo
            </button>
            <button
              onClick={() => editor?.chain().focus().setColor("#000000").run()}
              className={
                editor?.isActive("textStyle", { color: "#000000" })
                  ? "is-active"
                  : ""
              }
            >
              Black
            </button>
            <button
              onClick={() => editor?.chain().focus().setColor("#006400").run()}
              className={
                editor?.isActive("textStyle", { color: "#006400" })
                  ? "is-active"
                  : ""
              }
            >
              Dark Green
            </button>
          </div>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
export default TipTapEditor;
