'use client';

import dynamic from 'next/dynamic';
import React, { useMemo } from 'react';

// Dynamically import ReactQuill to avoid SSR issues.
// We also use a state to ensure it only renders on the client after mounting,
// which is a common and effective workaround for libraries that have
// compatibility issues with React 18's Strict Mode and `findDOMNode`.
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  }), []);

  React.useEffect(() => {
    // This effect runs only on the client, after the component has mounted.
    setIsMounted(true);
  }, []);

  return (
    <div className="bg-background rounded-md border border-input focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {isMounted ? (
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
        />
      ) : (
        // Render a placeholder on the server and during the initial client render
        // to prevent hydration mismatch and maintain layout consistency.
        <div className="min-h-[150px] w-full rounded-b-md px-3 py-2 text-sm" />
      )}
    </div>
  );
}
