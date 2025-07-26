"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";
import { clearRegisterError } from "@/redux/slices/userSlice";
import { Redirect } from "@/components/Secure/Redirect";

const ErrorToast = dynamic(() => import("@/components/Layouts/ErrorLayout"), {
  ssr: false,
});

const SignupForm = dynamic(() => import("@/components/AuthForms/SignupForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
    </div>
  ),
});

const Signup = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { signupLoading, registerError } = useAppSelector(
    (state) => state.user
  );

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handelSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(registerUser({ name, email, password ,username})).unwrap();
      if (!registerError) {
        router.push("/verify-account");
      }
    } catch (error) {console.log(error)}
  };

  return (
    <Redirect>
      {typeof registerError === "string" && (
        <ErrorToast
          message={registerError}
          duration={4000}
          onClose={() => dispatch(clearRegisterError())}
        />
      )}

      <SignupForm
        username={username}
        setUsername={setUsername}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handelSignup={handelSignup}
        signupLoading={signupLoading}
      />
    </Redirect>
  );
};

export default Signup;
