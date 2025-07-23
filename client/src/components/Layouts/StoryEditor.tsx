'use client';

import React from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getRoot } from 'lexical';

interface Props {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
}

const StoryEditor: React.FC<Props> = ({ content, setContent }) => {
  const initialConfig = {
    namespace: 'StoryEditor',
    theme: {
      paragraph: 'text-base leading-relaxed',
    },
    onError: (error: any) => {
      console.error('Lexical Error:', error);
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative w-full min-h-[200px] border-2 border-zinc-400 dark:border-zinc-600 rounded-xl p-4 bg-zinc-200 dark:bg-zinc-800 transition-colors duration-300 mt-[2vh] ">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[160px] w-full outline-none text-zinc-800 dark:text-zinc-100 placeholder-zinc-400" />
          }
          placeholder={
            <div className="absolute top-4 left-4 text-zinc-400 pointer-events-none select-none text-[1.6vh] md:text-[.9vw]">
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
    </LexicalComposer>
  );
};

export default StoryEditor;
