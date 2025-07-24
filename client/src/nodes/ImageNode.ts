// src/nodes/ImageNode.ts
import { DecoratorNode } from "lexical";
import { JSX } from "react";

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;

  static getType() {
    return "image";
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src: string, altText: string, key?: string) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  createDOM(): HTMLElement {
    const img = document.createElement("img");
    img.src = this.__src;
    img.alt = this.__altText;
    img.className = "my-4 rounded-lg max-w-full";
    return img;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: any): ImageNode {
    const { src, altText } = serializedNode;
    return new ImageNode(src, altText);
  }

  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }
}

export function $createImageNode({ src, altText }: { src: string; altText: string }) {
  return new ImageNode(src, altText);
}

export function $isImageNode(node: any): node is ImageNode {
  return node instanceof ImageNode;
}
