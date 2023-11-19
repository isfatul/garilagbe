import Image from "next/image";
import logo from "./assets/Garilagbe.png";

import buttonStyles from "../styles/buttons.module.css";
import styles from "../styles/home.module.css";

import { useState, useEffect } from "react";
import localFont from "next/font/local";

const font = localFont({
  src: "./assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "./assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Home() {
  const districts = [
    "Dhaka",
    "Chittagong",
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
    "an Ambulance",
    "a Bus",
    "an CNG",
  ];

  const [activeDistrict, setActiveDistrict] = useState(0);
  const [activeCarType, setActiveCarType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDistrict(Math.floor(Math.random() * districts.length));
      setActiveCarType(Math.floor(Math.random() * carTypes.length));
    }, 3000);
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
          <div className={`${buttonStyles.button1} mr-[10px]`}>Rent a car</div>
          <div className={`${buttonStyles.button2}`}>Sign In/ Sign Up</div>
        </div>
      </div>
      <div className={`flex flex-col min-h-[88vh] justify-center ${styles.bgcover}`}>
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
