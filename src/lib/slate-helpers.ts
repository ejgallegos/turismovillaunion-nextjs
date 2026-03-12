import { Text } from 'slate';

interface Node {
  text?: string;
  type?: string;
  children?: Node[];
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
      return String(nodes || '');
    }
  
    return parsedNodes.map(plainTextFromNode).join('').trim();
}
