import React from "react";
import AuthLayout from "../Layouts/AuthLayout";
import Link from "next/link";
import { Mail } from "lucide-react";


const ResetLink

= ({
}) => {
  return (
    <AuthLayout>
      <div className="w-full md:w-[25vw] px-[2vh] mx:px-0 flex items-center justify-center md:py-[2vw] md:rounded-lg md:bg-[#c2f6f4] slide-up">
        <form
          
          className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]"
        >
          <h1 className="capitalize md:text-[2vw] text-[3.5vh] font-prime font-[700] text-zinc-700 text-center pb-3">
            Forgor Password
          </h1>

          <div className="">
            <Mail className="md:size-[3vw] size-[7vh] text-[#0ABAB5] mx-auto"/>
          </div>

          <p className="md:py-[.5vw] py-[1.5vh] text-zinc-600 text-[1.6vh] md:text-[.8vw] text-center ">if you have an account with us, we will send you an email to reset your password</p>

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

export default ResetLink;
