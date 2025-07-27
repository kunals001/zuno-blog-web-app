import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "./firebase";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearGoogleError, googleSignup } from "@/redux/slices/userSlice";
import Image from "next/image";
import { IconLoader } from "@tabler/icons-react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

const GoogleSignup = () => {
  const auth = getAuth(app);
  const router = useRouter();

  const { googleLoading, googleError } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();

  type UserInfo = {
    name: string;
    email: string;
    profilePic: string;
  };

  const handleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const result = await signInWithPopup(auth, provider);
      const userInfo: UserInfo = {
        name: result.user.displayName!,
        email: result.user.email!,
        profilePic: result.user.photoURL!,
      };

      await dispatch(googleSignup(userInfo)).unwrap();
      router.replace("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (googleError) {
      toast.error(googleError, {
        duration: 4000,
      })
      dispatch(clearGoogleError());
    }
  })

  return (
    <div className="google-signup w-full">

      <button
        onClick={handleClick}
        disabled={googleLoading}
        type="button"
        className="w-full py-[.7vh] px-2 md:px-2 text-zinc-700 font-[500] rounded-lg text-lg md:text-xl flex items-center gap-[1vh] md:gap-[.5vw] justify-center tracking-tight bg-zinc-100"
      >
        {" "}
        <Image
          width={40}
          height={40}
          className="w-[3vh] h-[3vh] md:w-[1.5vw] md:h-[1.5vw]"
          src="/google.avif"
          alt="Sign Up with Google"
        />
        {googleLoading ? (
          <div className="">
            <IconLoader className="animate-spin md:size-[2vw] size-[3vh] text-[#0ABAB5] mx-auto" />
          </div>
        ) : (
          "Continue with Google"
        )}
      </button>
    </div>
  );
};

export default GoogleSignup;
