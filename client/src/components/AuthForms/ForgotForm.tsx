import React from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../Layouts/Input";
import Link from "next/link";
import { IconLoader } from "@tabler/icons-react";

type InputType = {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  handelForgot: (e: React.FormEvent<HTMLFormElement>) => void;
  forgotLoading: boolean;
};

const ForgotForm: React.FC<InputType> = ({
  email,
  setEmail,
  handelForgot,
  forgotLoading,
}) => {
  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] px-[2vh] mx:px-0 flex items-center justify-center md:py-[2vw] md:rounded-lg md:bg-[#c2f6f4]">
        <form
          onSubmit={handelForgot}
          className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]"
        >
          <h1 className="capitalize md:text-[2vw] text-[3.5vh] font-prime font-[700] text-zinc-700 text-center pb-3">
            Forgor Password
          </h1>

          <Input
            label="Enter your email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            type="submit"
            disabled={forgotLoading}
            className="md:py-[.3vw] py-[1vh] rounded-md bg-[#0ABAB5] text-zinc-50 text-[2vh] md:text-[1vw] hover:bg-[#0ABAB5] transition ease-in-out duration-200 cursor-pointer mt-3"
          >
            {forgotLoading ? (
              <div className="w-full h-full flex items-center justify-center gap-1">
                <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
                Sending...
              </div>
            ) : (
              "Send Link"
            )}
          </button>

          <p className="md:py-[.5vw] py-[1.5vh] text-zinc-600 text-[1.6vh] md:text-[.8vw] text-center">
            Back to{" "}
            <Link
              href="/login"
              className="text-[#0ABAB5] hover:underline font-[600]"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotForm;
