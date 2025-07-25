import React, { useRef, useState, useEffect } from "react";
import ErrorToast from "../Layouts/ErrorLayout";

interface UploadPicProps {
  profilePic: File | null;
  setProfilePic: (file: File | null) => void;
}

const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const UploadPic: React.FC<UploadPicProps> = ({ profilePic, setProfilePic }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



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

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0 file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {error && <ErrorToast message={error} />}

      {preview && (
        <div className="relative w-32 h-32 mt-2">
          <img
            src={preview}
            alt="Profile preview"
            className="w-full h-full object-cover rounded-full border"
          />
          <button
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadPic;
