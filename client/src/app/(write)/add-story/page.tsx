"use client"
import Skeleton from '@/components/Layouts/Skeleton'
import dynamic from 'next/dynamic'


const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), { ssr: false,
  loading: () => <Skeleton width={"w-full"} height={"h-[7vh] md:h-[4vw]"} animation="shimmer" />,
})

const AddStory = () => {
  return (
    <div className='min-h-screen w-full bg-zinc-200 dark:bg-zinc-800'>
      <Navbar />
      <div className="md:px-[10vw] px-[1vh] md:py-[1vw] py-[1vh]">
        
      </div>
    </div>
  )
}

export default AddStory