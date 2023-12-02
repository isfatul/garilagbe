"use Client";

import AdminWrapper from "@/components/adminWrapper";
import Image from "next/image";
import logo from "@/pages/assets/Garilagbe.png";
import localFont from "next/font/local";
import { useSession } from "next-auth/react";
import buttonStyles from "@/styles/buttons.module.css";

const font = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Cars() {
  const { data: session } = useSession();
  return (
    <AdminWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div className="flex flex-row w-full align-center text-center justify-space-between">
            <div className={`py-1 ${fontBold.className} text-lg`}>Cars (0)</div>
            <div className="flex-1"></div>
            <a href="/sys-admin/cars/add-new">
              <div className={` ${buttonStyles.button1}`}>Add a new car</div>
            </a>
          </div>
          <div></div>
        </div>
      </div>
    </AdminWrapper>
  );
}

Cars.auth = {
  required: true,
  role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
