"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  IconBold,
  IconItalic,
  IconLink,
  IconList,
  IconPhoto,
  IconBrandYoutube,
  IconCode,
} from "@tabler/icons-react";
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

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showVideoInput, setShowVideoInput] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => fileInputRef.current?.click();

  const insertImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      editor.update(() => {
        const imageNode = $createImageNode({ src, altText: "Image" });
        $getSelection()?.insertNodes([imageNode]);
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) insertImage(file);
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

  const convertYouTubeToEmbed = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return `https://www.youtube.com/embed/${match[1]}?enablejsapi=1&origin=${window.location.origin}`;
      }
    }
    return null;
  };

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
    "p-2 rounded-md transition-colors duration-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200";
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
          <IconBold className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => handleFormat("italic")}
          title="Italic"
          className={`${baseClass} ${isItalic ? selectedClass : ""}`}
        >
          <IconItalic className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleList}
          title="Bullet List"
          className={`${baseClass} ${isList ? selectedClass : ""}`}
        >
          <IconList className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowLinkInput(true)}
          title="Insert Link"
          className={baseClass}
        >
          <IconLink className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleCodeBlock}
          title="Code Block"
          className={baseClass}
        >
          <IconCode className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleImageClick}
          title="Insert Image"
          className={baseClass}
        >
          <IconPhoto className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => setShowVideoInput(true)}
          title="Insert YouTube Video"
          className={baseClass}
        >
          <IconBrandYoutube className="w-5 h-5" />
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
                onClick={() => setShowLinkInput(false)}
                className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                  setShowLinkInput(false);
                  setLinkUrl("");
                }}
                className="px-4 py-2 rounded-lg bg-prime text-zinc-200 hover:bg-prime/80 transition"
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
                onClick={() => setShowVideoInput(false)}
                className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleVideoInsert}
                className="px-4 py-2 rounded-lg bg-prime text-zinc-200 hover:bg-prime/80 transition"
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