import React from "react";
import dynamic from "next/dynamic";

const AddThumbnail = dynamic(() => import("./AddThumbnail"), {
  ssr: false,
});

const AddTitle = dynamic(() => import("./AddTitle"), {
  ssr: false,
});

const Scoring = dynamic(() => import("./Scoring"), {
  ssr: false,
});

const CombineAll = () => {

  const [Title, setTitle] = React.useState<string | null>(null);
  const [coverImg, setCoverImg] = React.useState<string | null>(null);

  return (
    <div className="md:px-[10vw] px-[1vh] md:py-[1vw] py-[1vh] mt-[2vh] w-full flex md:flex-row flex-col items-center justify-between">
      <div className="w-full md:w-[58vw]">
        <AddTitle Title={Title} setTitle={setTitle}/>
        <AddThumbnail coverImg={coverImg} setCoverImg={setCoverImg}/>
      </div>

      <div className="w-full md:w-[20vw] flex items-center flex-col justify-start">
        <Scoring/>
      </div>
    </div>
  );
};

export default CombineAll;
