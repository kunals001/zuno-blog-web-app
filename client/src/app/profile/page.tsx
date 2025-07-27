"use client";
import Skeleton from "@/components/Layouts/Skeleton";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

const Navbar = dynamic(() => import("@/components/Navbar/Navbar"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-full md:w-[80vw]"}
      height={"h-[7vh] md:h-[4vw]"}
      animation="shimmer"
      rounded="rounded-xl"
    />
  ),
});

const ProfileSidebar = dynamic(
  () => import("@/components/Profile/ProfileSidebar"),
  {
    ssr: false,
    loading: () => (
      <Skeleton
        width={"w-full md:w-[14vw]"}
        height={"h-[20vh] md:h-[80vh]"}
        animation="shimmer"
        rounded="rounded-xl"
      />
    ),
  }
);

const ProfilePage = dynamic(() => import("@/components/Profile/ProfilePage"), {
  ssr: false,
  loading: () => (
    <Skeleton
      width={"w-full md:w-[64vw]"}
      height={"h-[20vh] md:h-[90vw]"}
      animation="shimmer"
      rounded="rounded-xl"
      className="md:ml-2"
    />
  ),
});

const Profile = () => {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <>
      <div className="min-h-screen w-full bg-zinc-200 dark:bg-zinc-800 flex flex-col items-center">
        <Navbar />
        <div className="md:px-[10vw] px-[1vh] md:py-[1vw] py-[1vh] flex md:flex-row flex-col-reverse w-full">
          <div className="md:block hidden">
            <ProfileSidebar />
          </div>

          <div className="w-full md:h-screen">
            {tab === "user-profile" && <ProfilePage />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
