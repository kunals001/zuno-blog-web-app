import React from "react";
import { IconArrowNarrowLeft, IconSearch } from "@tabler/icons-react";

const OpenSearchSection = ({
  openSearch,
  setOpenSearch,
}: {
  openSearch: boolean;
  setOpenSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {openSearch && (
        <div className="w-full h-screen flex justify-center backdrop-blur-md transition ease-in-out duration-300 absolute top-0 left-0 z-[100] md:py-[2vw] overflow-hidden">
          <div className="md:w-[40vw] w-full h-screen md:p-[1vw] p-[1vh] bg-[#f5f5f5d5] dark:bg-zinc-700 md:rounded-xl md:min-h-[20vw] md:max-h-[90vh] popup-animate ">
            <div className="flex items-center justify-between gap-2">
              <IconArrowNarrowLeft
                stroke={1}
                onClick={() => setOpenSearch(false)}
                className="md:size-[2.6vw] size-[5vh] w-[6vh] md:w-[3vw] text-zinc-700 dark:text-zinc-200 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600 transition ease-in-out duration-200 rounded-full md:bg-[#f5f5f5d5] md:dark:bg-zinc-700 bg-zinc-200 dark:bg-zinc-600"
              />

              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for articales..."
                  className="w-full placeholder:text-zinc-700 dark:placeholder:text-zinc-200 outline-none md:pl-[1vw] md:pr-[4vw] md:py-[.3vw] pl-[1.5vh] pr-[6vh] py-[.5vh] rounded-full  border-2 border-zinc-400 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 bg-transparent text-[1.7vh] md:text-[1vw]"
                />

                <IconSearch className="absolute top-[50%] right-[2vh] translate-y-[-50%] text-zinc-700 dark:text-zinc-200"/>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OpenSearchSection;
