'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import ReactQuill to avoid SSR issues, as it relies on browser APIs.
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    // Configure the toolbar modules for the editor.
    const modules = useMemo(() => ({
        toolbar: [
          [{ 'header': [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{'list': 'ordered'}, {'list': 'bullet'}],
          ['link'],
          ['clean']
        ],
      }), []);

  return (
    // The wrapper div helps in styling the editor to match the application's theme.
    <div className="bg-background rounded-md border border-input focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
