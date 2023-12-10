import UserWrapper from "@/components/userWrapper";
import { signOut } from "next-auth/react";
import localFont from "next/font/local";
import buttonStyles from "@/styles/buttons.module.css";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";

const font = localFont({
  src: "../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function dashboard() {
  async function handleLogout() {
    signOut();
  }
  const { data: session } = useSession();
  const [session1, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    getSession().then(async (session) => {
      setSession((prev) => session);
      if (session) {
        // console.log(session);
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

  const [todaysRentals, setTodaysRentals] = useState(null);

  useEffect(() => {
    if (user) {
      const result = fetch("/api/booking/getTodaysRentals", {
        method: "POST",
        body: JSON.stringify({
          user_ID: user.user_ID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const data = await res.json();
        setTodaysRentals(data);
        console.log(data);
      });
    }
  }, [user]);
  return (
    <UserWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
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
              window.location.href = `/dashboard/search?${queryParams.toString()}`;
            }}
            className="w-full bg-gray-100 h-max p-8 mb-4"
            id="rent-a-car"
            style={{
              // position: "absolute",
              // marginLeft: "50%",
              // transform: "translateX(-50%) translateY(-50%)",
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
                  <option value="" disabled selected>
                    {" "}
                    -- select an option --{" "}
                  </option>
                  <option value="SUV">SUV</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Microbus">Microbus</option>
                </select>
              </div>
              <div className="w-full sm:mr-2 mb-2">
                <div className={`${fontBold.className} text-xs`}>
                  Pickup Date
                </div>
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
                  className="w-full border-2 border-gray-400 rounded-md p-2"
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
          <br />
          <div className={`${fontBold.className} text-xl mb-4`}>
            Today's Active Rentals
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "10px",
            }}
          >
            {todaysRentals && todaysRentals.length > 0 ? (
              todaysRentals.map((booking) => {
                return (
                  <div
                    className="w-full hover:bg-gray-100 cursor-pointer"
                    style={{
                      border: "1px dashed grey",
                      padding: "15px 10px",
                      borderRadius: "5px",
                      position: "relative",
                    }}
                    onClick={() => {
                      window.location.href = `/dashboard/booking-details/${booking.res_ID}`;
                    }}
                  >
                    <div className={`${fontBold.className} flex flex-row`}>
                      <div className="flex-[1] text-lg">
                        {booking.name} [{booking.number_plate}]{" "}
                        <span style={{ color: "green" }}>●</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className={`${fontBold.className}`}>Pick Up: </span>
                      {booking.pickup_date.substring(0, 10)}
                    </div>
                    <div className="text-sm">
                      <span className={`${fontBold.className}`}>
                        Drop Off:{" "}
                      </span>
                      {booking.dropoff_date.substring(0, 10)}
                    </div>
                    <div
                    // className="text-xs"
                    >
                      <Image
                        src={booking.carImageURL}
                        height={200}
                        width={300}
                        className="w-full mt-2 h-[250px] object-cover"
                        style={{ borderRadius: "15px" }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No rentals today</div>
            )}
          </div>
          {/* <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center h-24 rounded bg-gray-50 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
          </div> */}
          {/* <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 ">
            <p className="text-2xl text-gray-400 ">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div> */}
          {/* <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
          </div> */}
          {/* <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-50 ">
            <p className="text-2xl text-gray-400 ">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div> */}
          {/* <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
            <div className="flex items-center justify-center rounded bg-gray-50 h-28 ">
              <p className="text-2xl text-gray-400 ">
                <svg
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </UserWrapper>
  );
}

dashboard.auth = {
  required: true,
  loading: <div>Loading...</div>,
  redirect: "/login",
};
