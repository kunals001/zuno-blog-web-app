"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { IconLoader } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearVerifyError, verifyEmail } from "@/redux/slices/userSlice";
import { useRouter } from "next/navigation";

const ErrorToast = dynamic(() => import("@/components/Layouts/ErrorLayout"), {
  ssr: false,
});

const VerifyForm = dynamic(() => import("@/components/AuthForms/VerifyForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <IconLoader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
    </div>
  ),
});

const Verify = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { verifyLoding, verifyError } = useAppSelector((state) => state.user);

  const [code, setCode] = useState("");

  const handelVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(verifyEmail({code})).unwrap();
      if (!verifyError) {
        router.push("/");
      }
    } catch (error) {console.log(error)}
  };

  return (
    <div>
      {typeof verifyError === "string" && (
        <ErrorToast
          message={verifyError}
          duration={4000}
          onClose={() => dispatch(clearVerifyError())}
        />
      )}

      <VerifyForm
       code={code}
        setCode={setCode}
        handelVerify={handelVerify}
        verifyLoading={verifyLoding}
      />
    </div>
  );
};

export default Verify;
