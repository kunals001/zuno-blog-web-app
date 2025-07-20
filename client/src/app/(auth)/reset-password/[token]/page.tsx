"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  clearResetPasswordError,
  resetPassword,
} from "@/redux/slices/userSlice";
import { useRouter,useParams } from "next/navigation";

const ErrorToast = dynamic(() => import("@/components/Layouts/ErrorLayout"), {
  ssr: false,
});

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
    } catch (error) {}
  };

  return (
    <div>
      {typeof resetPasswordError === "string" && (
        <ErrorToast
          message={resetPasswordError}
          duration={4000}
          onClose={() => dispatch(clearResetPasswordError())}
        />
      )}

      <ResetPasswordForm
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        handelReset={handelLogin}
        resetLoading={resetPasswordLoading}
      />
    </div>
  );
};

export default ResetPasswordPage;
