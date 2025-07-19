"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";

const LoginForm = dynamic(() => import("@/components/AuthForms/LoginForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
    </div>
  ),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div>
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
    </div>
  );
};

export default Login;
