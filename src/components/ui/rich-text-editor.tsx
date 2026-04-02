
'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { createEditor, Descendant, Transforms, Editor, Range, Element as SlateElement, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor, useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { Bold, Italic, Code, List, Heading1, Heading2, Link as LinkIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from './button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './dialog';
import { Input } from './input';

interface RichTextEditorProps {
  initialValue?: Descendant[];
  onChange: (value: Descendant[]) => void;
}

const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
] as unknown as Descendant[];

interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: string;
}

interface CustomElement {
  type?: string;
  url?: string;
  children?: (CustomText | CustomElement)[];
}

type CustomDescendant = CustomElement | CustomText;

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const isLinkActive = (editor: Editor) => {
  const [link] = Editor.nodes(editor, {
    match: (n) => (n as CustomElement).type === 'link',
  });
  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: (n) => (n as CustomElement).type === 'link',
    split: true,
  });
};

const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    unwrapLink(editor);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const link: any = { type: 'link', url, children: [{ text: '' }] };
    Transforms.wrapNodes(editor, link);
    Transforms.collapse(editor, { edge: 'end' });
  }
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => LIST_TYPES.includes((n as { type?: string }).type as string),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  } as Partial<Descendant>);

  if (!isActive && isList) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const block: any = { type: format, children: [] };
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
    match: (n) => (n as { type?: string }).type === format,
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
    case 'link':
      return (
        <a {...attributes} href={element.url} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      );
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
  const editor = useMemo(() => withHistory(withReact(createEditor() as unknown as ReactEditor)), []);
  const [value, setValue] = useState<Descendant[]>(passedInitialValue || initialValue);
  
  // Link state
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const handleChange = (newValue: Descendant[]) => {
    setValue(newValue);
    onChange(newValue);
  };

  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      insertLink(editor as Editor, linkUrl.trim());
      setLinkUrl('');
      setLinkDialogOpen(false);
    }
  };

  const handleRemoveLink = () => {
    if (isLinkActive(editor as Editor)) {
      unwrapLink(editor as Editor);
    }
    setLinkDialogOpen(false);
    setLinkUrl('');
  };

  return (
    <Slate editor={editor as unknown as ReactEditor} initialValue={value} onChange={handleChange}>
      <div className="rounded-md border border-input">
        <div className="flex border-b border-input p-1 flex-wrap gap-1">
          <MarkButton format="bold" icon={Bold} />
          <MarkButton format="italic" icon={Italic} />
          <MarkButton format="code" icon={Code} />
          <BlockButton format="heading-one" icon={Heading1} />
          <BlockButton format="heading-two" icon={Heading2} />
          <BlockButton format="bulleted-list" icon={List} />
          <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onMouseDown={(e) => e.preventDefault()}
                className={cn(isLinkActive(editor as Editor) ? 'bg-accent text-accent-foreground' : '')}
                type="button"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Insertar Enlace</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  placeholder="https://ejemplo.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleInsertLink();
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={handleRemoveLink}>
                  Quitar enlace
                </Button>
                <Button onClick={handleInsertLink}>
                  Insertar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
