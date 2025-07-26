import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { IconPencil } from "@tabler/icons-react";

interface Props {
  setBio: React.Dispatch<React.SetStateAction<string | null>>;
  setSocialLinks: React.Dispatch<React.SetStateAction<string[] | null>>;
}

const BioAndLinks = ({ setBio, setSocialLinks }: Props) => {
  const { user } = useAppSelector((state) => state.user);

  return (
    <div className="w-full mt-2">
      <div className="w-full relative">
        {user?.bio.length && user?.bio.length > 0 ? (
          <input
            value={user?.bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-[80vw] md:w-[20vw] outline-none md:p-[1vw] p-[1vh] rounded-lg bg-transparent scrollbar-hide text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200"
          />
        ) : (
          <input
            placeholder="Write a short bio..."
            onChange={(e) => setBio(e.target.value)}
            className="w-[80vw] md:w-[20vw] outline-none md:p-[1vw] p-[1vh] rounded-lg bg-transparent scrollbar-hide text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200"
          />
        )}

        <div className="absolute top-[20%] right-[2vh] translate-y-[-50%]">
          <IconPencil className=" text-zinc-700 dark:text-zinc-200 md:p-[.5vw] md:size-[2.5vw] size-[3.5vh] p-[.5vh] bg-zinc-300 dark:bg-zinc-600 rounded-full hover:bg-prime transition ease-in-out duration-200 cursor-pointer" />
        </div>
      </div>

      <div className="w-full relative mt-2">
        {user?.bio.length && user?.bio.length > 0 ? (
          <input
            value={user?.bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-[80vw] md:w-[20vw] outline-none md:p-[1vw] p-[1vh] rounded-lg bg-transparent scrollbar-hide text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200"
          />
        ) : (
          <input
            placeholder="Add social links..."
            onChange={(e) => setBio(e.target.value)}
            className="w-[80vw] md:w-[20vw] outline-none md:p-[1vw] p-[1vh] rounded-lg bg-transparent scrollbar-hide text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200"
          />
        )}

        <div className="absolute top-[20%] right-[2vh] translate-y-[-50%]">
          <IconPencil className=" text-zinc-700 dark:text-zinc-200 md:p-[.5vw] md:size-[2.5vw] size-[3.5vh] p-[.5vh] bg-zinc-300 dark:bg-zinc-600 rounded-full hover:bg-prime transition ease-in-out duration-200 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default BioAndLinks;
