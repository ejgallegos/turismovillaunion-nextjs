
import { escape } from 'html-escaper';
import { Text } from 'slate';

interface Node {
  text?: string;
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  type?: string;
  children?: Node[];
}

function serializeNode(node: Node): string {
  if (Text.isText(node)) {
    let string = escape(node.text);
    if (node.bold) {
      string = `<strong>${string}</strong>`;
    }
    if (node.italic) {
      string = `<em>${string}</em>`;
    }
    if (node.code) {
        string = `<code>${string}</code>`;
    }
    return string;
  }

  const children = node.children?.map(n => serializeNode(n)).join('') ?? '';

  switch (node.type) {
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

export function serializeSlate(nodes: string | Node[]): string {
  let parsedNodes: Node[];

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
    // If it's not valid JSON, treat it as plain text and wrap in a paragraph
    return `<p>${escape(String(nodes)).replace(/\n/g, '<br>')}</p>`;
  }

  return parsedNodes.map(serializeNode).join('');
}


function plainTextFromNode(node: Node): string {
    if (Text.isText(node)) {
      return node.text || '';
    }
  
    const children = node.children?.map(n => plainTextFromNode(n)).join('') ?? '';
  
    switch (node.type) {
      case 'heading-one':
      case 'heading-two':
      case 'paragraph':
      case 'bulleted-list':
      case 'list-item':
        return `${children}\n`;
      default:
        return children;
    }
}

export function plainTextFromSlate(nodes: string | Node[]): string {
    let parsedNodes: Node[];
  
    try {
      if (typeof nodes === 'string') {
        parsedNodes = JSON.parse(nodes);
      } else {
        parsedNodes = nodes;
      }
      if (!Array.isArray(parsedNodes)) {
        return '';
      }
    } catch (e) {
      // If it's not valid JSON, treat it as plain text.
      return String(nodes);
    }
  
    return parsedNodes.map(plainTextFromNode).join('').trim();
}
