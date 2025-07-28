import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/redux/hooks";
import { useAppSelector } from "@/redux/hooks";
import { clearCreateError } from "@/redux/slices/postSlice";
import { createPost } from "@/redux/slices/postSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const AddThumbnail = dynamic(() => import("./AddThumbnail"), {
  ssr: false,
});

const AddTitle = dynamic(() => import("./AddTitle"), {
  ssr: false,
});

const AddDiscription = dynamic(() => import("./AddDiscription"), {
  ssr: false,
});

const TagInput = dynamic(() => import("./AddTagesAndKeyword"), {
  ssr: false,
});

const AddContent = dynamic(() => import("../Layouts/StoryEditor"), {
  ssr: false,
});

const Scoring = dynamic(() => import("./Scoring"), {
  ssr: false,
});

const CombineAll = () => {
  const [title, setTitle] = useState<string>("");
  const [coverImage, setCoverImgage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [altText, setAltText] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");

  const dispatch = useAppDispatch();
  const { createError, createloading } = useAppSelector((state) => state.post);
  const router = useRouter();

  const handelAddPost = async (e: React.FormEvent) => {
    e.preventDefault();

    // No frontend validation - Let backend handle everything
    const postData = {
      title,
      description,
      tags,
      altText,
      category,
      status,
      keywords,
      content,
      coverImage,
    };

    console.log("Sending data to backend:", postData);
    
    try {
      await dispatch(createPost(postData)).unwrap();
      toast.success("Story created successfully", {
        duration: 2000,
      });
      router.push("/profile/?tab=user-profile");
    } catch (err) {
      console.log("Backend error received:", err);
      // Error will be automatically handled by useEffect below
    }
  };

  useEffect(() => {
    if (typeof createError === "string") {
      toast.error(createError, {
        duration: 4000,
      });
      dispatch(clearCreateError());
    }
  }, [createError, dispatch]);

  return (
    <div className="md:px-[10vw] px-[1vh] md:py-[1vw] py-[1vh] mt-[2vh] w-full ">
      <form
        onSubmit={handelAddPost}
        className="flex md:flex-row flex-col justify-between "
      >
        <div className="w-full md:w-[58vw]">
          <AddTitle Title={title} setTitle={setTitle} />
          <AddThumbnail
            altText={altText}
            setAltText={setAltText}
            coverImg={coverImage}
            setCoverImg={setCoverImgage}
          />
          <AddDiscription
            description={description}
            setDescription={setDescription}
          />
          <TagInput items={tags} setItems={setTags} placeholder="Add tags..." />
          <TagInput
            items={keywords}
            setItems={setKeywords}
            placeholder="Add keywords..."
          />
          <AddContent content={content} setContent={setContent} />
        </div>

        <div className="w-full md:w-[20vw] flex flex-col gap-[1vh] md:pt-[3.5vw]">
          <Scoring
            createloading={createloading}
            category={category}
            setCategory={setCategory}
            setStatus={setStatus}
          />
        </div>
      </form>
    </div>
  );
};

export default CombineAll;