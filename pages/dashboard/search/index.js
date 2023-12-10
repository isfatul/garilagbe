import UserWrapper from "@/components/userWrapper";
import localFont from "next/font/local";
import Router from "next/router";
import { useSearchParams } from "next/navigation";
import buttonStyles from "@/styles/buttons.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Search() {
  const searchParams = useSearchParams();
  // console.log(searchParams.stringify());

  const carType = searchParams.get("carType");
  const pickupDate = searchParams.get("pickupDate");
  const dropoffDate = searchParams.get("dropoffDate");

  const [days, setDays] = useState(0);

  const [cars, setCars] = useState([]);

  useEffect(() => {
    async function getSearchResults() {
      const res = await fetch("/api/cars/search-cars-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          carType,
          pickupDate,
          dropoffDate,
        }),
      });
      const data = await res.json();
      setCars(data);
      console.log(data);

      var daysC = Math.ceil(
        (new Date(dropoffDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
      );
      setDays(daysC);
    }
    getSearchResults();
  }, [carType, pickupDate, dropoffDate]);

  return (
    <UserWrapper>
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
              Search Results
            </div>
          </div>
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
                  defaultValue={carType}
                >
                  <option value="" disabled>
                    {" "}
                    -- select an option --{" "}
                  </option>
                  <option value="SUV" selected={carType === "SUV"}>
                    SUV
                  </option>
                  <option value="Sedan" selected={carType === "Sedan"}>
                    Sedan
                  </option>
                  <option value="Microbus" selected={carType === "Microbus"}>
                    Microbus
                  </option>
                </select>
              </div>
              <div className="w-full sm:mr-2 mb-2">
                <div className={`${fontBold.className} text-xs`}>
                  Pickup Date
                </div>
                <input
                  type="date"
                  name="pickupDate"
                  defaultValue={pickupDate}
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
                  defaultValue={dropoffDate}
                  required
                  className="w-full border-2 border-gray-400 rounded-md p-2"
                />
              </div>
            </div>
            <button
              type="submit"
              className={`${buttonStyles.button1} text-center ${fontBold.className} mt-3 w-full`}
            >
              Search Again
            </button>
          </form>
          {cars && cars.length > 0 ? (
            <>
              <div className={`${fontBold.className} mb-4`}>
                {cars.length} cars found
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
                  gap: "10px",
                }}
              >
                {cars.map((car) => {
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
                        // window.location.href = `/sys-admin/cars/${car.car_ID}`;
                        window.location.href = `/dashboard/checkout/?pickupDate=${pickupDate}&dropoffDate=${dropoffDate}&car_ID=${car.car_ID}&carType=${carType}`;
                      }}
                    >
                      <div className={`${fontBold.className} flex flex-row`}>
                        <div className="flex-[1] text-lg">
                          {car.name} ({car.year})
                        </div>
                        <div style={{ color: "#b43737" }} className="text-lg">
                          {(() => {
                            const dailyRate = car.dailyRate;
                            const weeklyRate = car.weeklyRate;
                            // Replace with the actual number of days

                            const weeks = Math.floor(days / 7);
                            const remainingDays = days % 7;

                            const totalAmount =
                              weeks * weeklyRate + remainingDays * dailyRate;

                            // Show the least amount
                            const leastAmount = Math.min(
                              totalAmount,
                              dailyRate * days,
                              weeklyRate * Math.ceil(days / 7)
                            );

                            return <div>৳{leastAmount} + VAT</div>;
                          })()}
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className={`${fontBold.className}`}>
                          Car ID:{" "}
                        </span>
                        {car.car_ID}
                      </div>
                      <div className="text-sm">
                        {/* <span className={`${fontBold.className}`}>VIN: </span>
                      {car.VIN} */}
                        {car.seats} seats, {car.doors} doors
                      </div>
                      <div
                        // className="text-xs"
                        onClick={() => {
                          window.location.href = `/sys-admin/cars/${car.car_ID}`;
                        }}
                      >
                        <Image
                          src={car.carImageURL}
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
                          Daily: {car.dailyRate}BDT
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            padding: "5px",
                            backgroundColor: "white",
                            borderRadius: "10px",
                          }}
                        >
                          Weekly: {car.weeklyRate}BDT
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center">No cars found</div>
          )}
        </div>
      </div>
    </UserWrapper>
  );
}

Search.auth = {
  required: true,
  loading: <div>Loading...</div>,
  redirect: "/login",
};
