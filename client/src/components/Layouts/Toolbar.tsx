"use client";
import React, { useEffect, useState } from "react";
import {
  IconBold,
  IconItalic,
  IconList,
} from "@tabler/icons-react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $getSelection,
  $isRangeSelection,
  TextFormatType,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { $getNodeByKey } from "lexical";

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isList, setIsList] = useState(false);

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
    if (isList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const baseClass =
    "p-2 rounded-md transition-colors duration-200 hover:bg-zinc-300 dark:hover:bg-zinc-700";
  const selectedClass = "bg-zinc-300 dark:bg-zinc-600";

  return (
    <div className="sticky md:top-[6vw] top-[9vh] left-0 w-full md:px-[1vw] md:py-[.5vw] px-[1vh] py-[.4vh] bg-transparent z-20 rounded-xl backdrop-blur-md border border-zinc-300 dark:border-zinc-700 flex gap-2">
      <button
        type="button"
        onClick={() => handleFormat("bold")}
        title="Bold"
        className={`${baseClass} ${isBold ? selectedClass : ""}`}
      >
        <IconBold className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
      </button>
      <button
        type="button"
        onClick={() => handleFormat("italic")}
        title="Italic"
        className={`${baseClass} ${isItalic ? selectedClass : ""}`}
      >
        <IconItalic className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
      </button>
      <button
        type="button"
        onClick={handleList}
        title="Bullet List"
        className={`${baseClass} ${isList ? selectedClass : ""}`}
      >
        <IconList className="w-5 h-5 text-zinc-800 dark:text-zinc-200" />
      </button>
    </div>
  );
};

export default Toolbar;
