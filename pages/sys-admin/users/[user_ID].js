import AdminWrapper from "@/components/adminWrapper";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Router from "next/router";
import { useSession } from "next-auth/react";
import localFont from "next/font/local";
import Image from "next/image";
import PP from "@/pages/assets/pp.webp";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function UserDetails() {
  const router = useRouter();
  const user_ID = router.query.user_ID;
  const [user, setUser] = useState();

  const { data: session } = useSession();

  const getUserDetails = async () => {
    try {
      const res = await fetch("/api/getUserDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_ID: user_ID,
        }),
      });
      const data = await res.json();

      setUser(data[0]);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user_ID) {
      getUserDetails();
    }
  }, [user_ID]);

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
              User Details
            </div>
          </div>
          <div className={`flex md:flex-row flex-col-reverse justify`}>
            <div className="flex-[1] md:mt-0 mt-3">
              <div>
                <span className={fontBold.className}>User ID:</span> {user_ID}
              </div>
              <br />
              <div className="text-lg">
                <span className={fontBold.className}>User Info </span>
              </div>
              <div>
                <span className={fontBold.className}>Name: </span>
                {user && user.name}
              </div>
              <div>
                <span className={fontBold.className}>Email: </span>
                {user && user.email}
              </div>
              <div>
                <span className={fontBold.className}>Phone: </span>
                {user && user.phone}
              </div>
              <br />
              <div className="text-lg">
                <span className={fontBold.className}>Rentals </span>
              </div>
            </div>
            <div>
              <Image
                src={user && user.profile_pic ? user.profile_pic : PP}
                width={300}
                height={300}
                alt="Profile Picture"
                className="h-100 w-100"
                style={{ objectFit: "cover", borderRadius: "15px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

UserDetails.auth = {
  required: true,
  role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
