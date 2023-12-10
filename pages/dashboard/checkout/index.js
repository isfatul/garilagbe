import UserWrapper from "@/components/userWrapper";
import { useSearchParams } from "next/navigation";
import localFont from "next/font/local";
import Router from "next/router";
import { useEffect, useState, useRef } from "react";
import buttonStyles from "@/styles/buttons.module.css";
import Image from "next/image";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { getSession, useSession } from "next-auth/react";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Checkout() {
  const searchParams = useSearchParams();
  const pickupDate = searchParams.get("pickupDate");
  const dropoffDate = searchParams.get("dropoffDate");
  const car_ID = searchParams.get("car_ID");
  const carType = searchParams.get("carType");

  const [amount, setAmount] = useState(null);

  const [carData, setCarData] = useState(null);

  const handleCreditCardPayment = async () => {
    try {
      const res = await fetch("/api/checkout/credit-card-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          car_ID,
          pickupDate,
          dropoffDate,
        }),
      });
      const data = await res.json();

      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

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

  const getCarDetails = async () => {
    try {
      const res = await fetch("/api/cars/get-car-details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          car_ID,
        }),
      });
      const data = await res.json();

      setCarData(data);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (car_ID) {
      getCarDetails();
    }
  }, [car_ID]);

  useEffect(() => {
    if (carData) {
      const dailyRate = carData.dailyRate;
      const weeklyRate = carData.weeklyRate;

      const pickupDate1 = new Date(pickupDate);
      const dropoffDate1 = new Date(dropoffDate);

      const days = Math.floor((dropoffDate1 - pickupDate1) / 86400000);

      // Replace with the actual number of days

      const weeks = Math.floor(days / 7);
      const remainingDays = days % 7;

      const totalAmount = weeks * weeklyRate + remainingDays * dailyRate;

      // Show the least amount
      const leastAmount = Math.min(
        totalAmount,
        dailyRate * days,
        weeklyRate * Math.ceil(days / 7)
      );

      setAmount((prev) => leastAmount + leastAmount * 0.15);
    }
  }, [carData, pickupDate, dropoffDate]);

  const [paymentMethod, setPaymentMethod] = useState("credit");
  console.log(paymentMethod);

  const bkashNumberRef = useRef(null);
  const bkashTrxIDRef = useRef(null);

  return (
    <UserWrapper>
      <div className="p-4 sm:ml-64">
        <div
          className=" border-2 border-gray-200 border-dashed rounded-lg mt-14"
          style={{ backgroundColor: "#F5F6FA" }}
        >
          <div className="flex md:flex-row flex-col-reverse">
            <div className="flex-[2] p-4" style={{ backgroundColor: "white" }}>
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
                  Checkout
                </div>
              </div>
              <form>
                <div className={fontBold.className}>
                  Payment Method (Choose one):
                </div>
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod == "credit"}
                  onChange={() => setPaymentMethod("credit")}
                />{" "}
                Credit/Debit Card
                <br />
                <input
                  type="radio"
                  name="payment"
                  value="bkash"
                  checked={paymentMethod == "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                />{" "}
                bKash
              </form>
              <br />
              {paymentMethod === "credit" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    // console.log(data);
                    // console.log({
                    //   user_ID: user.user_ID,
                    //   car_ID,
                    //   pickupDate,
                    //   dropoffDate,
                    //   amount,
                    //   payment_method: "card",
                    //   payment_details: JSON.stringify({
                    //     ...data,
                    //   }),
                    // });

                    fetch("/api/checkout/payment", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_ID: user.user_ID,
                        car_ID,
                        pickupDate,
                        dropoffDate,
                        amount,
                        payment_method: "bkash",
                        payment_details: JSON.stringify({
                          ...data,
                        }),
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data);
                        if (data.affectedRows === 1) {
                          Router.push(`/dashboard/booking/${data.res_ID}`);
                        }
                      });
                  }}
                  className={`flex flex-col`}
                >
                  <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
                    <div className="flex-[1]">
                      <div className={`${fontBold.className} text-xs`}>
                        Name on Credit/Debit Card{" "}
                        <span style={{ color: "red" }}>*</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Name"
                        name="credit-name"
                        autoComplete="cc-name"
                        required
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                  </div>
                  <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
                    <div className="flex-[1]">
                      <div className={`${fontBold.className} text-xs`}>
                        Credit/Debit Card Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        name="credit-number"
                        autoComplete="cc-number"
                        maxLength={19}
                        pattern="[0-9\s]{13,19}"
                        inputmode="numeric"
                        required
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                  </div>
                  <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
                    <div className="flex-[1]">
                      <div className={`${fontBold.className} text-xs`}>
                        Expiry Date <span style={{ color: "red" }}>*</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="MM/YY"
                        name="credit-expiry"
                        autoComplete="cc-exp"
                        maxLength={5}
                        pattern="\d\d/\d\d"
                        inputmode="numeric"
                        required
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                    <div className="md:w-4 h-2"></div>
                    <div className="flex-[1]">
                      <div className={`${fontBold.className} text-xs`}>
                        VCC <span style={{ color: "red" }}>*</span>
                      </div>
                      <input
                        type="password"
                        placeholder="***"
                        name="credit-vcc"
                        autoComplete="cc-csc"
                        maxLength={3}
                        pattern="\d{3,4}"
                        inputmode="numeric"
                        required
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`${buttonStyles.button1} flex flex-row`}
                  >
                    <div className="flex-[1] text-center">Finish Booking</div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </form>
              )}

              {paymentMethod === "bkash" && (
                <form
                  className={`flex flex-col`}
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const data = Object.fromEntries(formData.entries());
                    // console.log(data);
                    // console.log({
                    //   user_ID: user.user_ID,
                    //   car_ID,
                    //   pickupDate,
                    //   dropoffDate,
                    //   amount,
                    //   payment_method: "bkash",
                    //   payment_details: JSON.stringify({
                    //     bkashNumber: bkashNumberRef.current.value,
                    //     ...data,
                    //   }),
                    // });

                    fetch("/api/checkout/payment", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        user_ID: user.user_ID,
                        car_ID,
                        pickupDate,
                        dropoffDate,
                        amount,
                        payment_method: "bkash",
                        payment_details: JSON.stringify({
                          bkashNumber: bkashNumberRef.current.value,
                          ...data,
                        }),
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        console.log(data);
                        if (data.affectedRows === 1) {
                          Router.push(`/dashboard/booking/${data.booking_ID}`);
                        }
                      });
                  }}
                >
                  <div className="text-sm mb-2">
                    <div>
                      01. Open up the bKash app or go to your bKash Mobile Menu
                      by dialling *247#
                    </div>

                    <div>02. Choose “Send Money.”</div>

                    <div>
                      03. Enter the bKash Account Number, which is given down
                      below “Account Number.”
                    </div>

                    <div>04. Enter the exact bill amount.</div>

                    <div>
                      07. Now, enter your bKash Mobile Menu PIN to confirm the
                      transaction.
                    </div>

                    <div>
                      08. After sending money, you’ll receive a bKash
                      Transaction ID (TRX ID). Note the Transaction ID.
                    </div>

                    <div>
                      09. Now, enter your bKash number and Transaction ID (TRX
                      ID) on the form down below. (Note: If you are paying from
                      an Agent, don’t forget to get his bKash number and
                      Transaction ID (TRX ID). If he doesn’t want to provide the
                      Transaction ID (TRX ID), you can type ‘AGENT’ on the
                      Transaction ID form.)
                    </div>

                    <div>
                      ** Our bKash number changes from time to time. Don’t call
                      this number. You won’t get any reply. If you need to talk,
                      kindly knock us on Facebook or join the discord. If
                      possible, don’t forget to take a payment screenshot from
                      the bKash app; it may require for any future inquiries **
                    </div>

                    <div>
                      You need to send us{" "}
                      {carData &&
                        pickupDate &&
                        dropoffDate &&
                        (() => {
                          const dailyRate = carData.dailyRate;
                          const weeklyRate = carData.weeklyRate;

                          const pickupDate1 = new Date(pickupDate);
                          const dropoffDate1 = new Date(dropoffDate);

                          const days = Math.floor(
                            (dropoffDate1 - pickupDate1) / 86400000
                          );

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

                          return (
                            <span
                              className="text-lg"
                              style={{ color: "#b43737" }}
                            >
                              ৳{leastAmount + leastAmount * 0.15}
                            </span>
                          );
                        })()}
                    </div>
                    <div>
                      <span className={fontBold.className}>Account Type:</span>{" "}
                      Personal
                    </div>
                    <div>
                      <span className={fontBold.className}>
                        Account Number:
                      </span>{" "}
                      01700000000
                    </div>
                  </div>
                  <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
                    <div className="flex-[1]">
                      <div className={`${fontBold.className} text-xs`}>
                        Your bKash Account Number{" "}
                        <span style={{ color: "red" }}>*</span>
                      </div>
                      <div className="flex flex-row">
                        <PhoneInput
                          placeholder="01xxxxxxxxx"
                          defaultCountry="BD"
                          required
                          ref={bkashNumberRef}
                          onChange={(e) => {
                            bkashNumberRef.current.value = e;
                          }}
                          className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                        />
                      </div>
                      {/* <input
                        type="number"
                        placeholder="Phone Number"
                        name="phone-number"
                        autoComplete="phone"
                        maxLength={11}
                        pattern="\d{11}"
                        inputmode="numeric"
                        required
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      /> */}
                    </div>
                  </div>
                  <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
                    <div className="flex-[1]">
                      <div className={`${fontBold.className} text-xs`}>
                        Transaction ID <span style={{ color: "red" }}>*</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="TrxID"
                        name="trx-id"
                        maxLength={19}
                        pattern="[0-9\s]{13,19}"
                        required
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`${buttonStyles.button1} flex flex-row`}
                  >
                    <div className="flex-[1] text-center">Finish Booking</div>
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        class="w-6 h-6"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </button>
                </form>
              )}
            </div>
            <div className="flex-[1] p-4 flex flex-col">
              <div className="mb-5" style={{ backgroundColor: "#F5F6FA" }}>
                <div
                  className="p-4"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "5px 5px #b43737",
                  }}
                >
                  <div
                    className={`${fontBold.className} text-lg pb-2`}
                    style={{ color: "#b43737" }}
                  >
                    Pay Now
                  </div>
                  <div className="flex flex-row pb-1">
                    <div className="flex-[1]">Rental</div>
                    <div>
                      {carData &&
                        pickupDate &&
                        dropoffDate &&
                        (() => {
                          const dailyRate = carData.dailyRate;
                          const weeklyRate = carData.weeklyRate;

                          const pickupDate1 = new Date(pickupDate);
                          const dropoffDate1 = new Date(dropoffDate);

                          const days = Math.floor(
                            (dropoffDate1 - pickupDate1) / 86400000
                          );

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

                          return <div>৳{leastAmount}</div>;
                        })()}
                    </div>
                  </div>
                  <div
                    className="flex flex-row pb-1"
                    style={{ borderBottom: "1px solid #b43737" }}
                  >
                    <div className="flex-[1]">VAT (15%)</div>
                    <div>
                      {carData &&
                        pickupDate &&
                        dropoffDate &&
                        (() => {
                          const dailyRate = carData.dailyRate;
                          const weeklyRate = carData.weeklyRate;

                          const pickupDate1 = new Date(pickupDate);
                          const dropoffDate1 = new Date(dropoffDate);

                          const days = Math.floor(
                            (dropoffDate1 - pickupDate1) / 86400000
                          );

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

                          return <div>৳{leastAmount * 0.15}</div>;
                        })()}
                    </div>
                  </div>
                  <div className={`flex flex-row pt-2 ${fontBold.className}`}>
                    <div className="flex-[1]">Total</div>
                    <div>
                      {carData &&
                        pickupDate &&
                        dropoffDate &&
                        (() => {
                          const dailyRate = carData.dailyRate;
                          const weeklyRate = carData.weeklyRate;

                          const pickupDate1 = new Date(pickupDate);
                          const dropoffDate1 = new Date(dropoffDate);

                          const days = Math.floor(
                            (dropoffDate1 - pickupDate1) / 86400000
                          );

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

                          return (
                            <div
                              className="text-lg"
                              style={{ color: "#b43737" }}
                            >
                              ৳{leastAmount + leastAmount * 0.15}
                            </div>
                          );
                        })()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-5" style={{ backgroundColor: "#F5F6FA" }}>
                <div
                  className="p-4"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "5px 5px #b43737",
                  }}
                >
                  <div
                    className={`${fontBold.className} text-lg pb-2`}
                    style={{ color: "#b43737" }}
                  >
                    {carData && carData.name} ({carData && carData.year})
                  </div>
                  {carData && (
                    <div style={{ position: "relative" }}>
                      <div
                        // className="text-xs"
                        onClick={() => {
                          window.location.href = `/sys-admin/cars/${car.car_ID}`;
                        }}
                      >
                        <Image
                          src={carData.carImageURL}
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
                          right: "3%",
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
                          Daily: {carData.dailyRate}BDT
                        </div>
                        <div
                          className="text-xs"
                          style={{
                            padding: "5px",
                            backgroundColor: "white",
                            borderRadius: "10px",
                          }}
                        >
                          Weekly: {carData.weeklyRate}BDT
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div style={{ backgroundColor: "#F5F6FA" }}>
                <div
                  className="p-4"
                  style={{
                    backgroundColor: "white",
                    boxShadow: "5px 5px #b43737",
                  }}
                >
                  <div
                    className={`${fontBold.className} text-lg pb-2`}
                    style={{ color: "#b43737" }}
                  >
                    Booking Information
                  </div>
                  <div className="flex flex-row">
                    <div className={`${fontBold.className} flex-[1]`}>
                      {" "}
                      Pick Up:
                    </div>
                    <div>{pickupDate}</div>
                  </div>
                  <div className="flex flex-row">
                    <div className={`${fontBold.className} flex-[1]`}>
                      {" "}
                      Drop Off:
                    </div>
                    <div>{dropoffDate}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserWrapper>
  );
}
