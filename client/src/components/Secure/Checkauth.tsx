"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { checkAuth, setAccessToken } from "@/redux/slices/userSlice";
import { useEffect } from "react";
import { getToken } from "@/lib/tokenService";
import { Loader } from "lucide-react";

export const CheckUser = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { isCheckingAuth } = useAppSelector((state) => state.user);

  useEffect(() => {
    const token = getToken(); 
    if (token) {
      dispatch(setAccessToken(token)); 
    }

    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingAuth) {
    return (
        <div className="w-full h-screen flex items-center justify-center"><Loader className="animate-spin md:size-[3vw] size-[3vh] text-[#0ABAB5]" /></div>
    );
  }

  return <>{children}</>;
};
