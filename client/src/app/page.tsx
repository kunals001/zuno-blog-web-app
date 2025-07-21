"use client"
import Skeleton from '@/components/Layouts/Skeleton'
import dynamic from 'next/dynamic'
import { useAppSelector } from '@/redux/hooks'


const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), { ssr: false,
  loading: () => <Skeleton width={"w-full"} height={"h-[7vh] md:h-[4vw]"} animation="shimmer" />,
})

const Home = () => {

  const { user, accessToken } = useAppSelector((state) => state.user);

  console.log(user, accessToken);

  return (
    <main className='min-h-screen w-full bg-zinc-200 dark:bg-zinc-800'>
      <Navbar/>
    </main>
  )
}

export default Home