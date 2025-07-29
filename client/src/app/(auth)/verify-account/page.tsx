"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearVerifyError, verifyEmail } from "@/redux/slices/userSlice";
import { Redirect } from "@/components/Secure/Redirect";
import { toast } from "react-hot-toast";

const VerifyForm = dynamic(() => import("@/components/AuthForms/VerifyForm"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
    </div>
  ),
});

const OnBoardingForm = dynamic(
  () => import("@/components/AuthForms/OnBoardingForm"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" />
      </div>
    ),
  }
);

const Verify = () => {
  const dispatch = useAppDispatch();
  const { verifyLoding, verifyError } = useAppSelector((state) => state.user);
  const [code, setCode] = useState("");

  const [submited, setSubmited] = useState(false);

  const handelVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await dispatch(verifyEmail({ code })).unwrap();
      if (!verifyError) {
        setSubmited(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (typeof verifyError === "string") {
      toast.error(verifyError, {
        duration: 4000,
      });
      dispatch(clearVerifyError()); // clear after showing
    }
  }, [verifyError, dispatch]);

  return (
    <Redirect>

      {submited ? (
        <OnBoardingForm />
      ) : (
        <VerifyForm
          code={code}
          setCode={setCode}
          handelVerify={handelVerify}
          verifyLoading={verifyLoding}
        />
      )}
    </Redirect>
  );
};

export default Verify;
