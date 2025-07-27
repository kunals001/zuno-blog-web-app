import React, { useState } from 'react'
import AuthLayout from "../Layouts/AuthLayout";
import dynamic from 'next/dynamic';

const ErrorToast = dynamic(() => import("@/components/Layouts/ErrorLayout"), {
    ssr: false,
})

const UploadPic = dynamic(() => import("../Profile/UploadPic"), {
    ssr: false,
})

const OnBoardingForm = () => {

    const [profilePic, setProfilePic] = useState<File | null>(null)
    const [bio, setBio] = useState<string | null>(null)

    const handelBoarding = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    }

  return (
    <AuthLayout>
        <div className="w-full md:w-[25vw] px-[2vh] mx:px-0 flex items-center justify-center md:py-[2vw] md:rounded-lg md:bg-[#c2f6f4] slide-up">
        <form
          onSubmit={handelBoarding}
          className="md:w-[25vw] w-full flex flex-col gap-[1vh] md:gap-[.5vw]"
        >

            <UploadPic setProfilePic={setProfilePic} />

            <textarea 
            placeholder="Write a short bio..."
            rows={5}
            onChange={(e) => setBio(e.target.value)}
            className="
            w-full
            rounded-xl
            border-2
            border-zinc-400 dark:border-zinc-600
            bg-zinc-200 dark:bg-zinc-800
            text-zinc-800 dark:text-zinc-100
            placeholder:text-zinc-400 dark:placeholder:text-zinc-500
            outline-none
            p-4
            text-[1rem] md:text-[1vw]
            transition resize-none overflow-y-scroll md:h-[12vw] h-[20vh] scrollbar-hide
          "
            />

          
        </form>
      </div>
    </AuthLayout>
  )
}

export default OnBoardingForm