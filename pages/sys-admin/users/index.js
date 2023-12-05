"use Client";

import AdminWrapper from "@/components/adminWrapper";
import Image from "next/image";
import logo from "@/pages/assets/Garilagbe.png";
import localFont from "next/font/local";
import { useSession } from "next-auth/react";
import buttonStyles from "@/styles/buttons.module.css";
import { useEffect, useState } from "react";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Users() {
  const [users, setUsers] = useState();

  useEffect(() => {
    async function getUsers() {
      const res = await fetch("/api/getUsers");
      const data = await res.json();
      setUsers(data);
    }
    getUsers();
  }, []);

  const { data: session } = useSession();
  return (
    <AdminWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div className="flex flex-row w-full align-center text-center justify-space-between mb-4">
            <div className={`py-1 ${fontBold.className} text-lg`}>
              Users ({users && Object.keys(users).length})
            </div>
            <div className="flex-1"></div>
            {/* <a href="/sys-admin/cars/add-new">
              <div className={` ${buttonStyles.button1}`}>Add a new car</div>
            </a> */}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
              gap: "10px",
            }}
          >
            {users &&
              users.map((user) => {
                return (
                  <div
                    className="w-full hover:bg-gray-100 cursor-pointer"
                    style={{
                      border: "1px dashed grey",
                      padding: "15px 10px",
                      borderRadius: "5px",
                    }}
                  >
                    <div className={`${fontBold.className} flex flex-row`}>
                      <div
                        className="flex-[1] text-lg"
                        onClick={() => {
                          window.location.href = `/sys-admin/users/${user.user_ID}`;
                        }}
                      >
                        {user.name}
                        {/* [{user.email}] */}
                      </div>
                      <div
                        onClick={async () => {
                          const res = await fetch("/api/dropUser", {
                            method: "DELETE",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({ user_ID: user.user_ID }),
                          });
                          const data = await res.json();
                          console.log(data);
                          window.location.reload();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-500 hover:text-red-500 cursor-pointer"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                          />
                        </svg>
                      </div>
                    </div>
                    <div
                      className="text-xs"
                      onClick={() => {
                        window.location.href = `/sys-admin/users/${user.user_ID}`;
                      }}
                    >
                      <span className={`${fontBold.className}`}>Email: </span>
                      {user.email}
                    </div>
                    <div
                      className="text-xs"
                      onClick={() => {
                        window.location.href = `/sys-admin/users/${user.user_ID}`;
                      }}
                    >
                      <span className={`${fontBold.className}`}>User ID: </span>
                      {user.user_ID}
                    </div>
                    {/* <div
                      className="text-xs"
                      onClick={() => {
                        window.location.href = `/sys-admin/cars/${user.user_ID}`;
                      }}
                    >
                      <span className={`${fontBold.className}`}>VIN: </span>
                      {car.VIN}
                    </div> */}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

Users.auth = {
  required: true,
  role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
