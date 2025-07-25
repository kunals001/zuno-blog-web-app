// utils/htmlSerializer.ts
import {
  $getRoot,
  $isElementNode,
  $isTextNode,
  LexicalNode,
} from 'lexical';
import { $isHeadingNode } from '@lexical/rich-text';
import { $isListNode, $isListItemNode } from '@lexical/list';
import { $isLinkNode } from '@lexical/link';
import { $isCodeNode } from '@lexical/code';
import { $isImageNode } from '@/nodes/ImageNode';
import { $isVideoNode } from '@/nodes/VideoNode';

export function $generateHTMLFromNodes(): string {
  const root = $getRoot();
  return nodesToHTML(root.getChildren());
}

function nodesToHTML(nodes: LexicalNode[]): string {
  let html = '';
  
  for (const node of nodes) {
    if ($isTextNode(node)) {
      let text = node.getTextContent();
      
      // Apply text formatting
      if (node.hasFormat('bold')) {
        text = `<strong>${text}</strong>`;
      }
      if (node.hasFormat('italic')) {
        text = `<em>${text}</em>`;
      }
      if (node.hasFormat('underline')) {
        text = `<u>${text}</u>`;
      }
      
      html += text;
      
    } else if ($isElementNode(node)) {
      const children = nodesToHTML(node.getChildren());
      
      if ($isHeadingNode(node)) {
        const tag = node.getTag();
        html += `<${tag}>${children}</${tag}>`;
        
      } else if ($isListNode(node)) {
        const tag = node.getListType() === 'bullet' ? 'ul' : 'ol';
        html += `<${tag}>${children}</${tag}>`;
        
      } else if ($isListItemNode(node)) {
        html += `<li>${children}</li>`;
        
      } else if ($isLinkNode(node)) {
        const url = node.getURL();
        html += `<a href="${url}" target="_blank" rel="noopener noreferrer">${children}</a>`;
        
      } else if ($isCodeNode(node)) {
        html += `<pre><code>${children}</code></pre>`;
        
      } else if ($isImageNode(node)) {
        const src = node.getSrc();          // ✅ safe
        const altText = node.getAltText();
        html += `<img src="${src}" alt="${altText}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0;" />`;

      } else if ($isVideoNode(node)) {
        const videoUrl = node.getVideoUrl(); // ✅ safe
        html += `<iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width: 100%; height: 400px; border-radius: 8px; margin: 16px 0;"></iframe>`;
        
      } else {
        // Default paragraph ya div
        const nodeName = node.getType();
        if (nodeName === 'paragraph') {
          html += `<p>${children}</p>`;
        } else {
          html += children;
        }
      }
    }
  }
  
  return html;
}