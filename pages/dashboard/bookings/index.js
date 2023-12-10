import UserWrapper from "@/components/userWrapper";
import localFont from "next/font/local";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Bookings() {
  const [sesh, setSesh] = useState(null);
  useEffect(() => {
    getSession().then(async (session) => {
      if (session) {
        // console.log(session);
        setSesh(session);
      }
    });
  }, []);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (sesh) {
      console.log(sesh);
      fetch("/api/getLoggedInUserDetails", {
        method: "POST",
        body: JSON.stringify({
          email: sesh.user.email,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const data = await res.json();
        console.log(data);
        setUser(data[0]);
      });
    }
  }, [sesh]);

  const [bookings, setBookings] = useState(null);

  useEffect(() => {
    if (user) {
      fetch("/api/booking/getUserBookings", {
        method: "POST",
        body: JSON.stringify({
          user_ID: user.user_ID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const data = await res.json();
        console.log(data);
        setBookings(data);
      });
    }
  }, [user]);

  return (
    <UserWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div className="flex flex-row mb-8">
            <div
              className={`${fontBold.className} text-xl flex-[1] text-center`}
            >
              Active Bookings
            </div>
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
                  >
                    <div className={`${fontBold.className} flex flex-row`}>
                      <div
                        className="flex-[1] text-lg"
                        onClick={() => {
                          window.location.href = `/sys-admin/cars/${booking.car_ID}`;
                        }}
                      >
                        {booking.name} [{booking.number_plate}]
                      </div>
                    </div>
                    <div
                      className="text-xs"
                      onClick={() => {
                        window.location.href = `/sys-admin/cars/${booking.car_ID}`;
                      }}
                    >
                      <span className={`${fontBold.className}`}>Car ID: </span>
                      {booking.car_ID}
                    </div>
                    <div
                      className="text-xs"
                      onClick={() => {
                        window.location.href = `/sys-admin/cars/${booking.car_ID}`;
                      }}
                    >
                      <span className={`${fontBold.className}`}>VIN: </span>
                      {booking.VIN}
                    </div>
                    <div
                      // className="text-xs"
                      onClick={() => {
                        window.location.href = `/sys-admin/cars/${booking.car_ID}`;
                      }}
                    >
                      <Image
                        src={booking.carImageURL}
                        height={200}
                        width={300}
                        className="w-full mt-2 h-[250px] object-cover"
                        style={{ borderRadius: "15px" }}
                      />
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8%",
                        right: "5%",
                        display: "flex",
                        flexDirection: "row",
                      }}
                      className={`${fontBold.className}`}
                    >
                      <div
                        className="text-xs"
                        style={{
                          padding: "5px",
                          backgroundColor: "white",
                          borderRadius: "10px",
                          marginRight: "5px",
                        }}
                      >
                        Daily: {booking.dailyRate}BDT
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          padding: "5px",
                          backgroundColor: "white",
                          borderRadius: "10px",
                        }}
                      >
                        Weekly: {booking.weeklyRate}BDT
                      </div>
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
    </UserWrapper>
  );
}
