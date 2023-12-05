"use Client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useRef, useState } from "react";
import logo from "../assets/Garilagbe.png";
import Image from "next/image";
import Link from "next/link";
import buttonStyles from "../../styles/buttons.module.css";

import localFont from "next/font/local";

const font = localFont({
  src: "../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Login() {
  const [error, setError] = useState();
  const { session, loading } = useSession();
  console.log(session, loading);

  const emailRef = useRef();
  const passwordRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setError();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const isAdminLogin = false;

    const result = await signIn("credentials", {
      email,
      password,
      isAdminLogin,
      redirect: false,
    });

    if (result.error) {
      setError(result.error);
    } else {
      window.location.href = "/dashboard";
      // if (!loading && session && session.user.isAdmin === false) {
      //   window.location.href = "/";
      // } else {
      //   alert("You're not supposed to login here.");
      //   // signOut();
      // }
    }
  }

  return (
    <div
      className={`flex min-h-screen sm:flex-row flex-col  text-center items-center justify-center pt-[-10px] ${font.className}`}
    >
      <div className="sm:mr-[70px] mb-[20px] text-left">
        <Link href="/">
          <div className="sm:mb-[50px] mb-[20px]">&larr; Go back Home</div>
        </Link>
        <Image
          src={logo}
          alt="GariLagbe Logo"
          height={100}
          style={{ cursor: "pointer" }}
        />{" "}
      </div>
      <div>
        <h1 className={`text-4xl ${fontBold.className} text-[#b43737]`}>
          Log In
        </h1>
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className={`flex flex-col`}>
          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            required
            className={`border-2 border-gray-400 rounded-md p-2 mt-2 min-w-[300px]`}
          />
          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            required
            className={`border-2 border-gray-400 rounded-md p-2 mt-2`}
          />
          <div className={`text-left mt-2`}>
            <input
              type="checkbox"
              id="remember"
              name="remember"
              value="remember"
            />
            <label htmlFor="remember" className={`ml-2`}>
              Remember me
            </label>
          </div>
          <button
            // onSubmit={handleSubmit}
            type="submit"
            className={`${buttonStyles.button1} rounded-md p-2 mt-2`}
          >
            Log In
          </button>
        </form>
        <div>
          or,{" "}
          <Link href="signup">
            <span className={fontBold.className}>Sign Up </span>
          </Link>
        </div>
      </div>
      <div className="absolute top-[10px] right-[10px]">
        Are you an admin?{" "}
        <Link href="/sys-admin/login">
          <span className={fontBold.className}>Click here.</span>
        </Link>
      </div>
    </div>
  );
}
