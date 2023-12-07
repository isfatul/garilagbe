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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const carType = formData.get("carType");
            const pickupDate = formData.get("pickupDate");
            const dropoffDate = formData.get("dropoffDate");
            const queryParams = new URLSearchParams({
              carType,
              pickupDate,
              dropoffDate,
            });
            window.location.href = `/search?${queryParams.toString()}`;
          }}
          className="w-[80%] bg-gray-100 h-max p-8 hidden  sm:top-[20%] top-[30%]"
          id="rent-a-car"
          style={{
            position: "absolute",
            marginLeft: "50%",
            transform: "translateX(-50%) translateY(-50%)",
            borderRadius: "20px",
          }}
        >
          <div className="flex sm:flex-row flex-col justify-between items-center">
            <div className="w-full sm:mr-2 mb-2">
              <div className={`${fontBold.className} text-xs`}>Car Type</div>
              <select
                className="w-full border-2 border-gray-400 rounded-md p-2 mt-2"
                name="carType"
                required
              >
                <option value="suv">SUV</option>
                <option value="sedan">Sedan</option>
                <option value="minivan">Minivan</option>
              </select>
            </div>
            <div className="w-full sm:mr-2 mb-2">
              <div className={`${fontBold.className} text-xs`}>Pickup Date</div>
              <input
                type="date"
                name="pickupDate"
                required
                className="w-full border-2 border-gray-400 rounded-md p-2 mt-2"
              />
            </div>
            <div className="w-full">
              <div className={`${fontBold.className} text-xs`}>
                Dropoff Date
              </div>
              <input
                type="date"
                name="dropoffDate"
                required
                className="w-full border-2 border-gray-400 rounded-md p-2 mt-2"
              />
            </div>
          </div>
          <button
            type="submit"
            className={`${buttonStyles.button1} text-center ${fontBold.className} mt-3 w-full`}
          >
            Search
          </button>
        </form>
        <div className={`flex flex-row`}>
          <div
            className={`${buttonStyles.button1} mr-[10px]`}
            onClick={() => {
              document.querySelector("#rent-a-car").classList.toggle("hidden");
            }}
          >
            Rent a car
          </div>
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
