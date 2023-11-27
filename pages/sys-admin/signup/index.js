"use client";

import { useRef, useState } from "react";
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

async function createUser(name, email, password) {
  const response = await fetch("/api/auth/sys-admin/signup", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.statusCode === 201) {
    throw new Error(data.error);
  }
  return data;
}

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [error, setError] = useState();

  async function submitHandler(event) {
    event.preventDefault();

    setError(null);

    const enteredName = nameRef.current.value;
    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      confirmPasswordRef.current.focus();
      setError("Passwords do not match!");
      return;
    } else {
      try {
        const response = await createUser(
          enteredName,
          enteredEmail,
          enteredPassword
        );
        if (response.error) {
          setError(response.error);
        } else {
          window.location.href = "/sys-admin/login";
        }
      } catch (error) {
        setError(error.message);
      }
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
      <form onSubmit={submitHandler}>
        <h1 className={`text-4xl ${fontBold.className} text-[#b43737]`}>
          Admin Sign Up
        </h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className={`flex flex-col`}>
          <input
            type="text"
            placeholder="Name"
            required
            ref={nameRef}
            className={`border-2 border-gray-400 rounded-md p-2 mt-2 min-w-[300px]`}
          />
          <input
            type="email"
            placeholder="Email"
            required
            ref={emailRef}
            className={`border-2 border-gray-400 rounded-md p-2 mt-2`}
          />
          <input
            type="password"
            placeholder="Password"
            required
            ref={passwordRef}
            className={`border-2 border-gray-400 rounded-md p-2 mt-2`}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            ref={confirmPasswordRef}
            className={`border-2 border-gray-400 rounded-md p-2 mt-2`}
          />
          <button
            type="submit"
            className={`${buttonStyles.button1} rounded-md p-2 mt-2`}
          >
            Sign Up
          </button>
        </div>
        <div>
          or,{" "}
          <Link href="/sys-admin/login" className={fontBold.className}>
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
