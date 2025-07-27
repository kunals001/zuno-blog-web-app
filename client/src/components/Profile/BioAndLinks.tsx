import React, { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { IconPencil, IconTrash, IconPlus } from "@tabler/icons-react";

interface Props {
  setBio: React.Dispatch<React.SetStateAction<string | null>>;
  setSocialLinks: React.Dispatch<React.SetStateAction<string[] | null>>;
}

const BioAndLinks = ({ setBio, setSocialLinks }: Props) => {
  const { user } = useAppSelector((state) => state.user);

  const [editingBio, setEditingBio] = useState(false);
  const [editingLinks, setEditingLinks] = useState(false);
  const [bioInput, setBioInput] = useState(user?.bio || "");
  const [links, setLinks] = useState<string[]>(user?.socialLinks || []);
  const [newLink, setNewLink] = useState("");

  const bioRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editingBio && bioRef.current) {
      bioRef.current.focus();
      bioRef.current.select();
    }
  }, [editingBio]);

  const handleAddLink = () => {
    const trimmed = newLink.trim();
    if (trimmed && links.length < 5 && !links.includes(trimmed)) {
      const updated = [...links, trimmed];
      setLinks(updated);
      setSocialLinks(updated);
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
    setSocialLinks(updated);
  };

  const handleBioChange = (val: string) => {
    setBioInput(val);
    setBio(val);
  };

  return (
    <div className="w-full mt-2">
      {/* BIO */}
      <div className="w-full relative bg-zinc-300 p-[1vh] md:p-[1vw] rounded-lg">
        <textarea
          ref={bioRef}
          value={bioInput}
          onChange={(e) => editingBio && handleBioChange(e.target.value)}
          placeholder="Write a short bio..."
          readOnly={!editingBio}
          maxLength={160}
          className="w-[80vw] md:w-[20vw] outline-none md:p-[0vw] p-[1vh] rounded-lg bg-transparent scrollbar-hide text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200 resize-none "
        />
        <div
          onClick={() => setEditingBio(true)}
          className="absolute top-[30%] right-[1vh] translate-y-[-50%]"
        >
          <IconPencil className="text-zinc-700 dark:text-zinc-200 md:p-[.5vw] md:size-[2.5vw] size-[3.5vh] p-[.5vh] bg-zinc-200 dark:bg-zinc-600 rounded-full hover:bg-prime hover:text-zinc-200 transition ease-in-out duration-200 cursor-pointer" />
        </div>
      </div>

      {/* LINKS */}
      <div className="w-full relative mt-2 bg-zinc-300 p-[1vh] md:p-[1vw] rounded-lg">
        <input
          readOnly
          value={links.join(", ")}
          placeholder="Add social links..."
          className="w-[80vw] md:w-[20vw] outline-none md:p-[.3vw] p-[1vh] rounded-lg bg-transparent scrollbar-hide text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200"
        />
        <div
          onClick={() => setEditingLinks(true)}
          className="absolute top-[40%] right-[1vh] translate-y-[-50%]"
        >
          <IconPencil className="text-zinc-700 dark:text-zinc-200 md:p-[.5vw] md:size-[2.5vw] size-[3.5vh] p-[.5vh] bg-zinc-200 dark:bg-zinc-600 rounded-full hover:bg-prime hover:text-zinc-200 transition ease-in-out duration-200 cursor-pointer" />
        </div>

        {editingLinks && (
          <div className="fixed inset-0 z-[999] bg-black/60 flex justify-center items-center">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-[90vw] md:w-[30vw]">
              <h3 className="text-lg font-bold mb-4 text-zinc-700 dark:text-zinc-200">
                Edit Social Links
              </h3>

              <div className="flex flex-col gap-2 mb-4 max-h-[40vh] overflow-y-auto">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center justify-between gap-2">
                    <input
                      readOnly
                      value={link}
                      className="flex-1 p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-sm text-zinc-900 dark:text-zinc-100"
                    />
                    <IconTrash
                      onClick={() => handleRemoveLink(index)}
                      className="cursor-pointer text-red-500 hover:scale-110 transition"
                    />
                  </div>
                ))}
              </div>

              {links.length < 5 && (
                <div className="flex items-center gap-2 mb-4">
                  <input
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="Add new link..."
                    className="flex-1 p-2 rounded-lg bg-zinc-100 dark:bg-zinc-600 text-sm outline-none text-zinc-800 dark:text-zinc-100"
                  />
                  <IconPlus
                    onClick={handleAddLink}
                    className="text-green-500 cursor-pointer hover:scale-110 transition"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingLinks(false)}
                  className="text-sm px-4 py-1.5 rounded-md bg-zinc-300 dark:bg-zinc-700 text-zinc-800 dark:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BioAndLinks;
