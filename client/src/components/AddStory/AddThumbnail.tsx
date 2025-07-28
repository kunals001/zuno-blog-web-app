import React, { useRef, useState, useEffect } from "react";
import { IconAlt, IconTrash, IconX } from "@tabler/icons-react";
import Image from "next/image";

interface Props {
  coverImg: File | null;
  setCoverImg: (file: File | null) => void;
  setAltText: React.Dispatch<React.SetStateAction<string>>;
  altText: string;
}

const AddThumbnail: React.FC<Props> = ({
  coverImg,
  setCoverImg,
  setAltText,
  altText,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showAltEditor, setShowAltEditor] = useState(false);
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
      setCoverImg(file);
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

const AltEditorOverlay = (
  showAltEditor && (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setShowAltEditor(false);
      }}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl transition-all duration-300"
      >
        <button
          onClick={() => setShowAltEditor(false)}
          className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition-colors duration-200"
          aria-label="Close"
        >
         <IconX className="md:size-[1.5vw] size-[2vh] text-zinc-500 dark:text-zinc-200"/>
        </button>
        <h2 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
          Add Alt Text
        </h2>
        <input
          type="text"
          value={altText}
          placeholder="Enter alt text..."
          onChange={(e) => setAltText(e.target.value)}
          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-2 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-prime"
        />
      </div>
    </div>
  )
);


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
            {AltEditorOverlay}

            {/* Edit icon button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAltEditor(true);
              }}
              className="absolute top-2 left-2 bg-white/80 dark:bg-zinc-700/80 backdrop-blur-sm border border-zinc-300 dark:border-zinc-600 rounded-full p-1 hover:scale-105 transition"
            >
              <IconAlt className="size-[2vw] text-zinc-500 dark:text-zinc-200" />
            </button>

            <Image
              width={1200}
              height={2000}
              loading="lazy"
              src={previewUrl}
              alt="Thumbnail"
              className="w-full max-h-[28vw] object-contain rounded-lg"
            />

            <button
              type="button"
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
          previewUrl
            ? "h-auto p-1"
            : "h-[15vh] flex items-center justify-center"
        }`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {previewUrl ? (
          <>
            {AltEditorOverlay}

            {/* Edit icon button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAltEditor(true);
              }}
              className="absolute top-2 left-2 bg-white/80 dark:bg-zinc-700/80 backdrop-blur-sm border border-zinc-300 dark:border-zinc-600 rounded-full p-1 hover:scale-105 transition"
            >
              <IconAlt className="size-[3vh] text-zinc-500 dark:text-zinc-200" />
            </button>

            <Image
              width={1200}
              height={720}
              loading="lazy"
              src={previewUrl}
              alt="Thumbnail"
              className="w-full max-h-[27vh] object-contain rounded-lg"
            />

            <button
              type="button"
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
