"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearForgotPasswordError,
  forgotPassword,
} from "@/redux/slices/userSlice";

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

const ResetForm = dynamic(
  () => import("@/components/AuthForms/ResetPasswordLinkSend"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center">
        <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
      </div>
    ),
  }
);

const ForgotPage = () => {
  const dispatch = useAppDispatch();
  const { forgotPasswordError, forgotPasswordLoading } = useAppSelector(
    (state) => state.user
  );

  const [email, setEmail] = useState("");
  const [submit, setSubmit] = useState(true);

  const handelLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setSubmit(false);
    } catch (error) {console.log(error)}
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

      {submit ? (
        <ForgotForm
          email={email}
          setEmail={setEmail}
          handelForgot={handelLogin}
          forgotLoading={forgotPasswordLoading}
        />
      ) : (
        <ResetForm />
      )}
    </div>
  );
};

export default ForgotPage;
