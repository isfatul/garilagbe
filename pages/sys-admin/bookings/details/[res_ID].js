import AdminWrapper from "@/components/adminWrapper";
import localFont from "next/font/local";
import { useSession, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Router from "next/router";

const font = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function BookingDetails() {
  const router = useRouter();
  const res_ID = router.query.res_ID;

  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (res_ID) {
      fetch("/api/booking/getBookingDetails", {
        method: "PUT",
        body: JSON.stringify({
          res_ID: res_ID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const data = await res.json();
        console.log(data);
        setBooking(...data);
      });
    }
  }, [res_ID]);

  function showPaymentDetails() {
    var details;
    if (booking !== undefined && booking !== null) {
      details = JSON.parse(booking.payment_details);
    }
    if (booking && details && booking.payment_method === "bKash") {
      return (
        <div>
          <div>
            <span className={fontBold.className}>bKash Account Number:</span>{" "}
            {booking && details.bkashNumber}
          </div>
          <div>
            <span className={fontBold.className}>Transaction ID:</span>{" "}
            {booking && details.trxID}
          </div>
        </div>
      );
    } else if (booking && booking.payment_method === "Credit Card") {
      return (
        <div>
          <div>
            <span className={fontBold.className}>Card Number:</span>{" "}
            XXXX-XXXX-XXXX-
            {booking && details.credit_number.substring(12, 16)}
          </div>
          <div>
            <span className={fontBold.className}>Card Expiry:</span>{" "}
            {booking && details.credit_expiry}
          </div>
        </div>
      );
    } else {
      return <div>Payment method not found</div>;
    }
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

  return (
    <AdminWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div className="flex flex-row mb-8">
            <div
              className="flex flex-row cursor-pointer hover:text-gray-1000 "
              onClick={() => Router.back()}
            >
              <svg
                class="w-6 h-6 text-gray-500 cursor-pointer  mr-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 8 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
                />
              </svg>
              <div>Go back</div>
            </div>
            <div
              className={`${fontBold.className} text-xl flex-[1] text-center`}
            >
              Booking Details{" "}
              {booking && isBookingActiveToday(booking) && (
                <span style={{ color: "green" }}>●</span>
              )}
            </div>
          </div>
          <div className={`flex md:flex-row flex-col-reverse justify`}>
            <div className="flex-[1] md:mt-0 mt-3">
              <div>
                <span className={fontBold.className}>Reservation ID:</span>{" "}
                {res_ID}
              </div>
              <br />
              <div className="text-lg">
                <span className={fontBold.className}>Booking Info </span>
              </div>
              <div>
                <span className={fontBold.className}>Pick Up:</span>{" "}
                {booking && booking.pickup_date.substring(0, 10)}
              </div>
              <div>
                <span className={fontBold.className}>Drop Off:</span>{" "}
                {booking && booking.dropoff_date.substring(0, 10)}
              </div>
              <br />
              <div className="text-lg">
                <span className={fontBold.className}>Renter Info</span>
              </div>
              <div>
                <span className={fontBold.className}>Renter Name:</span>{" "}
                {/* {sesh && sesh.user.name} */}
                {booking && booking.user_name}
              </div>
              <div>
                <span className={fontBold.className}>Renter E-mail:</span>{" "}
                {/* {sesh && sesh.user.email} */}
                {booking && booking.email}
              </div>
              <br />
              <div className="text-lg">
                <span className={fontBold.className}>Car Info</span>
              </div>
              <div>
                <span className={fontBold.className}>Car Name:</span>{" "}
                <a href={`/sys-admin/cars/${booking && booking.car_ID}`}>
                  <span
                    className={`${fontBold.className} underline text-gray-400 hover:text-gray-800`}
                  >
                    {booking && booking.name} ({booking && booking.year})
                  </span>
                </a>
              </div>
              <div>
                <span className={fontBold.className}>Car ID:</span>{" "}
                {booking && booking.car_ID}
              </div>
              <div>
                <span className={fontBold.className}>Plate Number:</span>{" "}
                {booking && booking.number_plate}
              </div>
              <div>
                <span className={fontBold.className}>VIN:</span>{" "}
                {booking && booking.VIN}
              </div>
              <div className="text-sm">
                {booking && booking.color}, {booking && booking.body},{" "}
                {booking && booking.height}, {booking && booking.make},{" "}
                {booking && booking.seats} seats, {booking && booking.doors}{" "}
                doors
              </div>
              <br />
              <div className="text-lg">
                <span className={fontBold.className}>Payment Info</span>
              </div>
              <div>
                <span className={fontBold.className}>Payment Method:</span>{" "}
                {booking && booking.payment_method}
              </div>
              <div>
                <span className={fontBold.className}>Payment Status:</span>{" "}
                {booking && booking.payment_status === "paid"
                  ? "Paid"
                  : "Not Paid"}
              </div>
              {booking && showPaymentDetails()}
              <div>
                <span className={fontBold.className}>Total Amount:</span>{" "}
                {booking && booking.amount} BDT
              </div>
              <br />
            </div>
            <div>
              <Image
                src={booking !== null && booking.carImageURL}
                width={600}
                height={600}
                className="h-250 w-300"
                style={{ objectFit: "cover", borderRadius: "15px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

BookingDetails.auth = {
  required: true,
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
