import React, { useRef } from "react";
import { IconTrash } from "@tabler/icons-react";

interface Props {
  coverImg: string | null;
  setCoverImg: (url: string | null) => void;
}

const AddThumbnail: React.FC<Props> = ({ coverImg, setCoverImg }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImage = (file: File | undefined) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleImage(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    handleImage(file);
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
          coverImg ? "h-[28vw] p-1" : "h-[10vw] items-center justify-center"
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {coverImg ? (
          <>
            <img
              src={coverImg}
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
          coverImg ? "h-auto p-1" : "h-[15vh] flex items-center justify-center"
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {coverImg ? (
          <>
            <img
              src={coverImg}
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
