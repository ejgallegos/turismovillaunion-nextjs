
'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant, Transforms, Editor, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { Bold, Italic, Code, List, Heading1, Heading2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';

interface RichTextEditorProps {
  initialValue?: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format,
  });

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format as keyof typeof marks] === true : false;
};

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const MarkButton = ({ format, icon: Icon }: { format: string; icon: React.ElementType }) => {
    const editor = useSlate();
    return (
      <Button
        variant="ghost"
        size="icon"
        onMouseDown={event => {
          event.preventDefault();
          toggleMark(editor, format);
        }}
        className={cn(isMarkActive(editor, format) ? 'bg-accent text-accent-foreground' : '')}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  };
  
  const BlockButton = ({ format, icon: Icon }: { format: string; icon: React.ElementType }) => {
    const editor = useSlate();
    return (
      <Button
        variant="ghost"
        size="icon"
        onMouseDown={event => {
          event.preventDefault();
          toggleBlock(editor, format);
        }}
        className={cn(isBlockActive(editor, format) ? 'bg-accent text-accent-foreground' : '')}
      >
        <Icon className="h-4 w-4" />
      </Button>
    );
  };

export function RichTextEditor({ initialValue: passedInitialValue, onChange }: RichTextEditorProps) {
  const editor = useMemo(() => withHistory(withReact(createEditor() as ReactEditor)), []);
  const [value, setValue] = useState<Descendant[]>(passedInitialValue || initialValue);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    onChange(newValue);
  };

  return (
    <Slate editor={editor} initialValue={value} onChange={handleChange}>
      <div className="rounded-md border border-input">
        <div className="flex border-b border-input p-1">
          <MarkButton format="bold" icon={Bold} />
          <MarkButton format="italic" icon={Italic} />
          <MarkButton format="code" icon={Code} />
          <BlockButton format="heading-one" icon={Heading1} />
          <BlockButton format="heading-two" icon={Heading2} />
          <BlockButton format="bulleted-list" icon={List} />
        </div>
        <div className="p-2 min-h-[150px]">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Escribe aquí..."
            className="prose dark:prose-invert max-w-none focus:outline-none"
          />
        </div>
      </div>
    </Slate>
  );
}
