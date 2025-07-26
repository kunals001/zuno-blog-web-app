import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/redux/hooks";
import { createPost } from "@/redux/slices/postSlice";
import { useRouter } from "next/navigation";

import ErrorToast from "../Layouts/ErrorLayout";

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
  const [title, setTitle] = useState<string | null>(null);
  const [coverImage, setCoverImgage] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [content, setContent] = useState<string>("");

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handelAddPost = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !coverImage || !content || !category) {
      <ErrorToast message="All fields are required" />;
      return;
    }

    const postData = {
      title,
      description,
      tags,
      category,
      status,
      keywords,
      content,
      coverImage,
    };

    console.log(postData);
    try {
      await dispatch(createPost(postData)).unwrap();
      router.push("/profile/?tab=user-profile");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="md:px-[10vw] px-[1vh] md:py-[1vw] py-[1vh] mt-[2vh] w-full ">
      <form
        onSubmit={handelAddPost}
        className="flex md:flex-row flex-col justify-between "
      >
        <div className="w-full md:w-[58vw]">
          <AddTitle Title={title} setTitle={setTitle} />
          <AddThumbnail coverImg={coverImage} setCoverImg={setCoverImgage} />
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
          <Scoring category={category} setCategory={setCategory} setStatus={setStatus}/>
        </div>
      </form>
    </div>
  );
};

export default CombineAll;
