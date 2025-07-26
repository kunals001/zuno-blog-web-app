import { IconUser } from "@tabler/icons-react";
import React from "react";

const UserFriends = () => {
  return (
    <div className="flex flex-col md:items-start items-center gap-[1vh] md:gap-[.5vw] w-full py-[1vh] px-[2vh] md:px-[1vw]">
      <div className="flex gap-1 items-center justify-center text-zinc-500 dark:text-zinc-400 ">
        <p className="text-[1.6vh] md:text-[1vw] font-[500] ">Kunal_singh_34</p>
        <IconUser stroke={2} className="md:size-[1.4vw] size-[2vh] md:pb-1"/>
      </div>
      <div className="flex items-center gap-[4vh] md:gap-[3vw] text-zinc-600 dark:text-zinc-300 text-[1.6vh] md:text-[1vw] font-[500]">
        <div className="flex flex-col items-center md:gap-1  ">
          <span>0</span>
          <p>All Posts</p>
        </div>

        <div className="flex flex-col items-center md:gap-1 ">
          <span>0</span>
          <p>Follwers</p>
        </div>

        <div className="flex flex-col items-center md:gap-1 ">
          <span>0</span>
          <p>Following</p>
        </div>
      </div>
    </div>
  );
};

export default UserFriends;
