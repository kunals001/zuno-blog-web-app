"use client"
import Skeleton from '@/components/Layouts/Skeleton'
import dynamic from 'next/dynamic'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { logoutUser } from '@/redux/slices/userSlice'


const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), { ssr: false,
  loading: () => <Skeleton width={"w-full"} height={"h-[7vh] md:h-[4vw]"} animation="shimmer" />,
})

const Home = () => {

  const dispatch = useAppDispatch();

  const { user, accessToken } = useAppSelector((state) => state.user);

  console.log(user, accessToken);

  const handelLogout = async() => {
    await dispatch(logoutUser()).unwrap();
  }

  return (
    <main className='min-h-screen w-full bg-zinc-200 dark:bg-zinc-800'>
      <Navbar/>

      <div className="">
        <button onClick={handelLogout}>Logout</button>
      </div>
    </main>
  )
}

export default Home