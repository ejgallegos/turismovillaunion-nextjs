'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';

// Dynamically import ReactQuill to prevent SSR and to handle
// incompatibilities with React 18's Strict Mode (which causes the
// findDOMNode error). `ssr: false` is the key part of the solution.
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  // A loading placeholder prevents layout shifts and gives user feedback.
  loading: () => <div className="w-full h-[220px] animate-pulse rounded-md bg-muted" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
  }), []);

  return (
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
  );
}
