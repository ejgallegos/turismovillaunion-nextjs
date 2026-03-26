'use client';

import { escape } from 'html-escaper';
import { Text } from 'slate';

interface CustomText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
}

interface CustomElement {
  type?: string;
  children?: CustomText[];
}

type CustomNode = CustomText | CustomElement;

function serializeNode(node: CustomNode): string {
  if (Text.isText(node)) {
    const textNode = node as CustomText;
    let str = escape(textNode.text || '');
    if (textNode.bold) {
      str = `<strong>${str}</strong>`;
    }
    if (textNode.italic) {
      str = `<em>${str}</em>`;
    }
    if (textNode.code) {
        str = `<code>${str}</code>`;
    }
    return str;
  }

  const element = node as CustomElement;
  const children = element.children?.map(n => serializeNode(n)).join('') ?? '';

  switch (element.type) {
    case 'heading-one':
      return `<h1>${children}</h1>`;
    case 'heading-two':
      return `<h2>${children}</h2>`;
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'bulleted-list':
        return `<ul>${children}</ul>`;
    case 'list-item':
        return `<li>${children}</li>`;
    default:
      return children;
  }
}

export function serializeSlate(nodes: string | unknown[]): string {
  let parsedNodes: unknown[];

  try {
    if (typeof nodes === 'string') {
      parsedNodes = JSON.parse(nodes);
    } else {
      parsedNodes = nodes;
    }
    if (!Array.isArray(parsedNodes)) {
      return '<p></p>';
    }
  } catch (e) {
    return `<p>${escape(String(nodes)).replace(/\n/g, '<br>')}</p>`;
  }

  return parsedNodes.map((n) => serializeNode(n as CustomNode)).join('');
}
