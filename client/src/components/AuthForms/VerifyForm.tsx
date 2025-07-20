import React from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Input from "../Layouts/Input";
import Link from "next/link";
import { IconLoader } from "@tabler/icons-react";


type InputType = {
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>  
  handelVerify: (e: React.FormEvent<HTMLFormElement>) => void;
  verifyLoading: boolean;
};

const VerifyForm: React.FC<InputType> = ({
  code,
  setCode,
  handelVerify,
  verifyLoading
}) => {
  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] px-[2vh] mx:px-0 flex items-center justify-center md:py-[2vw] md:rounded-lg md:bg-[#c2f6f4]">
        <form
          onSubmit={handelVerify}
          className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]"
        >
          <h1 className="capitalize md:text-[2vw] text-[3.5vh] font-prime font-[700] text-zinc-700 text-center pb-4">
            Verify your account
          </h1>

          <Input
            label="Verification Code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <button
            type="submit"
            disabled={verifyLoading}
            className="md:py-[.3vw] py-[1vh] rounded-md bg-[#0ABAB5] text-zinc-50 text-[2vh] md:text-[1vw] hover:bg-[#0ABAB5] transition ease-in-out duration-200 cursor-pointer mt-3"
          >
            {verifyLoading ? (
              <div className="w-full h-full flex items-center justify-center gap-1">
                <IconLoader className="animate-spin md:size-[1.5vw] size-[3vh] text-[#ededed]" />
                Verifying...
              </div>
            ) : (
              "Verify"
            )}
          </button>

          <p className="md:py-[.5vw] py-[1.5vh] text-zinc-600 text-[1.6vh] md:text-[.8vw] text-center">
            Back to {" "}
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

export default VerifyForm;
