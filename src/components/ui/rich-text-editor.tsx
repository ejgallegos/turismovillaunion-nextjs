'use client';

import dynamic from 'next/dynamic';
import React from 'react';

// The dynamic import with ssr: false is the key. It tells Next.js
// to only load and render this component on the client-side.
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  // A loading placeholder is shown while the component is being loaded on the client.
  loading: () => (
    <div className="w-full rounded-md border border-input bg-transparent">
      <div className="min-h-[150px] w-full animate-pulse rounded-md bg-muted p-3" />
    </div>
  ),
});

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  // By rendering the dynamically imported ReactQuill, we ensure that
  // all of its logic, including the problematic findDOMNode call,
  // only executes in a browser environment.
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
