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

export default function Signup() {
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
      <form>
        <h1 className={`text-4xl ${fontBold.className} text-[#b43737]`}>
          Admin Sign Up
        </h1>
        <div className={`flex flex-col`}>
          <input
            type="text"
            placeholder="Username"
            className={`border-2 border-gray-400 rounded-md p-2 mt-2 min-w-[300px]`}
          />
          <input
            type="email"
            placeholder="Email"
            className={`border-2 border-gray-400 rounded-md p-2 mt-2`}
          />
          <input
            type="password"
            placeholder="Password"
            className={`border-2 border-gray-400 rounded-md p-2 mt-2`}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className={`border-2 border-gray-400 rounded-md p-2 mt-2`}
          />
          <button className={`${buttonStyles.button1} rounded-md p-2 mt-2`}>
            Sign Up
          </button>
        </div>
        <div>
          or,{" "}
          <Link href="login" className={fontBold.className}>
            Log In
          </Link>
        </div>
      </form>
      <div className="absolute top-[10px] right-[10px]">
        Are you an user?{" "}
        <Link href="/signup">
          <span className={fontBold.className}>Click here.</span>
        </Link>
      </div>
    </div>
  );
}
