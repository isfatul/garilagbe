import logo from "../../assets/Garilagbe.png";
import Image from "next/image";
import Link from "next/link";
import buttonStyles from "../../../styles/buttons.module.css";

import localFont from "next/font/local";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function AdminLogin() {
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
          Admin Log In
        </h1>
        <form className={`flex flex-col`}>
          <input
            type="text"
            placeholder="Username"
            className={`border-2 border-gray-400 rounded-md p-2 mt-2 min-w-[300px]`}
          />
          <input
            type="password"
            placeholder="Password"
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
          <button className={`${buttonStyles.button1} rounded-md p-2 mt-2`}>
            Log In
          </button>
        </form>
        <div>
          or,{" "}
          <Link href="signup" className={fontBold.className}>
            Sign Up
          </Link>
        </div>
      </div>
      <div className="absolute top-[10px] right-[10px]">
        Are you an user?{" "}
        <Link href="/login">
          <span className={fontBold.className}>Click here.</span>
        </Link>
      </div>
    </div>
  );
}
