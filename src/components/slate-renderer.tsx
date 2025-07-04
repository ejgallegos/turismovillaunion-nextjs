
'use server';

import React from 'react';
import { Text } from 'slate';

// Basic types for Slate nodes.
interface SlateTextNode {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

interface SlateElementNode {
  type: 'heading-one' | 'heading-two' | 'paragraph' | 'bulleted-list' | 'list-item';
  children: SlateNode[];
}

type SlateNode = SlateTextNode | SlateElementNode;

const renderNode = (node: SlateNode, index: number): JSX.Element => {
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
    // Using fragment here as key is applied by the parent map
    return <>{children}</>;
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

export function SlateRenderer({ content }: { content: string }) {
  let parsedNodes: SlateNode[];

  try {
    parsedNodes = JSON.parse(content);
    // Basic validation to ensure it's an array of nodes
    if (!Array.isArray(parsedNodes)) {
      throw new Error("Content is not a valid Slate.js array of nodes.");
    }
  } catch (e) {
    // If content is not valid Slate JSON, treat it as plain text.
    // This handles legacy content.
    return (
      <div className="whitespace-pre-wrap">
        {content}
      </div>
    );
  }

  return <>{parsedNodes.map((node, i) => renderNode(node, i))}</>;
}
