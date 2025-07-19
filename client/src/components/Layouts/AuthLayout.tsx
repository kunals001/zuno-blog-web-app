import React from "react";
import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="absolute md:top-[2vw] top-[1vh] md:left-[2vw] left-[1vh] flex items-center justify-center gap-1">
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
      {children}
    </div>
  );
};

export default AuthLayout;
