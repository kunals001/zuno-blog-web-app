import Image from "next/image";
import dynamic from "next/dynamic";
import Skeleton from "../Layouts/Skeleton";
import { Bell, Menu, Search } from "lucide-react";
import { useRef, useState } from "react";
import { useClickOutside } from "../Layouts/ClickOutside";

const NavUserShow = dynamic(() => import("./NavUserShow"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-[5vh] md:w-[2.5vw]"}
      height={"h-[5vh] md:h-[2.5vw]"}
      rounded={"rounded-full"}
      animation="shimmer"
    />
  ),
});

const Navlinks = dynamic(() => import("./Navlinks"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-[30vw]"}
      height={"h-[3.5vw]"}
      rounded={"rounded-lg"}
      animation="shimmer"
    />
  ),
});

const MobileMenu = dynamic(() => import("./MobileMenu"), {
  ssr: false,
});

const OpenSearchSection = dynamic(
  () => import("./OpenSearchSection"),
  {
    ssr: false,
  }
);

const Notifications = dynamic(() => import("./Notifications"), {
  ssr: false,
});

const DarkMode = dynamic(() => import("../Layouts/DarkMode"), {
  ssr: false,
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);

  const bellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: dropdownRef,
    onOutsideClick: () => setOpenNotif(false),
    ignoreRefs: [bellRef],
  });

  return (
    <nav className="w-full md:h-[4vw] h-[7vh] md:px-[10vw] px-[1vh] flex items-center justify-between bg-zinc-200 dark:bg-zinc-800 border-b-1 border-zinc-400 dark:border-zinc-600 md:border-b-0 sticky top-0 z-[100]">
      <div className="w-full h-[100%] flex items-center justify-between md:border-b-2 border-zinc-400 dark:border-zinc-600">
        {/* navbar logo*/}

        <div
          onClick={() => {
            window.location.href = "/";
          }}
          aria-label="nav-logo"
          className="flex items-center justify-center gap-1 cursor-pointer"
        >
          <Image
            src={"/zuno.png"}
            alt="nav-logo"
            width={150}
            height={150}
            className="md:w-[2.5vw] w-[4.3vh] md:h-[2.5vw] h-[4.3vh] object-contain"
            priority
          />

          <h1 className="md:text-[2.2vw] text-[3.5vh] font-prime font-[700] text-zinc-700 dark:text-zinc-200 hover:text-[#0ABAB5] transition ease-in-out duration-200">
            Zuno
          </h1>
        </div>

        {/* Desktop navbar links*/}

        <div aria-label="nav-links" className="hidden md:block">
          <Navlinks />
        </div>

        {/* user section */}

        <div className="flex items-center md:gap-[.5vw] gap-[1.5vh]">
          <div className="flex items-center gap-[1.5vh] md:gap-0">
            <Search
              onClick={() => setOpenSearch(!openSearch)}
              className="md:size-[2.6vw] size-[3.5vh] text-zinc-600 dark:text-zinc-200 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition ease-in-out duration-200 md:p-[.5vw] rounded-full"
            />

           <div ref={bellRef} className="">
             <Bell
              onClick={() => setOpenNotif(!openNotif)}
              className="md:size-[2.6vw] size-[3.5vh] text-zinc-600 dark:text-zinc-200 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition ease-in-out duration-200 md:p-[.5vw] rounded-full"
            />
           </div>
          </div>

          <DarkMode />

          {openNotif && (
            <Notifications
              openNotif={openNotif}
              setOpenNotif={setOpenNotif}
              dropdownRef={dropdownRef}
            />
          )}

          {openSearch && (
            <OpenSearchSection
              openSearch={openSearch}
              setOpenSearch={setOpenSearch}
            />
          )}

          <div className="">
            <NavUserShow />
          </div>

          <Menu
            onClick={() => {
              setOpen(!open);
            }}
            className="size-[3vh] text-zinc-700 dark:text-zinc-200 md:hidden"
          />
        </div>

        <MobileMenu open={open} setOpen={setOpen} />
      </div>
    </nav>
  );
};

export default Navbar;
