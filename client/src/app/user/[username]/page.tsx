"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearGetUserError, getUserByUsername } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";

const UserByUsername = () => {
  const dispatch = useAppDispatch();
  const params = useParams();

  const { getUser, getUserError } = useAppSelector((state) => state.user);

  const username = params.username as string;

  console.log(getUser);

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
    <div className="w-full min-h-screen md:px-[10vw] px-[1vh] mt-2">
      <h1 className="md:text-[2vw] text-[3.5vh] font-prime font-[700] text-zinc-700 text-center pb-3">
        {getUser?.username}
      </h1>
    </div>
  );
};

export default UserByUsername;
