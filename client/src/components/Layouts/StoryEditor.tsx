'use client';

import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ListNode, ListItemNode } from "@lexical/list";
import { ImageNode } from "@/nodes/ImageNode";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LinkNode } from "@lexical/link";
import { CodeNode } from "@lexical/code";
import { VideoNode } from "@/nodes/VideoNode";


import { HeadingNode } from '@lexical/rich-text';
import { $getRoot } from 'lexical';
import dynamic from 'next/dynamic';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';

const Toolbar = dynamic(() => import('./Toolbar'), {
  ssr: false,
});

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const StoryEditor: React.FC<Props> = ({setContent }) => {
  const initialConfig = {
    namespace: 'StoryEditor',
    theme: {
      paragraph: 'text-base leading-relaxed',
    },
    onError: (error: unknown) => {
      console.log('Lexical Error:', error);
    },

    nodes: [
    ListNode,
    ListItemNode,
    HeadingNode,
    ImageNode,
    LinkNode,
    CodeNode,
    VideoNode
  ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full min-h-[200px] border-2 border-zinc-400 dark:border-zinc-600 rounded-xl bg-zinc-200 px-2 dark:bg-zinc-800 transition-colors duration-300 mt-[2vh] py-2">
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[20vh] w-full outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 head list-disc " />
          }
          placeholder={
            <div className="absolute md:top-[3.5vw] top-[6.5vh] left-3 text-zinc-400 dark:text-zinc-500 pointer-events-none select-none text-[1.6vh] md:text-[.9vw]">
              Start writing your story...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <OnChangePlugin
          onChange={(editorState) => {
            editorState.read(() => {
              const text = $getRoot().getTextContent();
              setContent(text);
            });
          }}
        />
      </div>
      <ListPlugin />
      <LinkPlugin />
    </LexicalComposer>
  );
};

export default StoryEditor;
