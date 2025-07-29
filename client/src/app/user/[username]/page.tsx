"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearGetUserError, getUserByUsername } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";
import Skeleton from "@/components/Layouts/Skeleton";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-full md:w-[80vw]"}
      height={"h-[7vh] md:h-[4vw]"}
      animation="shimmer"
      rounded="rounded-xl"
    />
  ),
});

const UserByUsername = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const { getUser, getUserError } = useAppSelector((state) => state.user);

  console.log(getUser);

  const username = params.username as string;

  useEffect(() => {
    dispatch(getUserByUsername(username));
  }, [dispatch, username]);

  useEffect(() => {
    if (typeof getUserError === "string") {
      toast.error(getUserError, {
        duration: 4000,
      });
      dispatch(clearGetUserError());
    }
  }, [getUserError, dispatch]);

  return (
    <div className="w-full min-h-screen bg-zinc-200 dark:bg-zinc-800">
      <Navbar />
      <div className="md:px-[10vw] px-[1vh] mt-2">

      </div>
    </div>
  );
};

export default UserByUsername;
