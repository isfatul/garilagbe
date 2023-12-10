import AdminWrapper from "@/components/adminWrapper";
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { useSession, getSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import Router from "next/router";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Payments() {
  const [payments, setPayments] = useState(null);
  useEffect(() => {
    fetch("/api/booking/getAllPayments", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);
      setPayments(data);
    });
  }, []);

  return (
    <AdminWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div className="flex flex-row w-full align-center text-center justify-space-between mb-4">
            <div className={`py-1 ${fontBold.className} text-lg`}>Payments</div>
            <div className="flex-1"></div>
          </div>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
              <thead className="text-sm text-gray-700 uppercase bg-gray-50 ">
                <tr className={fontBold.className}>
                  <th className="px-4 py-2">Payment ID</th>
                  <th className="px-4 py-2">Booking ID</th>
                  <th className="px-4 py-2">User ID</th>
                  <th className="px-4 py-2">Payment Method</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments &&
                  payments.length > 0 &&
                  payments.map((payment) => (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="border px-4 py-2">{payment.payment_ID}</td>
                      <td className="border px-4 py-2">
                        <a
                          href={`/sys-admin/bookings/details/${payment.res_ID}`}
                        >
                          {payment.res_ID}
                        </a>
                      </td>
                      <td className="border px-4 py-2">
                        <a href={`/sys-admin/users/${payment.user_ID}`}>
                          {payment.user_ID}
                        </a>
                      </td>
                      <td className="border px-4 py-2">
                        {payment.payment_method}{" "}
                        {payment.payment_method === "Credit Card" &&
                          payment.payment_details && (
                            <span>
                              (
                              {JSON.parse(
                                payment.payment_details
                              ).credit_number.slice(-4)}
                              )
                            </span>
                          )}
                        {payment.payment_method === "bKash" &&
                          payment.payment_details && (
                            <span>
                              ({JSON.parse(payment.payment_details).bkashNumber}
                              )
                            </span>
                          )}
                      </td>
                      <td className="border px-4 py-2">{payment.amount}BDT</td>
                      <td className="border px-4 py-2">
                        {payment.payment_date &&
                          payment.payment_date.substring(0, 10)}
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

Payments.auth = {
  required: true,
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
