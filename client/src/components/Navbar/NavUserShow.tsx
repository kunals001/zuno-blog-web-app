import React, { useState, useRef} from "react";
import {
  IconLogout,
  IconSettings,
  IconUser,
  IconUserStar,
  IconWriting,
} from "@tabler/icons-react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/userSlice";
import { useClickOutside } from "../Layouts/ClickOutside";
import Image from "next/image";
import Link from "next/link";

const NavUserShow = () => {
  const { user } = useAppSelector((state) => state.user);
  const [openPanel, setOpenPanel] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: panelRef,
    onOutsideClick: () => setOpenPanel(false),
    ignoreRefs: [profileRef],
  });

  const dispatch = useAppDispatch();

  const isUserLoggedIn = user && user.isVerified;

  const handelLogout = () => {
    dispatch(logoutUser()).unwrap();
    window.location.href = "/";
  };

  const PanelLinks: {
    name: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      name: "Profile",
      path: "/profile/?tab=user-profile",
      icon: IconUserStar,
    },
    {
      name: "Write",
      path: "/add-story",
      icon: IconWriting,
    },
    {
      name: "Settings",
      path: "/profile/?tab=settings",
      icon: IconSettings,
    },
  ];

  return (
    <div aria-label="show user">
      {isUserLoggedIn ? (
        <div className="md:w-[2.5vw] md:h-[2.5vw] h-[4.7vh] w-[4.7vh]  select-none cursor-pointer ">
          <div ref={profileRef} className="">
            <Image
              onClick={() => setOpenPanel(!openPanel)}
              src={user.profilePic || ""}
              alt="user-profile"
              width={100}
              height={100}
              className="object-contain rounded-full"
            />
          </div>

          <div
            ref={panelRef}
            className={`hidden ${
              openPanel ? "md:flex md:flex-col" : "md:hidden"
            } items-center justify-center  p-[.5vw] rounded-md absolute top-[4vw] right-[10vw] bg-zinc-300 dark:bg-zinc-700 z-70 transition-all duration-300 ease-in-out w-[11vw] gap-2`}
          >
            {PanelLinks.map((item, index) => (
              <div
                key={index}
                className="text-[1.1vw] font-prime font-[500] dark:text-zinc-200 text-zinc-600 transition ease-in-out duration-200 cursor-pointer dark:bg-zinc-600 bg-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-500 px-[1vw] pt-[.2vw] pb-[.3vw] rounded-md w-full"
              >
                <Link href={item.path} className="flex items-center gap-[.7vw]">
                  {item.icon && (
                    <item.icon className="size-6 text-zinc-700 dark:text-zinc-200" />
                  )}{" "}
                  {item.name}
                </Link>
              </div>
            ))}

            <button
              type="button"
              onClick={handelLogout}
              className="text-[1.1vw] font-prime font-[500] text-red-400 hover:text-zinc-200 transition ease-in-out duration-200 cursor-pointer dark:bg-zinc-600 bg-zinc-200 hover:bg-[#ff5855ed] px-[1vw] pt-[.2vw] pb-[.3vw] rounded-md w-full text-start flex items-center gap-[.7vw] group"
            >
              <IconLogout className="size-6 text-red-400 group-hover:text-zinc-200 transition ease-in-out duration-200" />{" "}
              Logout
            </button>
          </div>
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
