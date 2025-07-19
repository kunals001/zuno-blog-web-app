import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input = ({ label, type = "text", ...props }: InputProps) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPassword = type === "password";

  const checkFilled = () => {
    const value = inputRef.current?.value;
    return value && value.length > 0;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkFilled()) {
        inputRef.current?.classList.add("filled");
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 1500);
  }, []);

  return (
    <div
      className={`relative w-full pt-4 group ${focused ? "bg-none" : "bg-zinc-100 hover:bg-white"} rounded-md transition-all duration-200`}
    >
      <input
        {...props}
        ref={inputRef}
        type={isPassword && showPassword ? "text" : type}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder=" "
        onChange={(e) => {
          if (e.target.value) {
            inputRef.current?.classList.add("filled");
          } else {
            inputRef.current?.classList.remove("filled");
          }
        }}
        className={`
          peer w-full border-0 border-b-2 bg-transparent
          text-base text-zinc-900 border-zinc-400 pr-10 py-0
          focus:outline-none focus:border-[#0ABAB5]
          transition-all duration-200 autofill:bg-transparent
          cursor-pointer
        `}
      />

      <label
        className={`
          absolute left-0 text-zinc-500 top-4
          px-2
          transition-all duration-200 pointer-events-none
          peer-focus:-top-2 peer-focus:text-lg peer-focus:text-[#0ABAB5] peer-focus:px-3
          peer-[.filled]:-top-2 peer-[.filled]:text-lg peer-[.filled]:text-[#0ABAB5] peer-[.filled]:px-3
          group-hover:-top-2 group-hover:text-lg group-hover:text-[#0ABAB5] group-hover:px-1.5
        `}
      >
        {label}
      </label>

      {isPassword && (
        <div
          className={`
            absolute right-0 top-1/2 -translate-y-1/2 px-1
            cursor-pointer text-zinc-500 transition-all
            hover:text-[#0ABAB5] group-hover:px-4
            ${focused ? "px-4" : ""}
          `}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </div>
      )}
    </div>
  );
};

export default Input;
