// src/nodes/ImageNode.ts
import { DecoratorNode } from "lexical";
import Image from "next/image";
import * as React from "react";

export interface SerializedImageNode {
  type: "image";
  version: 1;
  src: string;
  altText: string;
}

export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__altText, node.__key);
  }

  constructor(src: string, altText: string, key?: string) {
    super(key);
    this.__src = src;
    this.__altText = altText;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    return (
      <Image
        width={1200}
        height={700}
        src={this.__src}
        alt={this.__altText}
        className="my-4 rounded-lg max-w-full object-contain"
        loading="lazy"
      />
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return new ImageNode(serializedNode.src, serializedNode.altText);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      altText: this.__altText,
    };
  }
}

export function $createImageNode(props: { src: string; altText: string }): ImageNode {
  return new ImageNode(props.src, props.altText);
}

export function $isImageNode(node: unknown): node is ImageNode {
  return node instanceof ImageNode;
}
