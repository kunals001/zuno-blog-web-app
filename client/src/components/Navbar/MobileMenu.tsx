import Link from "next/link";
import React from "react";
import { IconX } from "@tabler/icons-react";

const MobileMenu = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const MobileMenu = [
    { name: "Home", path: "/" },
    { name: "Tranding", path: "/merge" },
    { name: "Categories", path: "/compress" },
    { name: "Popular", path: "/resize" },
  ];

  return (
    <div
      className={`md:hidden w-[20vh] bg-zinc-300 dark:bg-zinc-700 h-screen absolute top-0 right-0 z-50 ${
        open
          ? "translate-x-0 opacity-100 visible transition ease-in-out duration-300"
          : "translate-x-full opacity-0 hidden transition ease-in-out duration-300"
      }  py-[2vh]`}
    >
      <div className="w-full h-[5vh] flex items-center justify-start px-[1vh]">
        <IconX
          onClick={() => {
            setOpen(!open);
          }}
          className="size-7 text-zinc-700 dark:text-zinc-200"
        />
      </div>

      {MobileMenu.map((item, index) => (
        <div key={index} className="w-full px-[1vh] pt-1 flex flex-col ">
          <Link
            href={item.path}
            className="w-full px-[1vh] py-[.5vh] rounded-md text-zinc-200 bg-[#0ABAB5] text-[2vh] font-[500]"
          >
            {item.name}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MobileMenu;
