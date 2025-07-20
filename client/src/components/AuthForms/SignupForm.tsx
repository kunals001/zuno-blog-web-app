import React from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../Layouts/Input";
import Link from "next/link";
import { IconLoader } from "@tabler/icons-react";

type InputType = {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handelSignup: (e: React.FormEvent<HTMLFormElement>) => void;
  signupLoading: boolean;
};

const SignupForm: React.FC<InputType> = ({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handelSignup,
  signupLoading,
}) => {
  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] px-[2vh] mx:px-0 flex items-center justify-center md:py-[2vw] md:rounded-lg md:bg-[#c2f6f4]">
        <form
          onSubmit={handelSignup}
          className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]"
        >
          <h1 className="capitalize md:text-[2vw] text-[3.5vh] font-prime font-[700] text-zinc-700 text-center laeding-none">
            Create an account
          </h1>

          <p className="pb-3 text-zinc-600 text-[1.6vh] md:text-[.9vw] text-center">
            Please fill in this form to create an account
          </p>
          <Input
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <button
            type="submit"
            disabled={signupLoading}
            className="md:py-[.3vw] py-[1vh] rounded-md bg-[#0ABAB5] text-zinc-50 text-[2vh] md:text-[1vw] hover:bg-[#0ABAB5] transition ease-in-out duration-200 cursor-pointer mt-3"
          >
            {signupLoading ? (
              <div className="w-full h-full flex items-center justify-center gap-1">
                <IconLoader className="animate-spin md:size-[1.5vw] size-[3vh] text-[#ededed]" />
                Signing...
              </div>
            ) : (
              "Sign up"
            )}
          </button>

          <p className="md:py-[.5vw] py-[1.5vh] text-zinc-600 text-[1.6vh] md:text-[.8vw] text-center">
            Already have an account{" "}
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

export default SignupForm;
