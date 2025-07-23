"use client"
import Skeleton from '@/components/Layouts/Skeleton'
import dynamic from 'next/dynamic'


const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), { ssr: false,
  loading: () => <Skeleton width={"w-full md:w-[80vw]"} height={"h-[7vh] md:h-[4vw]"} animation="shimmer" rounded='rounded-xl'/>,
})

const CombineAll = dynamic(() => import("@/components/AddStory/CombineAll"), { ssr: false,
  loading: () => <Skeleton width={"md:w-[80vw] w-[95vw]"} height={"h-[70vh] md:h-[40vw]"} animation="shimmer" rounded='rounded-xl' className='mt-[2vh]'/>,
})

const AddStory = () => {
  return (
    <div className='min-h-screen w-full bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center'>
      <Navbar />
      <CombineAll/>
    </div>
  )
}

export default AddStory