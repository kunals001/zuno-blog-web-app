import { $getRoot, $isElementNode, $isTextNode, LexicalNode, $isDecoratorNode } from "lexical";
import { $isHeadingNode } from "@lexical/rich-text";
import { $isListNode, $isListItemNode } from "@lexical/list";
import { $isLinkNode } from "@lexical/link";
import { $isCodeNode } from "@lexical/code";
import { $isImageNode } from "@/nodes/ImageNode";
import { $isVideoNode } from "@/nodes/VideoNode";
import { imageStorage } from "@/utils/imageUtils";

export function $generateHTMLFromNodes(): string {
  const root = $getRoot();
  return nodesToHTML(root.getChildren());
}

function nodesToHTML(nodes: LexicalNode[]): string {
  let html = "";

  for (const node of nodes) {
    if ($isTextNode(node)) {
      let text = node.getTextContent();
      
      // Escape HTML characters for safety
      text = text.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;');

      // Apply text formatting
      if (node.hasFormat("bold")) {
        text = `<strong>${text}</strong>`;
      }
      if (node.hasFormat("italic")) {
        text = `<em>${text}</em>`;
      }
      if (node.hasFormat("underline")) {
        text = `<u>${text}</u>`;
      }
      if (node.hasFormat("strikethrough")) {
        text = `<s>${text}</s>`;
      }

      html += text;
    } 
    // Handle DecoratorNodes (Image & Video)
    else if ($isDecoratorNode(node)) {
      if ($isImageNode(node)) {
        const src = node.getSrc();
        const alt = node.getAltText();
        
        // Handle different image source types
        let imageSrc = src;
        
        // If it's a stored image reference
        if (src.startsWith('stored:')) {
          const imageId = src.replace('stored:', '');
          imageSrc = `[Image: ${imageId}]`; // Placeholder for export
        }
        // If it's a very long base64, truncate for display
        else if (src.startsWith('data:') && src.length > 100) {
          const mimeType = src.match(/data:([^;]+);/)?.[1] || 'image';
          imageSrc = `[${mimeType.toUpperCase()} - ${Math.round(src.length/1024)}KB]`;
        }
        
        const escapedSrc = imageSrc.replace(/"/g, '&quot;');
        const escapedAlt = alt.replace(/"/g, '&quot;');
        
        // For HTML export, use actual src if needed, or placeholder
        const htmlSrc = src.startsWith('data:') ? src : escapedSrc;
        
        html += `<div style="margin:16px 0;text-align:center;">
          <img src="${htmlSrc}" alt="${escapedAlt}" style="max-width:100%;height:auto;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);" loading="lazy" />
        </div>`;
      } 
      else if ($isVideoNode(node)) {
        const url = node.getVideoUrl();
        const escapedUrl = url.replace(/"/g, '&quot;');
        html += `<div style="margin:16px 0;text-align:center;">
          <iframe 
            src="${escapedUrl}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen 
            style="width:100%;max-width:800px;height:450px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.1);"
            title="Video Player">
          </iframe>
        </div>`;
      }
    }
    // Handle ElementNodes 
    else if ($isElementNode(node)) {
      const children = nodesToHTML(node.getChildren());

      if ($isHeadingNode(node)) {
        const tag = node.getTag();
        html += `<${tag}>${children}</${tag}>`;
      } else if ($isListNode(node)) {
        const tag = node.getListType() === "bullet" ? "ul" : "ol";
        html += `<${tag}>${children}</${tag}>`;
      } else if ($isListItemNode(node)) {
        html += `<li>${children}</li>`;
      } else if ($isLinkNode(node)) {
        const url = node.getURL();
        const escapedUrl = url.replace(/"/g, '&quot;');
        html += `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${children}</a>`;
      } else if ($isCodeNode(node)) {
        html += `<pre style="background-color:#f4f4f4;padding:16px;border-radius:8px;overflow-x:auto;margin:16px 0;"><code>${children}</code></pre>`;
      } else {
        const nodeName = node.getType();
        if (nodeName === "paragraph") {
          if (children.trim() === "") {
            html += `<p><br></p>`;
          } else {
            html += `<p>${children}</p>`;
          }
        } else {
          html += children;
        }
      }
    }
  }

  return html;
}

// Export function with image optimization
export async function $generateOptimizedHTML(): Promise<string> {
  const root = $getRoot();
  const children = root.getChildren();
  
  // Process images for export
  const processedHTML = await processImagesForExport(children);
  return processedHTML;
}

async function processImagesForExport(nodes: LexicalNode[]): Promise<string> {
  let html = "";
  
  for (const node of nodes) {
    if ($isImageNode(node)) {
      const src = node.getSrc();
      
      // If stored image, retrieve actual data
      if (src.startsWith('stored:')) {
        const imageId = src.replace('stored:', '');
        const actualSrc = await imageStorage.getImage(imageId);
        if (actualSrc) {
          html += `<img src="${actualSrc}" alt="${node.getAltText()}" style="max-width:100%;height:auto;" />`;
        }
      } else {
        html += `<img src="${src}" alt="${node.getAltText()}" style="max-width:100%;height:auto;" />`;
      }
    }
    // Handle other nodes...
  }
  
  return html;
}