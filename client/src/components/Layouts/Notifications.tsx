import { IconArrowNarrowLeft } from "@tabler/icons-react";
import React from "react";

const Notifications = ({
  openNotif,
  setOpenNotif,
  dropdownRef
}: {
  openNotif: boolean;
  setOpenNotif: React.Dispatch<React.SetStateAction<boolean>>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <>
       {openNotif && (
        <div ref={dropdownRef} className="md:w-[15vw] w-full md:h-[20vw] h-screen bg-zinc-300 md:dark:bg-zinc-700 dark:bg-zinc-800 md:rounded-xl absolute md:top-[4vw] md:right-[10vw] top-0 right-0 z-80 md:p-[1vw] p-[1vh]">
            <div className="md:hidden flex items-center gap-[3vh]">
                <IconArrowNarrowLeft
                stroke={1}
                onClick={() => setOpenNotif(false)}
                className="size-[4.5vh] w-[6vh] text-zinc-700 dark:text-zinc-200"
              />

              <h2 className="text-zinc-700 dark:text-zinc-200 text-[2.5vh]">Notifications</h2>
            </div>
        </div>
       )}
    </>
  )
};

export default Notifications;
