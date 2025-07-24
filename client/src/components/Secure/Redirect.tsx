"use client";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const Redirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (user || isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router, user]);

  return <>{!isAuthenticated && children}</>;
};
