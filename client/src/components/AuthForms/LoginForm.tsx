import React from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../Layouts/Input";
import Link from "next/link";
import {Loader } from "lucide-react";
import GoogleSignup from "@/firebase/GoogleSignup";



type InputType = {
  identifier: string;
  setIdentifier: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handelLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  loginLoading: boolean;
};

const LoginForm: React.FC<InputType> = ({
  identifier,
  setIdentifier,
  password,
  setPassword,
  handelLogin,
  loginLoading
}) => {
  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] px-[2vh] mx:px-0 flex items-center justify-center md:py-[2vw] md:rounded-lg md:bg-[#c2f6f4] slide-up">
        <form
          onSubmit={handelLogin}
          className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]"
        >
          <h1 className="capitalize md:text-[2vw] text-[3.5vh] font-prime font-[700] text-zinc-700 text-center pb-3">
            Welcome back
          </h1>

          <Input
            label="Email or Username"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
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
            className="md:py-[.3vw] py-[1vh] rounded-md bg-[#0ABAB5] text-zinc-50 text-[2vh] md:text-[1vw] hover:bg-[#0ABAB5] transition ease-in-out duration-200 cursor-pointer mt-3"
          >
            {loginLoading ? (
              <div className="w-full h-full flex items-center justify-center gap-1">
                <Loader className="animate-spin md:size-[1.5vw] size-[3vh] text-[#ededed]" />
                Loging...
              </div>
            ) : (
              "Login"
            )}
          </button>

          <div className="relative flex items-center w-full my-2">
            <div className="flex-grow border-t border-zinc-200 md:border-zinc-500"></div>
            <span className="mx-4 text-zinc-700 text-md font-medium">Or</span>
            <div className="flex-grow border-t border-zinc-200 md:border-zinc-500"></div>
          </div>

          <GoogleSignup />

          <p className="md:py-[.5vw] py-[1.5vh] text-zinc-600 text-[1.6vh] md:text-[.8vw] text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-[#0ABAB5] hover:underline font-[600]"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default LoginForm;
