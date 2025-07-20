import React, { InputHTMLAttributes, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const Input = ({ label, type = "text", ...props }: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={isPassword && showPassword ? "text" : type}
        placeholder={label}
        className={`
          w-full border-0 border-b-2 bg-zinc-100 rounded-md
          text-base text-zinc-900 border-zinc-400 pr-10 py-2 px-3
          focus:outline-none focus:border-[#0ABAB5] focus:bg-white
          transition-all duration-200
        `}
      />

      {isPassword && (
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-zinc-500 hover:text-[#0ABAB5]"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
        </div>
      )}
    </div>
  );
};

export default Input;
