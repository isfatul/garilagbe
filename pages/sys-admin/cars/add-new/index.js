import { useState, useRef } from "react";
import AdminWrapper from "@/components/adminWrapper";
import Image from "next/image";
import Router from "next/router";
import localFont from "next/font/local";
import buttonStyles from "@/styles/buttons.module.css";

const font = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-regular.otf",
});
const fontBold = localFont({
  src: "../../../assets/font/TeX-Gyre-Adventor/texgyreadventor-bold.otf",
});

export default function Addnew() {
  const [hasInsurance, setHasInsurance] = useState(null);

  const [error, setError] = useState();
  // const { session, loading } = useSession();
  const [loading, setLoading] = useState(false);

  const nameRef = useRef();
  const plateRef = useRef();
  const vinRef = useRef();
  const colorRef = useRef();
  const bodyRef = useRef();
  const makeRef = useRef();
  const yearRef = useRef();
  const seatsRef = useRef();
  const heightRef = useRef();
  const doorsRef = useRef();
  const insuranceRef = useRef();
  const coverageRef = useRef();
  const companyRef = useRef();
  const policyRef = useRef();
  const expirationRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    setError();
    setLoading(true);
    const name = nameRef.current.value;
    const plate = plateRef.current.value;
    const vin = vinRef.current.value;
    const color = colorRef.current.value;
    const body = bodyRef.current.value;
    const make = makeRef.current.value;
    const year = yearRef.current.value;
    const seats = seatsRef.current.value;
    const height = heightRef.current.value;
    const doors = doorsRef.current.value;
    var insurance = hasInsurance ? insuranceRef.current.value : null;

    if (!hasInsurance) {
      var coverage =
        !hasInsurance || hasInsurance !== null
          ? coverageRef.current.value
          : null;
      var company =
        !hasInsurance || hasInsurance !== null
          ? companyRef.current.value
          : null;
      var policy =
        !hasInsurance || hasInsurance !== null ? policyRef.current.value : null;
      var expiration =
        !hasInsurance || hasInsurance !== null
          ? expirationRef.current.value
          : null;

      const insuranceResult = await fetch("/api/cars/add-insurance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coverage,
          company,
          policy_no: policy,
          exp_date: expiration,
        }),
      });
      if (!insuranceResult.ok) {
        setError("Insurance could not be added");
        return;
      } else {
        const insuranceResultJS = await insuranceResult.json();
        insurance = insuranceResultJS.insurance_id;
      }
    }

    if (insurance) {
      const result = await fetch("/api/cars/add-new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          number_plate: plate,
          VIN: vin,
          color,
          body,
          make,
          year,
          seats,
          height,
          doors,
          insurance_id: insurance,
        }),
      });
      // console.log(result);
      if (!result.ok) {
        setError("Error adding car");
        setLoading(false);
        return;
      } else {
        window.location.href = "/sys-admin/cars";
      }
    } else {
      setError("Insurance ID not found");
      setLoading(false);
    }
  }

  return (
    <AdminWrapper>
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg  mt-14">
          <div className="flex flex-row mb-8">
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
          <div
            className={`text-right ${fontBold.className}`}
            style={{ color: "red" }}
          >
            {error}
          </div>
          <form onSubmit={handleSubmit} className={`flex flex-col`}>
            <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
              <div className="flex-[1] min-w-[300px]">
                <div className={`${fontBold.className} text-xs`}>
                  Name <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="text"
                  ref={nameRef}
                  placeholder="Name"
                  required
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
              <div className="md:w-4 h-2"></div>
              <div className="flex-[0.5]">
                <div className={`${fontBold.className} text-xs`}>
                  Plate Number <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="text"
                  ref={plateRef}
                  required
                  placeholder="Plate Number"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
            </div>
            <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>
                  VIN <span style={{ color: "red" }}>*</span>
                </div>
                <input
                  type="text"
                  ref={vinRef}
                  required
                  placeholder="VIN"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
              <div className="md:w-4 h-2"></div>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>Color</div>
                <input
                  type="text"
                  ref={colorRef}
                  placeholder="Color"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
              <div className="md:w-4 h-2"></div>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>Body</div>
                <input
                  type="text"
                  ref={bodyRef}
                  placeholder="Body"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
            </div>
            <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>Make</div>
                <input
                  type="text"
                  placeholder="Make"
                  ref={makeRef}
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
              <div className="md:w-4 h-2"></div>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>Year</div>
                <input
                  type="number"
                  min={1900}
                  max={2023}
                  ref={yearRef}
                  placeholder="Year"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
              <div className="md:w-4 h-2"></div>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>Seats</div>
                <input
                  type="number"
                  min={2}
                  max={30}
                  ref={seatsRef}
                  placeholder="Seats"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
            </div>
            <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>Height</div>
                <input
                  type="text"
                  placeholder="Height"
                  ref={heightRef}
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
              <div className="md:w-4 h-2"></div>
              <div className="flex-[1]">
                <div className={`${fontBold.className} text-xs`}>Doors</div>
                <input
                  type="number"
                  min={2}
                  ref={doorsRef}
                  placeholder="Doors"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                />
              </div>
              <div className="md:w-4 h-2"></div>
              <div className="flex-[1]">
                {/* <div className={`${fontBold.className} text-xs`}>
                  Insurance ID
                </div>
                <input
                  type="text"
                  placeholder="Insurance ID"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                /> */}
              </div>
            </div>
            <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
              <div className="flex-[1]">
                {/* <div className={`${fontBold.className} text-xs`}>
                  Insurance ID
                </div>
                <input
                  type="text"
                  placeholder="Insurance ID"
                  className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                /> */}
                <div className={`${fontBold.className}`}>Documents</div>
                <div>Does this car have a valid insurance listed?</div>
                <input
                  type="radio"
                  id="yes"
                  name="insurance"
                  value="yes"
                  onClick={() => setHasInsurance(true)}
                />{" "}
                Yes <div className="w-4"></div>
                <input
                  type="radio"
                  id="no"
                  name="insurance"
                  value="no"
                  onClick={() => setHasInsurance(false)}
                />{" "}
                No
                {hasInsurance && (
                  <>
                    <div className={`${fontBold.className} text-xs mt-4`}>
                      Insurance ID
                    </div>
                    <input
                      type="text"
                      ref={insuranceRef}
                      placeholder="Insurance ID"
                      className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                    />
                  </>
                )}
                {!hasInsurance && hasInsurance !== null && (
                  <div className="flex md:flex-row flex-col">
                    <div className="flex-1">
                      <div className={`${fontBold.className} text-xs mt-4`}>
                        Coverage
                      </div>
                      <input
                        type="text"
                        ref={coverageRef}
                        placeholder="Coverage"
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                    <div className="md:w-4 h-2"></div>
                    <div className="flex-1">
                      <div className={`${fontBold.className} text-xs mt-4`}>
                        Company
                      </div>
                      <input
                        type="text"
                        ref={companyRef}
                        placeholder="Company"
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                    <div className="md:w-4 h-2"></div>
                    <div className="flex-1">
                      <div className={`${fontBold.className} text-xs mt-4`}>
                        Policy Number
                      </div>
                      <input
                        type="text"
                        ref={policyRef}
                        placeholder="Policy Number"
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                    <div className="md:w-4 h-2"></div>
                    <div className="flex-1">
                      <div className={`${fontBold.className} text-xs mt-4`}>
                        Expiration Date
                      </div>
                      <input
                        type="date"
                        ref={expirationRef}
                        placeholder="Expiration Date"
                        className="w-full border-2 border-gray-400 rounded-md p-2 mt-2 "
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={`flex md:flex-row flex-col md:mb-4 mb-2`}>
              <div className="flex-[1]"></div>
              {!loading ? (
                <div
                  onClick={handleSubmit}
                  className={`${buttonStyles.button1}`}
                >
                  Add Car
                </div>
              ) : (
                <div className={`${buttonStyles.button1}`}>Adding car...</div>
              )}
              <div className="flex-[1]"></div>
            </div>
          </form>
        </div>
      </div>
    </AdminWrapper>
  );
}

Addnew.auth = {
  required: true,
  role: "admin",
  loading: <div>Loading...</div>,
  redirect: "/sys-admin/login",
};
