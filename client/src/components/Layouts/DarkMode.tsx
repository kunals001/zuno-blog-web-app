import React, { useEffect, useState } from "react";
import { IconMoonFilled, IconSunFilled } from "@tabler/icons-react";

const DarkMode = () => {
  const [theme, setTheme] = useState("light");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme("dark");
    }

    setHasMounted(true);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div
      aria-label="dark-mode-toggle"
      className="z-2 cursor-pointer flex gap-[1vw] "
    >
      <label className="toggle-wrapper shrink-0 overflow-hidden md:w-[2.5vw] md:h-[2.5vw] w-[5vh] h-[5vh] relative flex justify-center items-center rounded-full cursor-pointer">
        {hasMounted && (
          <input
            type="checkbox"
            className="absolute opacity-0 pointer-events-none cursor-pointer"
            onChange={toggleTheme}
            checked={theme === "light"}
          />
        )}
        <IconSunFilled className="sun absolute w-[70%] h-[70%] text-[#666]" />
        <IconMoonFilled className="moon absolute w-[70%] h-[70%] text-[#ececec]" />
        <span className="toggle-bg absolute w-full h-full rounded-full z-[-1]"></span>
      </label>
    </div>
  );
};

export default DarkMode;
