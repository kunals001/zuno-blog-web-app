"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearResetPasswordError,
  resetPassword,
} from "@/redux/slices/userSlice";
import { useRouter,useParams } from "next/navigation";
import { Redirect } from "@/components/Secure/Redirect";
import {toast} from "react-hot-toast";

const ResetPasswordForm = dynamic(
  () => import("@/components/AuthForms/ResetPasswordForm"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center">
        <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
      </div>
    ),
  }
);

const ResetPasswordPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const router = useRouter();
  const { resetPasswordError, resetPasswordLoading } = useAppSelector(
    (state) => state.user
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const token = params.token as string;

  const handelLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        return alert("Password and Confirm Password does not match");
      }

      await dispatch(resetPassword({ password, token })).unwrap();
      if (!resetPasswordError) {
        router.push("/login");
      }
    } catch (error) {console.log(error)}
  };

  useEffect(() => {
    if (typeof resetPasswordError === "string") {
      toast.error(resetPasswordError, {
        duration: 4000,
      });
      dispatch(clearResetPasswordError()); // clear after showing
    }
  }, [resetPasswordError, dispatch]);

  return (
    <Redirect>

      <ResetPasswordForm
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handelReset={handelLogin}
        resetLoading={resetPasswordLoading}
      />
    </Redirect>
  );
};

export default ResetPasswordPage;
