import React from "react";

interface Props {
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
}

const AddDescription: React.FC<Props> = ({ description, setDescription }) => {
  return (
    <div className="w-full mt-[2vh]">
      <textarea
        placeholder="Write a short description for your story..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
        className="
          w-full
          rounded-xl
          border-2
          border-zinc-400 dark:border-zinc-600
          bg-zinc-200 dark:bg-zinc-800
          text-zinc-800 dark:text-zinc-100
          placeholder:text-zinc-400 dark:placeholder:text-zinc-500
          outline-none
          p-4
          text-[1rem] md:text-[1.1vw]
          transition resize-none overflow-y-scroll md:h-[12vw] h-[20vh] scrollbar-hide
        "
      />
    </div>
  );
};

export default AddDescription;
