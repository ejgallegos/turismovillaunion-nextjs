'use client';

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamically import ReactQuill to ensure it only runs on the client.
// This is the recommended workaround for the 'findDOMNode' issue with React 18.
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className="w-full rounded-md border border-input">
      <div className="h-[215px] w-full animate-pulse rounded-md bg-muted" />
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
