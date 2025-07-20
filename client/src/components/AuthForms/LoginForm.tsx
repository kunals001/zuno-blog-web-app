import React from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../Layouts/Input";
import Link from "next/link";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";

const ErrorToast = dynamic(() => import("../Layouts/ErrorLayout"), {
  ssr: false,
});

type InputType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handelLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  loginLoading: boolean;
  loginError: string | unknown;
};

const LoginForm: React.FC<InputType> = ({
  email,
  setEmail,
  password,
  setPassword,
  handelLogin,
  loginLoading,
  loginError,
}) => {
  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] px-[2vh] mx:px-0 flex items-center justify-center md:py-[2vw] md:rounded-lg md:bg-[#c2f6f4]">
        <form
          onSubmit={handelLogin}
          className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]"
        >
          {typeof loginError === "string" && (
            <ErrorToast
              message={loginError}
              duration={4000}
              onClose={() => console.log("Toast closed")}
            />
          )}

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {
            <Link
              href="/forgot-password"
              className="md:py-[.5vw] py-[1.5vh] text-zinc-600 text-[1.5vh] md:text-[.7vw] hover:underline"
            >
              Forgot Password?
            </Link>
          }

          <button
            type="submit"
            disabled={loginLoading}
            className="md:py-[.3vw] py-[.4vh] rounded-md bg-[#0ABAB5] text-zinc-50 text-[1.5vh] md:text-[1vw] hover:bg-[#0ABAB5] transition ease-in-out duration-200 cursor-pointer"
          >
            {loginLoading ? (
              <div className="w-full h-full flex items-center justify-center gap-1">
                <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
                Loging...
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
