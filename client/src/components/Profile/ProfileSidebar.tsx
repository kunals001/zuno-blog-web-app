import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { logoutUser } from "@/redux/slices/userSlice";
import React from "react";

const ProfileSidebar = () => {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab");
  const links = [
    {
      name: "Profile",
      url: "/profile/?tab=user-profile",
      tab: "user-profile",
    },
    {
      name: "Followers",
      url: "/profile/?tab=followers",
      tab: "followers",
    },
    {
      name: "Following",
      url: "/profile/?tab=following",
      tab: "following",
    },
    {
      name: "Dashboard",
      url: "/profile/?tab=dashboard",
      tab: "dashboard",
    },
    {
      name: "My Stories",
      url: "/profile/?tab=mystories",
      tab: "mystories",
    },
    {
      name: "Drafts",
      url: "/profile/?tab=drafts",
      tab: "drafts",
    },
    {
      name: "Settings",
      url: "/profile/?tab=settings",
      tab: "settings",
    },
  ];

  const dispatch = useAppDispatch();

  const handelLogout = () => {
    dispatch(logoutUser()).unwrap();
    window.location.href = "/";
  }

  return (
    <div className="md:w-[14vw] md:h-[calc(100vh-6vw)] w-full md:p-4 md:dark:bg-zinc-700 md:bg-zinc-300 bg-zinc-200 dark:bg-zinc-800 flex flex-col justify-between p-1 md:rounded-md md:sticky md:top-[5vw]">
      <div className="flex flex-col gap-2">
        {links.map((link, index) => {
          const isActive = activeTab === link.tab;

          return (
            <Link
              key={index}
              href={link.url}
              className={`w-full dark:text-zinc-200 text-zinc-700 md:px-[1vw] md:py-[.2vw] px-[1vh] py-[.6vh] md:rounded-md transition-all duration-300 ease-in-out md:text-[1.1vw] text-[1.8vh] md:border-b-0 border-b-1 border-zinc-300 dark:border-zinc-600
                ${isActive ? "md:bg-zinc-200 md:dark:bg-zinc-600" : "dark:hover:bg-zinc-600 hover:bg-zinc-200"}`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <div onClick={handelLogout} className="w-full mt-4 md:mt-0">
        <button className="md:text-[1.1vw] text-[2vh] text-red-400 hover:text-zinc-100 hover:bg-red-400 rounded-md transition-all duration-300 ease-in-out md:px-[1vw] md:py-[.2vw] px-[1vh] py-[.6vh] bg-zinc-100 w-full cursor-pointer">
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
