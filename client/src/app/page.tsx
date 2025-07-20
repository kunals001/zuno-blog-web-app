"use client"
import Skeleton from '@/components/Layouts/Skeleton'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/redux/hooks'


const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), { ssr: false,
  loading: () => <Skeleton width={"w-full"} height={"h-[5vh] md:h-[4vw]"} animation="shimmer" />,
})

const Home = () => {

  return (
    <main className='min-h-screen w-full bg-zinc-200 dark:bg-zinc-800'>
      <Navbar/>
    </main>
  )
}

export default Home