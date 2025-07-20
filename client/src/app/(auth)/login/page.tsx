"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      if (!loginError) {
        router.push("/");
      }
    } catch (error) {}
  };

  return (
    <div>
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handelLogin={handelLogin}
        loginLoading={loginLoading}
        loginError={loginError}
      />
    </div>
  );
};

export default Login;
