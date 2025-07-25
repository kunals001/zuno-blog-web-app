import { DecoratorNode } from "lexical";
import * as React from "react";

export interface SerializedVideoNode {
  type: "video";
  version: 1;
  videoUrl: string;
}

export class VideoNode extends DecoratorNode<React.ReactElement> {
  __videoUrl: string;

  static getType(): string {
    return "video";
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(node.__videoUrl, node.__key);
  }

  constructor(videoUrl: string, key?: string) {
    super(key);
    this.__videoUrl = videoUrl;
  }

  // ➕ ADD THIS LINE
  getVideoUrl(): string { return this.__videoUrl; }


  createDOM(): HTMLElement {
    return document.createElement("div");
  }

  updateDOM(): false {
    return false;
  }

  decorate(): React.ReactElement {
    return (
      <div className="my-4 rounded-lg overflow-hidden">
        <iframe
          src={this.__videoUrl}
          title="YouTube Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-[25vh] md:h-[25vw] rounded-lg"
          style={{
            border: 'none',
            minHeight: '315px'
          }}
        />
      </div>
    );
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    return new VideoNode(serializedNode.videoUrl);
  }

  exportJSON(): SerializedVideoNode {
    return {
      type: "video",
      version: 1,
      videoUrl: this.__videoUrl,
    };
  }
}

export function $createVideoNode(videoUrl: string): VideoNode {
  return new VideoNode(videoUrl);
}

export function $isVideoNode(node: unknown): node is VideoNode {
  return node instanceof VideoNode;
}