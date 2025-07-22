import Image from "next/image";
import dynamic from "next/dynamic";
import Skeleton from "../Layouts/Skeleton";
import { IconMenu2, IconSearch } from "@tabler/icons-react";
import { useState } from "react";

const NavUserShow = dynamic(() => import("../Layouts/NavUserShow"), {
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

const DarkMode = dynamic(() => import("@/components/Layouts/DarkMode"), {
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

const Navlinks = dynamic(() => import("../Layouts/Navlinks"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-[15vw]"}
      height={"h-[3.5vw]"}
      rounded={"rounded-lg"}
      animation="shimmer"
    />
  ),
});

const MobileMenu = dynamic(() => import("../Layouts/MobileMenu"), {
  ssr: false,
});

const OpenSearchSection = dynamic(() => import("../Layouts/OpenSearchSection"), {
  ssr: false,
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);

  return (
    <nav className="w-full md:h-[4vw] h-[7vh] md:px-[10vw] px-[1vh] flex items-center justify-between bg-zinc-200 dark:bg-zinc-800 border-b-1 border-zinc-400 dark:border-zinc-600 md:border-b-0">
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

        {/* Dark mode toggle and mobile menu */}

        <div className="flex items-center md:gap-[.5vw] gap-[1.5vh]">
          <IconSearch onClick={() => setOpenSearch(!openSearch)} className="md:size-[2.6vw] size-[3vh] text-zinc-700 dark:text-zinc-200 cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-700 transition ease-in-out duration-200 md:p-[.5vw] rounded-full" />

          {openSearch && <OpenSearchSection openSearch={openSearch} setOpenSearch={setOpenSearch} />}  

          <DarkMode />

          <div className="">
            <NavUserShow />
          </div>

          <IconMenu2
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
