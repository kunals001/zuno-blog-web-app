import React, { useState } from "react";
import dynamic from "next/dynamic";
import Skeleton from "../Layouts/Skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { updateUser } from "@/redux/slices/userSlice";

const UploadPic = dynamic(() => import("./UploadPic"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-[10vh] h-[10vh]"}
      height={"md:w-[6vw] md:h-[6vw]"}
      animation="shimmer"
      rounded="rounded-full"
      className="mx-auto md:mx-0"
    />
  ),
});

const BioAndLinks = dynamic(() => import("./BioAndLinks"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-full"}
      height={"h-[10vh] md:h-[10vw]"}
      animation="shimmer"
      rounded="rounded-xl"
      className="mt-2"
    />
  ),
});

const ProfilePage = () => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [socialLinks, setSocialLinks] = useState<string[] | null>(null);


  return (
    <div className="md:px-[9vw] md:py-[1vw] w-full">
      <form className="w-full">
        <UploadPic setProfilePic={setProfilePic} />
        <BioAndLinks setBio={setBio} setSocialLinks={setSocialLinks} />
      </form>
    </div>
  );
};

export default ProfilePage;
