"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearForgotPasswordError,
  forgotPassword,
} from "@/redux/slices/userSlice";
import { Redirect } from "@/components/Secure/Redirect";
import {toast} from "react-hot-toast";

const ForgotForm = dynamic(() => import("@/components/AuthForms/ForgotForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
    </div>
  ),
});

const ResetForm = dynamic(
  () => import("@/components/AuthForms/ResetPasswordLinkSend"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof forgotPasswordError === "string") {
      toast.error(forgotPasswordError, {
        duration: 4000,
      });
      dispatch(clearForgotPasswordError()); // clear after showing
    }
  }, [forgotPasswordError, dispatch]);

  return (
    <Redirect>
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
    </Redirect>
  );
};

export default ForgotPage;
