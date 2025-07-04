'use client';

import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Text, Descendant } from 'slate';

const renderNode = (node: Descendant, index: number): JSX.Element => {
  if (Text.isText(node)) {
    let children: React.ReactNode = node.text;
    if (node.bold) {
      children = <strong>{children}</strong>;
    }
    if (node.italic) {
      children = <em>{children}</em>;
    }
    if (node.code) {
      children = <code>{children}</code>;
    }
    return <React.Fragment key={index}>{children}</React.Fragment>;
  }

  const children = node.children.map((n, i) => renderNode(n, i));

  switch (node.type) {
    case 'heading-one':
      return <h1 key={index}>{children}</h1>;
    case 'heading-two':
      return <h2 key={index}>{children}</h2>;
    case 'list-item':
      return <li key={index}>{children}</li>;
    case 'bulleted-list':
      return <ul key={index}>{children}</ul>;
    case 'paragraph':
    default:
      return <p key={index}>{children}</p>;
  }
};


export function ContentRenderer({ content }: { content: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-5/6" />
        <Skeleton className="h-6 w-full" />
      </div>
    );
  }
  
  let parsedNodes: Descendant[];
  try {
    parsedNodes = JSON.parse(content);
    if (!Array.isArray(parsedNodes)) {
      throw new Error("Content is not a valid Slate.js array of nodes.");
    }
  } catch (e) {
    // Fallback for plain text or invalid JSON
    return (
      <div className="whitespace-pre-wrap">
        {content}
      </div>
    );
  }
  
  return <>{parsedNodes.map((node, i) => renderNode(node, i))}</>;
}
