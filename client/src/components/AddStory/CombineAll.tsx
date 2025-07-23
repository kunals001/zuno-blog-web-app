import React, { useState } from "react";
import dynamic from "next/dynamic";

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

const Scoring = dynamic(() => import("./Scoring"), {
  ssr: false,
});

const CombineAll = () => {
  const [Title, setTitle] = useState<string | null>(null);
  const [coverImg, setCoverImg] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);

  return (
    <div className="md:px-[10vw] px-[1vh] md:py-[1vw] py-[1vh] mt-[2vh] w-full ">
      <form className="flex md:flex-row flex-col items-center justify-between ">
        <div className="w-full md:w-[58vw]">
          <AddTitle Title={Title} setTitle={setTitle} />
          <AddThumbnail coverImg={coverImg} setCoverImg={setCoverImg} />
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
        </div>

        <div className="w-full md:w-[20vw] flex items-center flex-col md:sticky">
          <Scoring />
        </div>
      </form>
    </div>
  );
};

export default CombineAll;
