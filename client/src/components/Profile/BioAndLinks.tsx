import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  IconPencil,
  IconTrash,
  IconPlus,
  IconChevronDown,
  IconChevronUp,
} from "@tabler/icons-react";

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
  const [showFullBio, setShowFullBio] = useState(false);
  const [needsShowMore, setNeedsShowMore] = useState(false);

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

  const checkIfNeedsShowMore = useCallback(() => {
    const el = bioRef.current;
    if (el && !editingBio) {
      const isMobile = window.innerWidth < 768;
      const maxHeight = isMobile ? window.innerHeight * 0.15 : window.innerWidth * 0.1;

      const originalHeight = el.style.height;
      el.style.height = "auto";
      const contentHeight = el.scrollHeight;
      el.style.height = originalHeight;

      setNeedsShowMore(contentHeight > maxHeight);
    }
  }, [editingBio]);

  const adjustHeight = useCallback(() => {
    const el = bioRef.current;
    if (el) {
      if (editingBio) {
        el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      } else {
        const isMobile = window.innerWidth < 768;
        const maxHeight = isMobile ? window.innerHeight * 0.15 : window.innerWidth * 0.1;

        el.style.height = "auto";
        const contentHeight = el.scrollHeight;
        el.style.height = showFullBio
          ? contentHeight + "px"
          : contentHeight > maxHeight
          ? maxHeight + "px"
          : contentHeight + "px";
      }
    }
  }, [editingBio, showFullBio]);

  useEffect(() => {
    adjustHeight();
    checkIfNeedsShowMore();
  }, [bioInput, showFullBio, editingBio, adjustHeight, checkIfNeedsShowMore]);

  useEffect(() => {
    const handleResize = () => {
      adjustHeight();
      checkIfNeedsShowMore();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight, checkIfNeedsShowMore]);

  return (
    <div className="w-full mt-2">
      {/* BIO */}
      <div className="w-full relative bg-zinc-300 dark:bg-zinc-700 p-[1vh] md:p-[1vw] rounded-lg">
        <textarea
          ref={bioRef}
          value={bioInput}
          onChange={(e) => editingBio && handleBioChange(e.target.value)}
          placeholder="Write a short bio..."
          readOnly={!editingBio}
          maxLength={160}
          className="w-[90vw] md:w-[30vw] outline-none md:p-[0vw] p-[1vh] rounded-lg bg-transparent scrollbar-hide text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200 resize-none placeholder:text-zinc-400 dark:placeholder:text-zinc-500 transition ease-in-out duration-200 overflow-hidden"
        />

        {needsShowMore && !editingBio && (
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={() => setShowFullBio(!showFullBio)}
              className="flex items-center gap-1 text-[1.3vh] md:text-[0.8vw] text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition ease-in-out duration-200"
            >
              {showFullBio ? (
                <>
                  Show Less <IconChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  Show More <IconChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        <div
          onClick={() => setEditingBio(true)}
          className="absolute top-6 md:top-8 right-[1vh] translate-y-[-50%]"
        >
          <IconPencil className="text-zinc-700 dark:text-zinc-200 md:p-[.5vw] md:size-[2.5vw] size-[3.5vh] p-[.5vh] bg-zinc-200 dark:bg-zinc-600 rounded-full hover:bg-prime hover:text-zinc-200 transition ease-in-out duration-200 cursor-pointer" />
        </div>
      </div>

      {/* LINKS */}
      <div className="w-full relative mt-2 bg-zinc-300 dark:bg-zinc-700 p-[1vh] md:p-[1vw] rounded-lg">
        <div className="flex flex-wrap gap-2 text-[1.5vh] md:text-[1vw] text-zinc-700 dark:text-zinc-200">
          {links.length > 0 ? (
            links.map((link, i) => {
              let hostname = link;
              try {
                const urlObj = new URL(
                  link.startsWith("http") ? link : "https://" + link
                );
                hostname = urlObj.hostname.replace("www.", "");
              } catch {
                hostname = link;
              }

              return (
                <a
                  key={i}
                  href={link.startsWith("http") ? link : "https://" + link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition md:py-1 py-[1.2vh]"
                >
                  {hostname}
                </a>
              );
            })
          ) : (
            <p className="text-zinc-400 dark:text-zinc-500 md:py-2 py-[1.2vh]">
              Add social links...
            </p>
          )}
        </div>

        <div
          onClick={() => setEditingLinks(true)}
          className="absolute top-6 md:top-8 right-[1vh] translate-y-[-50%]"
        >
          <IconPencil className="text-zinc-700 dark:text-zinc-200 md:p-[.5vw] md:size-[2.5vw] size-[3.5vh] p-[.5vh] bg-zinc-200 dark:bg-zinc-600 rounded-full hover:bg-prime hover:text-zinc-200 transition ease-in-out duration-200 cursor-pointer" />
        </div>

        {editingLinks && (
          <div className="fixed inset-0 z-[999] bg-black/60 flex justify-center items-center scrollbar-hide">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl w-[90vw] md:w-[30vw]">
              <h3 className="text-lg font-bold mb-4 text-zinc-700 dark:text-zinc-200">
                Edit Social Links
              </h3>

              <div className="flex flex-col gap-2 mb-4 max-h-[40vh] overflow-y-auto scrollbar-hide">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between gap-2"
                  >
                    <input
                      readOnly
                      value={link}
                      className="flex-1 p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-sm text-zinc-900 scrollbar-hide dark:text-zinc-100"
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
