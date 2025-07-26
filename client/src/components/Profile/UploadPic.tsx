import React, { useRef, useState, useEffect } from "react";
import ErrorToast from "../Layouts/ErrorLayout";
import Skeleton from "../Layouts/Skeleton";
import dynamic from "next/dynamic";
import { IconCamera, IconTrash } from "@tabler/icons-react";
import { useAppSelector } from "@/redux/hooks";

const UserFriends = dynamic(() => import("./UserFriends"), {
  ssr: false, loading: () => <Skeleton width={"w-full md:w-[25vw]"} height={"h-[10vh] md:h-[5vw]"} animation="shimmer" rounded='rounded-xl' />,
});



interface UploadPicProps {
  setProfilePic: (file: File | null) => void;
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const UploadPic: React.FC<UploadPicProps> = ({ setProfilePic }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAppSelector((state) => state.user.user);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setError("Only JPG, PNG, WEBP, or AVIF files are allowed.");
      setProfilePic(null);
      setPreview(null);
      return;
    }

    setError(null);
    setProfilePic(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setProfilePic(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Revoke preview when file changes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 w-full md:items-start items-center">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />

      {/* Profile Picture with Camera Icon */}
      <div className="relative md:w-[6vw] md:h-[6vw] w-[10vh] h-[10vh]">
        <img
          src={preview || user?.profilePic}
          alt="Profile preview"
          className="w-full h-full object-cover rounded-full border-2 border-prime shadow"
        />

        <button
          type="button"
          onClick={openFilePicker}
          className="absolute bottom-1 right-1 bg-prime  p-1 rounded-full shadow cursor-pointer"
        >
          <IconCamera className="md:size-[2vw] size-[2.3vh] text-white" />
        </button>

        {preview && (
          <button
            onClick={handleRemove}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-200 text-red-300 dark:bg-zinc-600 text-xs px-1 py-0.5 rounded-full"
            title="Remove"
          >
            <IconTrash className="md:size-[1.5vw] size-[2vh]" />
          </button>
        )}
      </div>


      <div className="flex items-center justify-center w-full md:w-[25vw]">
        <UserFriends />
      </div>

      {error && <ErrorToast message={error} />}
    </div>
  );
};

export default UploadPic;
