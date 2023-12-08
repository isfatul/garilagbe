import Image from "next/image";
import logo from "./assets/Garilagbe.png";
import Link from "next/link";
import { getSession, useSession } from "next-auth/react";

import buttonStyles from "../styles/buttons.module.css";
import styles from "../styles/home.module.css";

import { useState, useEffect } from "react";
import localFont from "next/font/local";
import { data } from "autoprefixer";

const font = localFont({
  src: "./assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "./assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Home() {
  const { data: session } = useSession();
  const [session1, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    getSession().then(async (session) => {
      setSession((prev) => session);
      if (session) {
        console.log(session);
        setRole((prev) => session.user.name);
        await fetch("/api/getLoggedInUserDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: session.user.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            setUser(data[0]);
          });
      }
    });
  }, []);

  const districts = [
    "Dhaka",
    "Chattogram",
    "Sylhet",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Rangpur",
  ];
  const carTypes = [
    "a Car",
    "a Microbus",
    "a Pickup",
    "a Truck",
    "a Bus",
    "an CNG",
  ];

  const [activeDistrict, setActiveDistrict] = useState(0);
  const [activeCarType, setActiveCarType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDistrict(Math.floor(Math.random() * districts.length));
      setActiveCarType(Math.floor(Math.random() * carTypes.length));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className={`flex flex-col ${font.className}`}>
      <div className="flex flex-row justify-between items-center">
        <Image
          priority
          src={logo}
          alt="GariLagbe Logo"
          height={70}
          style={{ cursor: "pointer" }}
        />

        <div className={`flex flex-row`}>
          {/* <div
            className={`${buttonStyles.button1} mr-[10px]`}
            onClick={() => {
              document.querySelector("#rent-a-car").classList.toggle("hidden");
            }}
          >
            Rent a car
          </div> */}
          {!session && (
            <Link href="login">
              <div className={`${buttonStyles.button2}`}>Log In / Sign Up</div>
            </Link>
          )}
          {session && (
            <Link href={user && user.isAdmin == 1 ? "/sys-admin" : "dashboard"}>
              <div className={`${buttonStyles.button2}`}>
                {user && user.name}
              </div>
            </Link>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col min-h-[88vh] justify-center ${styles.bgcover}`}
      >
        <div>
          <div className={`${fontBold.className} text-4xl`}>
            Rent <span>{carTypes[activeCarType]}</span> in{" "}
            <span className={`text-[#b43737]`}>
              {districts[activeDistrict]}
            </span>
          </div>
          <div className="text-2xl">at the best price.</div>
        </div>
      </div>
    </main>
  );
}
