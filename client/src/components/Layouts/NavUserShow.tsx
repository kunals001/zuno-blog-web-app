import React from "react";
import { IconUser } from "@tabler/icons-react";
import { useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import Link from "next/link";

const NavUserShow = () => {
  const { user } = useAppSelector((state) => state.user);

  const isUserLoggedIn = user && user.verified;

  return (
    <div aria-label="show user">
      {isUserLoggedIn ? (
        <div className="md:w-[3.5vw] md:h-[3.5vw] h-[6vh] w-[6vh] rounded-full">
          <Image
            src={user.avatar || ""}
            alt="user-avatar"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>
      ) : (
        <div className="">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/login";
            }}
            className="text-[1.1vw] font-prime font-[500] text-zinc-200 transition ease-in-out duration-200 hidden md:block cursor-pointer bg-[#0ABAB5] px-[1vw] pt-[.2vw] pb-[.3vw] rounded-md"
          >
            Login
          </button>

          <Link href="/login">
            <IconUser className="size-[3vh] md:hidden text-zinc-700 dark:text-zinc-200" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavUserShow;
