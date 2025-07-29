"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Link,
  List,
  Youtube,
  Code,
  ImagePlus,
} from "lucide-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  COMMAND_PRIORITY_LOW,
  $createParagraphNode,
} from "lexical";

import {
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";

import { $createCodeNode } from "@lexical/code";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $createImageNode } from "@/nodes/ImageNode";
import { $createVideoNode } from "@/nodes/VideoNode";

const headingTypes: HeadingTagType[] = ["h2", "h3", "h4", "h5", "h6"];

// Image compression utility function
const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [isImageUploading, setIsImageUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const insertImage = async (file: File) => {
    try {
      setIsImageUploading(true);
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      // Compress image
      const compressedBase64 = await compressImage(file, 800, 0.7);
      
      editor.update(() => {
        const imageNode = $createImageNode({ 
          src: compressedBase64, 
          altText: file.name || "Uploaded Image" 
        });
        $getSelection()?.insertNodes([imageNode]);
      });

      console.log(`Image compressed: ${file.size} bytes → ${Math.round(compressedBase64.length * 0.75)} bytes`);
      
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error uploading image. Please try again.');
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      insertImage(file);
    }
    
    // Reset input so same file can be selected again
    e.target.value = '';
  };

  useEffect(() => {
    const updateToolbar = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));

          const anchorNode = selection.anchor.getNode();
          const parent = anchorNode.getParent();
          const node = parent?.getType?.() === "list" ? parent : anchorNode;
          setIsList($isListNode(node));
        }
      });
    };

    const remove1 = editor.registerUpdateListener(() => updateToolbar());
    const remove2 = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );

    return () => {
      remove1();
      remove2();
    };
  }, [editor]);

  const handleFormat = (format: TextFormatType) =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);

  const handleList = () =>
    editor.dispatchCommand(
      isList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
      undefined
    );

  const handleHeading = (tag: HeadingTagType) =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const headingNode = $createHeadingNode(tag);
        selection.insertParagraph();
        selection.insertNodes([headingNode]);
      }
    });

  const handleCodeBlock = () =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const codeNode = $createCodeNode();
        selection.insertParagraph();
        selection.insertNodes([codeNode]);
      }
    });

  const handleParagraph = () =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const paragraphNode = $createParagraphNode();
        selection.insertParagraph();
        selection.insertNodes([paragraphNode]);
      }
    });

  function convertYouTubeToEmbed(url: string): string | null {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const p of patterns) {
      const m = url.match(p);
      if (m && m[1]) {
        return `https://www.youtube.com/embed/${m[1]}?enablejsapi=1&origin=${window.location.origin}`;
      }
    }
    return null;
  }

  const handleVideoInsert = () => {
    const embedURL = convertYouTubeToEmbed(videoUrl);
    if (!embedURL) {
      alert(
        "Please enter a valid YouTube URL\nSupported formats:\n- https://www.youtube.com/watch?v=VIDEO_ID\n- https://youtu.be/VIDEO_ID\n- https://www.youtube.com/shorts/VIDEO_ID"
      );
      return;
    }

    editor.update(() => {
      const videoNode = $createVideoNode(embedURL);
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.insertNodes([videoNode]);
      }
    });

    setShowVideoInput(false);
    setVideoUrl("");
  };

  const baseClass =
    "p-2 rounded-md transition-colors duration-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed";
  const selectedClass = "bg-zinc-300 dark:bg-zinc-600";

  return (
    <>
      <div className="sticky md:top-[6vw] top-[9vh] left-0 w-full md:px-[1vw] md:py-[.5vw] px-[1vh] py-[.4vh] bg-transparent z-20 rounded-xl backdrop-blur-md border border-zinc-300 dark:border-zinc-700 flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          type="button"
          onClick={() => handleFormat("bold")}
          title="Bold"
          className={`${baseClass} ${isBold ? selectedClass : ""}`}
        >
          <Bold className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => handleFormat("italic")}
          title="Italic"
          className={`${baseClass} ${isItalic ? selectedClass : ""}`}
        >
          <Italic className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleList}
          title="Bullet List"
          className={`${baseClass} ${isList ? selectedClass : ""}`}
        >
          <List className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowLinkInput(true)}
          title="Insert Link"
          className={baseClass}
        >
          <Link className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleCodeBlock}
          title="Code Block"
          className={baseClass}
        >
          <Code className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleImageClick}
          title={isImageUploading ? "Uploading..." : "Insert Image"}
          disabled={isImageUploading}
          className={baseClass}
        >
          {isImageUploading ? (
            <div className="w-5 h-5 border-2 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <ImagePlus className="w-5 h-5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setShowVideoInput(true)}
          title="Insert YouTube Video"
          className={baseClass}
        >
          <Youtube className="w-5 h-5" />
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />

        {headingTypes.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleHeading(tag)}
            title={`Heading ${tag.toUpperCase()}`}
            className={baseClass}
          >
            {tag.toUpperCase()}
          </button>
        ))}

        <button
          type="button"
          onClick={handleParagraph}
          title="Paragraph"
          className={baseClass}
        >
          P
        </button>
      </div>

      {showLinkInput && (
        <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Enter URL
            </h2>
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-prime"
              placeholder="https://example.com"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
                className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (linkUrl.trim()) {
                    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                  }
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 rounded-lg bg-prime text-zinc-200 hover:bg-prime/80 transition disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {showVideoInput && (
        <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white dark:bg-zinc-800 p-4 rounded-xl shadow-2xl w-full max-w-md flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">
              Enter YouTube URL
            </h2>
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-prime"
              placeholder="https://www.youtube.com/watch?v=abcd1234"
            />
            <div className="text-xs text-zinc-500">
              Supported: YouTube watch, youtu.be, YouTube shorts
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowVideoInput(false);
                  setVideoUrl("");
                }}
                className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVideoInsert}
                disabled={!videoUrl.trim()}
                className="px-4 py-2 rounded-lg bg-prime text-zinc-200 hover:bg-prime/80 transition disabled:opacity-50"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Toolbar;