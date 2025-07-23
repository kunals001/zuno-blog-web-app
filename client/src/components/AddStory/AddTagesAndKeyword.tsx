import React, { useState } from 'react';

interface Props {
  items: string[];
  setItems: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder?: string;
}

const TagInput: React.FC<Props> = ({ items, setItems, placeholder }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    const newItem = input.trim();
    if (
      newItem &&
      !items.includes(newItem) &&
      items.length < 5
    ) {
      setItems([...items, newItem]);
    }
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Backspace' && input === '' && items.length > 0) {
      e.preventDefault();
      setItems(items.slice(0, -1));
    }
  };

  const removeItem = (itemToRemove: string) => {
    setItems(items.filter(item => item !== itemToRemove));
  };

  return (
    <div className="w-full mt-[2vh]">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-2 rounded-xl border-zinc-400 dark:border-zinc-600 bg-zinc-200 dark:bg-zinc-800 transition-all">
        {items.map((item, index) => (
          <span
            key={index}
            className="flex items-center px-3 py-1 text-sm bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-full shadow-sm"
          >
            {item}
            <button
              onClick={() => removeItem(item)}
              className="ml-2 text-zinc-500 hover:text-red-500 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}

        {items.length < 5 && (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Add tag...'}
            className="flex-1 min-w-[80px] max-w-[150px] border-none bg-transparent outline-none text-[1.6vh] md:text-[.9vw] text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          />
        )}
      </div>
    </div>
  );
};

export default TagInput;
