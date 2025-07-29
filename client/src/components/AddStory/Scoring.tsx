import { ChevronDown, Loader2 } from "lucide-react";
import React from "react";

const categories = [
  'Technology',
  'Health',
  'Travel',
  'Education',
  'Food',
  'Lifestyle',
  'Finance',
  'Business',
  'Entertainment',
  'Sports',
];

interface ScoringProps {
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  createloading: boolean
}

const Scoring = ({ category, setCategory, setStatus,createloading }: ScoringProps) => {
  return (
    <div className="mx:px-[1vw] px-[0vh] flex flex-col md:py-[1vw] py-[2vh] md:fixed w-full md:w-[20vw]">
      <div className="w-full relative">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="text-zinc-700 dark:text-zinc-200 text-[1.8vh] md:text-[1vw] md:px-[1vw] md:py-[.3vw] px-[2vh] py-[.8vh] rounded-xl bg-transparent border-2 border-zinc-300 dark:border-zinc-600 outline-none w-full cursor-pointer appearance-none"
        >
          <option className="text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200" value="">Select a category</option>
          {categories.map((cat) => (
            <option
              className="text-zinc-700 bg-zinc-200 dark:bg-zinc-700 dark:text-zinc-200"
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

        <ChevronDown className="absolute top-[50%] right-[2vh] translate-y-[-50%] text-zinc-700 dark:text-zinc-200" />
      </div>

      <div className="w-full mt-2 flex flex-col gap-2">
        <button
          type="submit"
          disabled={createloading}
          onClick={() => setStatus("Draft")}
          className="w-full text-zinc-200 text-[2vh] md:text-[1.2vw] md:px-[1vw] md:py-[.3vw] px-[2vh] py-[.8vh] rounded-xl bg-prime hover:bg-prime/80 cursor-pointer transition-all duration-500 ease-in-out"
        >
          Draft
        </button>

        <button
          type="submit"
          disabled={createloading}
          onClick={() => setStatus("Published")}
          className="w-full text-zinc-200 text-[2vh] md:text-[1.2vw] md:px-[1vw] md:py-[.3vw] px-[2vh] py-[.8vh] rounded-xl bg-indigo-500 hover:bg-indigo-600 cursor-pointer transition-all duration-500 ease-in-out flex items-center justify-center"
        >
          {createloading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              Publishing
            </div>
          ) : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default Scoring;
