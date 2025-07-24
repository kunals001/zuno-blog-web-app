import React, { useRef, useState, useEffect } from "react";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";

interface Props {
  coverImg: File | null;
  setCoverImg: (file: File | null) => void;
}

const AddThumbnail: React.FC<Props> = ({ coverImg, setCoverImg }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (coverImg) {
      const url = URL.createObjectURL(coverImg);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url); // cleanup
      };
    } else {
      setPreviewUrl(null);
    }
  }, [coverImg]);

  const handleFile = (file?: File) => {
    if (file && file.type.startsWith("image/")) {
      setCoverImg(file); // ✅ store the File
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCoverImg(null);
  };

  return (
    <div className="w-full mt-[3vh]">
      {/* Desktop */}
      <div
        className={`relative hidden md:flex overflow-hidden transition-all duration-500 ease-in-out cursor-pointer border-3 border-dashed border-prime rounded-xl bg-zinc-200 dark:bg-zinc-700 hover:bg-indigo-50 dark:hover:bg-zinc-600 ${
          previewUrl ? "h-[28vw] p-1" : "h-[10vw] items-center justify-center"
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {previewUrl ? (
          <>
            <Image
              width={1200}
              height={720}
              loading="eager"
              priority
              src={previewUrl}
              alt="Thumbnail"
              className="w-full max-h-[28vw] object-contain rounded-lg"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-zinc-100 dark:bg-zinc-600 text-red-400 rounded-full shadow-md p-1 hover:bg-red-100"
            >
              <IconTrash className=" md:size-[2vw] size-[3vh]" />
            </button>
          </>
        ) : (
          <p className="text-prime font-medium text-center px-3 text-[3vh] w-full">
            Drag & Drop thumbnail here
          </p>
        )}
      </div>

      {/* Mobile */}
      <div
        className={`relative md:hidden overflow-hidden transition-all duration-500 ease-in-out cursor-pointer border-2 border-dashed border-prime rounded-xl bg-zinc-200 dark:bg-zinc-700 ${
          previewUrl ? "h-auto p-1" : "h-[15vh] flex items-center justify-center"
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {previewUrl ? (
          <>
            <Image
              width={1200}
              height={720}
              loading="eager"
              priority
              src={previewUrl}
              alt="Thumbnail"
              className={`w-full max-h-[27vh] object-contain rounded-lg`}
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-zinc-100 dark:bg-zinc-600 text-red-400 rounded-full shadow-md p-1 hover:bg-red-100"
            >
              <IconTrash className=" md:size-[2vw] size-[3vh]" />
            </button>
          </>
        ) : (
          <p className="text-prime font-medium text-center px-3 text-[2.2vh]">
            Tap to select thumbnail
          </p>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default AddThumbnail;
