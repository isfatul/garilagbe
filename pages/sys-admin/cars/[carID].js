import AdminWrapper from "@/components/adminWrapper";
import localFont from "next/font/local";
import buttonStyles from "@/styles/buttons.module.css";
import Router from "next/router";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function CarDetails() {
  const router = useRouter();
  const carID = router.query.carID;
  const [car, setCar] = useState();

  const { data: session } = useSession();

  const getCarDetails = async () => {
    try {
      const res = await fetch("/api/cars/get-car-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          car_ID: carID,
        }),
      });
      const data = await res.json();

      setCar(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (carID) {
      getCarDetails();
    }
  }, [carID]);

  const [bookings, setBookings] = useState(null);
  useEffect(() => {
    if (car) {
      fetch("/api/booking/getBookingsByCar", {
        method: "POST",
        body: JSON.stringify({
          car_ID: car.car_ID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then(async (res) => {
        const data = await res.json();
        setBookings(data);
        console.log(data);
      });
    }
  }, [car]);

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
              {car && car.name}
            </div>
          </div>
          <div className={`flex md:flex-row flex-col-reverse justify`}>
            <div className="flex-[1] md:mt-0 mt-3 mr-3">
              <div className="text-xl">
                <span className={fontBold.className}>Plate number:</span>{" "}
                {car && car.number_plate}
              </div>
              <div>
                <span className={fontBold.className}>VIN: </span>
                {car && car.VIN}
              </div>
              <div>
                <span className={fontBold.className}>Car ID: </span>
                {car && car.car_ID}
              </div>
              <br />
              <div>
                <span className={fontBold.className}>Insurance Details: </span>
                <br />
                <div>
                  <span className={fontBold.className}>Insurance ID: </span>
                  {car && car.insurance_id}
                </div>
                <div>
                  <span className={fontBold.className}>Coverage: </span>
                  {car && car.coverage}
                </div>
                <div>
                  <span className={fontBold.className}>Company: </span>
                  {car && car.company}
                </div>
                <div>
                  <span className={fontBold.className}>Policy No: </span>
                  {car && car.policy_no}
                </div>
              </div>
              <br />
            </div>
            <div>
              <Image
                src={car && car.carImageURL}
                width={400}
                height={400}
                className="h-250 w-300"
                style={{ objectFit: "cover", borderRadius: "15px" }}
              />
            </div>
          </div>
          <div>
            <span className={fontBold.className}>Rental Details: </span>
            <br />
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 ">
                <tr className={fontBold.className}>
                  <th className="px-4 py-2">Reservation ID</th>
                  <th className="px-4 py-2">Payment ID</th>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Pick Up</th>
                  <th className="px-4 py-2">Drop Off</th>
                  <th className="px-4 py-2">Payment Method</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-3 py-2">Created at</th>
                </tr>
              </thead>
              <tbody>
                {bookings &&
                  bookings.map((booking) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="border px-4 py-2">
                        {isBookingActiveToday(booking) && (
                          <span style={{ color: "green" }}>●</span>
                        )}{" "}
                        {booking.res_ID}
                      </td>
                      <td className="border px-4 py-2">{booking.payment_ID}</td>
                      <td className="border px-4 py-2">{booking.user_ID}</td>
                      <td className="border px-4 py-2">
                        {booking.pickup_date.substring(0, 10)}
                      </td>
                      <td className="border px-4 py-2">
                        {booking.dropoff_date.substring(0, 10)}
                      </td>
                      <td className="border px-4 py-2">
                        {booking.payment_method}{" "}
                        {booking.payment_method === "Credit Card" &&
                          booking.payment_details && (
                            <span>
                              (
                              {JSON.parse(
                                booking.payment_details
                              ).credit_number.slice(-4)}
                              )
                            </span>
                          )}
                        {booking.payment_method === "bKash" &&
                          booking.payment_details && (
                            <span>
                              ({JSON.parse(booking.payment_details).bkashNumber}
                              )
                            </span>
                          )}
                      </td>
                      <td className="border px-4 py-2">{booking.amount}</td>
                      <td className="border px-4 py-2">
                        {booking.payment_date &&
                          booking.payment_date.substring(0, 10)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

CarDetails.auth = {
  required: true,
  role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
