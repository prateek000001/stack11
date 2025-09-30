import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import Contact from "../components/Contact";
import InterestedButton from "../components/InterestedButton";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Agreement states
  const [contact, setContact] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [checked, setChecked] = useState(false);

  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // Fetch listing and landlord email
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (!data || data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }

        // Fetch landlord email if missing
        if (!data.userEmail && data.userRef) {
          try {
            const userRes = await fetch(`/api/user/${data.userRef}`);
            const userData = await userRes.json();
            data.userEmail = userData.email || "";
          } catch (err) {
            console.error("Error fetching landlord email:", err);
            data.userEmail = "";
          }
        }

        setListing(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  // Debugging
  useEffect(() => {
    if (listing) {
      console.log("Listing object:", listing);
      console.log("Landlord email:", listing.userEmail);
      console.log("Current user:", currentUser);
    }
  }, [listing, currentUser]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}

      {listing && !loading && !error && (
        <div>
          {/* Image Swiper */}
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Copy Link */}
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}

          {/* Listing Details */}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-2xl font-semibold">
              {listing.name} - $
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>

            <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
              <FaMapMarkerAlt className="text-green-700" />
              {listing.address}
            </p>

            <div className="flex gap-4">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {listing.offer && (
                <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  ${+listing.regularPrice - +listing.discountPrice} OFF
                </p>
              )}
            </div>

            <p className="text-slate-800">
              <span className="font-semibold text-black">Description - </span>
              {listing.description}
            </p>

            <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBed className="text-lg" />
                {listing.bedrooms} {listing.bedrooms > 1 ? "beds" : "bed"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaBath className="text-lg" />
                {listing.bathrooms} {listing.bathrooms > 1 ? "baths" : "bath"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaParking className="text-lg" />
                {listing.parking ? "Parking spot" : "No Parking"}
              </li>
              <li className="flex items-center gap-1 whitespace-nowrap">
                <FaChair className="text-lg" />
                {listing.furnished ? "Furnished" : "Unfurnished"}
              </li>
            </ul>

            {/* Show Interested button only if user is not owner */}
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <>
                {listing.type === "rent" && !agreed && (
                  <button
                    onClick={() => setShowTerms(true)}
                    className="bg-slate-700 hover:bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                  >
                    View Terms & Conditions
                  </button>
                )}

                {listing.type === "rent" &&
                  agreed &&
                  listing.userEmail &&
                  !contact && (
                    <InterestedButton
                      landlordEmail={listing.userEmail}
                      currentUser={currentUser}
                      onSuccess={() => setContact(false)}
                    />
                  )}

                {listing.type === "sale" && (
                  <button
                    onClick={() => setContact(true)}
                    className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
                  >
                    Contact landlord
                  </button>
                )}
              </>
            )}

            {contact && <Contact listing={listing} />}
          </div>

          {/* Terms & Conditions Modal */}
          {showTerms && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
              <div className="bg-white w-11/12 max-w-2xl p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                  Rental Terms & Conditions
                </h2>
                <p className="text-sm text-gray-700 mb-4">
                  Please read the following terms carefully before proceeding:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                  <li>2 recent passport size photographs.</li>
                  <li>Valid Aadhaar card or government-issued ID.</li>
                  <li>Latest electricity and water bills.</li>
                  <li>1 guarantor with valid ID and photo.</li>
                  <li>Security deposit must be paid before possession.</li>
                  <li>Tenant must maintain property.</li>
                  <li>Rent must be paid before 5th each month.</li>
                  <li>Subletting without permission prohibited.</li>
                  <li>All disputes under local jurisdiction.</li>
                </ul>

                <div className="mt-6 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="agreeCheck"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="agreeCheck" className="text-sm text-gray-700">
                    I have read and understood all the terms & conditions.
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowTerms(false)}
                    className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Close
                  </button>
                  <button
                    disabled={!checked}
                    onClick={() => {
                      setAgreed(true);
                      setShowTerms(false);
                    }}
                    className={`px-4 py-2 rounded-md text-white ${
                      checked
                        ? "bg-slate-700 hover:bg-slate-700"
                        : "bg-slate-500 cursor-not-allowed"
                    }`}
                  >
                    Accept
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
