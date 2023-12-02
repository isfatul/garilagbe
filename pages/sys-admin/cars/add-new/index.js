import AdminWrapper from "@/components/adminWrapper";
import Image from "next/image";
import Router from "next/router";
import localFont from "next/font/local";

const font = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function index() {
  return (
    <AdminWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div className="flex flex-row">
            <div
              className="flex flex-row cursor-pointer hover:text-gray-1000"
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
            <div className={`${fontBold.className} flex-1 text-center`}>
              Add a new car
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </AdminWrapper>
  );
}
