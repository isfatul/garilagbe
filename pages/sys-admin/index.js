"use Client";

import { signOut, useSession } from "next-auth/react";
import Logo from "@/pages/assets/Garilagbe.png";
import Logout2 from "@/pages/assets/logout.svg";
import PP from "@/pages/assets/profile-picture-5.jpg";
import carLogo from "@/pages/assets/car.svg";
import Image from "next/image";
import localFont from "next/font/local";
import sidebar from "@/components/sidebar";
import Ssidebar from "@/components/sidebar";
import AdminWrapper from "@/components/adminWrapper";
import { useEffect, useState } from "react";

const font = localFont({
  src: "../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function AdminDashboard() {
  const { data: session } = useSession();

  const [rentalsMonth, setRentalsMonth] = useState(null);

  function rentalsThisMonth() {
    fetch("/api/stat/rentalsThisMonth", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      console.log(data[0]);
      setRentalsMonth(data[0].payment_count);
    });
  }

  const [totalCarRenters, setTotalCarRenters] = useState(null);

  function totalCarRentersCount() {
    fetch("/api/stat/totalCarRenters", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      console.log(data[0]);
      setTotalCarRenters(data[0].row_count);
    });
  }

  const [amountEarned, setAmountEarned] = useState(null);

  function totalAmountEarned() {
    fetch("/api/stat/totalAmountEarned", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      console.log(data[0]);
      setAmountEarned(data[0].total_amount);
    });
  }

  const [bookings, setBookings] = useState(null);

  function getBookings() {
    fetch("/api/booking/getAllBookings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      const latestBookings = data.slice(0, 3); // Keep only the first 3 bookings
      setBookings(latestBookings);
      console.log(latestBookings);
    });
  }

  const isBookingActiveToday = (booking) => {
    const today = new Date();
    const pickupDate = new Date(booking.pickup_date);
    const dropoffDate = new Date(booking.dropoff_date);
    if (today >= pickupDate && today <= dropoffDate) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    rentalsThisMonth();
    totalCarRentersCount();
    totalAmountEarned();
    getBookings();
  }, []);

  return (
    <AdminWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "10px",
            }}
          >
            <div className="flex flex-row justify-between h-24 rounded bg-gray-50 p-4 ">
              <div className={`${fontBold.className} text-xl`}>
                Rentals this month
              </div>
              <div className={`text-3xl ${fontBold.className}`}>
                {rentalsMonth && rentalsMonth}
              </div>
            </div>
            <div className="flex flex-row justify-between h-24 rounded bg-gray-50 p-4 ">
              <div className={`${fontBold.className} text-xl`}>
                Total Rentals
              </div>
              <div className={`text-3xl ${fontBold.className}`}>
                {totalCarRenters && totalCarRenters}
              </div>
            </div>
            <div className="flex flex-row justify-between h-24 rounded bg-gray-50 p-4 ">
              <div className={`${fontBold.className} text-xl`}>
                Total Amount Earned
              </div>
              <div className={`text-3xl ${fontBold.className}`}>
                ৳{amountEarned && (amountEarned / 1000).toFixed(2)}k
              </div>
            </div>
          </div>
          <br />
          <div className="flex flex-row mb-8">
            <div className={`${fontBold.className} text-xl flex-[1] `}>
              Latest Bookings
            </div>
            <a href="/sys-admin/bookings/active" style={{ color: "#b43737" }}>
              See all
            </a>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "10px",
            }}
          >
            {bookings && bookings.length > 0 ? (
              bookings.map((booking) => {
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
                      window.location.href = `/sys-admin/bookings/details/${booking.res_ID}`;
                    }}
                  >
                    <div className={`${fontBold.className} flex flex-row`}>
                      <div className="flex-[1] text-lg">
                        {booking.name} [{booking.number_plate}]{" "}
                        {isBookingActiveToday(booking) && (
                          <span style={{ color: "green" }}>●</span>
                        )}
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
              <div className="text-center">No bookings found</div>
            )}
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

AdminDashboard.auth = {
  required: true,
  role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
