"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearForgotPasswordError, forgotPassword } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

const ErrorToast = dynamic(() => import("@/components/Layouts/ErrorLayout"), {
  ssr: false,
});

const ForgotForm = dynamic(() => import("@/components/AuthForms/ForgotForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
    </div>
  ),
});

const ForgotPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { forgotPasswordError,forgotPasswordLoading } = useAppSelector((state) => state.user);

  const [email, setEmail] = useState("");

  const handelLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(forgotPassword({email})).unwrap();
      if (!forgotPasswordError) {
        router.push("/");
      }
    } catch (error) {}
  };

  return (
    <div>
      {typeof forgotPasswordError === "string" && (
        <ErrorToast
          message={forgotPasswordError}
          duration={4000}
          onClose={() => dispatch(clearForgotPasswordError())}
        />
      )}

      <ForgotForm
        email={email}
        setEmail={setEmail}
        handelForgot={handelLogin}
        forgotLoading={forgotPasswordLoading}
      />
    </div>
  );
};

export default ForgotPage;
