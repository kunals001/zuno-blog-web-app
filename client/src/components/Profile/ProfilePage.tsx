import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Skeleton from "../Layouts/Skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUpdateUserError, updateUser } from "@/redux/slices/userSlice";
import { toast } from "react-hot-toast";

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
  const dispatch = useAppDispatch();
  const { user, updateUserLoading, updateUserError } = useAppSelector(
    (state) => state.user
  );

  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [bio, setBio] = useState<string | null>(user?.bio || null);
  const [socialLinks, setSocialLinks] = useState<string[] | null>(
    user?.socialLinks || null
  );

  const [updateSuccess, setUpdateSuccess] = useState(false);


  const [initialBio, setInitialBio] = useState<string | null>(
    user?.bio || null
  );
  const [initialLinks, setInitialLinks] = useState<string[] | null>(
    user?.socialLinks || null
  );

  useEffect(() => {
    if (user) {
      setInitialBio(user.bio || null);
      setInitialLinks(user.socialLinks || null);
    }
  }, [user]);

  const hasChanges =
    profilePic !== null ||
    bio !== initialBio ||
    JSON.stringify(socialLinks) !== JSON.stringify(initialLinks);

  const handleUpdateProfile = async () => {
    const payload: {
      profilePic?: File | null;
      bio?: string;
      socialLinks?: string;
    } = {};

    if (profilePic) payload.profilePic = profilePic;
    if (bio !== initialBio) payload.bio = bio ?? "";
    if (
      socialLinks &&
      JSON.stringify(socialLinks) !== JSON.stringify(initialLinks)
    ) {
      payload.socialLinks = JSON.stringify(socialLinks);
    }

    const updatedUser = await dispatch(updateUser(payload)).unwrap();
    setProfilePic(null);
    setInitialBio(updatedUser.bio || null);
    setBio(updatedUser.bio || null);
    setInitialLinks(updatedUser.socialLinks || null);
    setSocialLinks(updatedUser.socialLinks || null);

    setUpdateSuccess(true);
  };

  useEffect(() => {
    if (updateUserError) {
      toast.error(updateUserError);
      dispatch(clearUpdateUserError());
    }
  }, [updateUserError]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Profile updated successfully");
      setUpdateSuccess(false); // reset so it doesn't show again
    }
  }, [updateSuccess]);

  return (
    <div className="md:px-[9vw] md:py-[1vw] w-full">
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdateProfile();
        }}
      >
        <UploadPic setProfilePic={setProfilePic} />
        <BioAndLinks setBio={setBio} setSocialLinks={setSocialLinks} />
        {hasChanges && (
          <button
            type="submit"
            className="mt-4 px-6 py-2 bg-prime  text-white cursor-pointer rounded-xl self-end text-[2vh] md:text-[1vw] transition-all duration-500 ease-in-out hover:bg-prime/80"
          >
            {updateUserLoading ? "Updating..." : "Update Profile"}
          </button>
        )}
      </form>
    </div>
  );
};

export default ProfilePage;
