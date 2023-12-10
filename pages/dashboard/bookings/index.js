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

  const isBookingActiveToday = (booking) => {
    const today = new Date();
    const pickupDate = new Date(booking.pickup_date);
    const dropoffDate = new Date(booking.dropoff_date);
    if (today >= pickupDate && today <= dropoffDate) {
      return true;
    }
    return false;
  };

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
                    onClick={() => {
                      window.location.href = `/dashboard/booking-details/${booking.res_ID}`;
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
    </UserWrapper>
  );
}

Bookings.auth = {
  required: true,
  loading: <div>Loading...</div>,
  redirect: "/login",
};
