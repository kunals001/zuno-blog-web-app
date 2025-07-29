"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { clearLoginError } from "@/redux/slices/userSlice";
import { Redirect } from "@/components/Secure/Redirect";
import {toast} from "react-hot-toast";


const LoginForm = dynamic(() => import("@/components/AuthForms/LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
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

    useEffect(() => {
    if (typeof loginError === "string") {
      toast.error(loginError, {
        duration: 4000,
      });
      dispatch(clearLoginError()); 
    }
  }, [loginError, dispatch]);

  return (
    <Redirect>
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
