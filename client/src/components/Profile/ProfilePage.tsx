import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import Skeleton from '../Layouts/Skeleton'

const UploadPic = dynamic(() => import("./UploadPic"), {
  ssr: false, loading: () => <Skeleton width={"w-[10vh] h-[10vh]"} height={"md:w-[6vw] md:h-[6vw]"} animation="shimmer" rounded='rounded-full' className='mx-auto md:mx-0' />
})

const ProfilePage = () => {

  const [profilePic, setProfilePic] = useState<File | null>(null);

  return (
    <div className='md:px-[9vw] md:py-[1vw]'>
      <UploadPic profilePic={profilePic} setProfilePic={setProfilePic} />
    </div>
  )
}

export default ProfilePage