"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { clearLoginError } from "@/redux/slices/userSlice";
import { Redirect } from "@/components/Secure/Redirect";

const ErrorToast = dynamic(() => import("@/components/Layouts/ErrorLayout"), {
  ssr: false,
});

const LoginForm = dynamic(() => import("@/components/AuthForms/LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
    </div>
  ),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { loginLoading, loginError } = useAppSelector((state) => state.user);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handelLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ identifier, password })).unwrap();
      if (!loginError) {
        router.push("/");
      }
    } catch (error) {console.log(error)}
  };

  return (
    <Redirect>
      {typeof loginError === "string" && (
        <ErrorToast
          message={loginError}
          duration={4000}
          onClose={() => dispatch(clearLoginError())}
        />
      )}

      <LoginForm
        identifier={identifier}
        setIdentifier={setIdentifier}
        password={password}
        setPassword={setPassword}
        handelLogin={handelLogin}
        loginLoading={loginLoading}
      />
    </Redirect>
  );
};

export default Login;
