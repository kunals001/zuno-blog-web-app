"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconBold, IconItalic, IconList, IconPhoto } from "@tabler/icons-react";
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
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import { $createImageNode } from "@/nodes/ImageNode";

const headingTypes: HeadingTagType[] = ["h2", "h3", "h4", "h5", "h6"];

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

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

  const handleFormat = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleList = () => {
    editor.dispatchCommand(
      isList ? REMOVE_LIST_COMMAND : INSERT_UNORDERED_LIST_COMMAND,
      undefined
    );
  };

  const handleHeading = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const headingNode = $createHeadingNode(tag);
        selection.insertParagraph(); // separate
        selection.insertNodes([headingNode]);
      }
    });
  };

  const handleParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const paragraphNode = $createParagraphNode();
        selection.insertParagraph();
        selection.insertNodes([paragraphNode]);
      }
    });
  };

  const baseClass =
    "p-2 rounded-md transition-colors duration-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200";
  const selectedClass = "bg-zinc-300 dark:bg-zinc-600";

  return (
    <div className="sticky md:top-[6vw] top-[9vh] left-0 w-full md:px-[1vw] md:py-[.5vw] px-[1vh] py-[.4vh] bg-transparent z-20 rounded-xl backdrop-blur-md border border-zinc-300 dark:border-zinc-700 flex gap-2 overflow-x-scroll scrollbar-hide">
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
        onClick={handleImageClick}
        title="Insert Image"
        className={baseClass}
      >
        <IconPhoto className="w-5 h-5" />
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
  );
};

export default Toolbar;
