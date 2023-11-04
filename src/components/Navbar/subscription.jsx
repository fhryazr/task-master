/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../src/config/FirebaseConfig";

function Subscription() {
  const [showPopup, setShowPopup] = useState(false);
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const handleRocketClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const handleBuyClick = async () => {
    try {
      const data = {
        item: "Premium Plan",
        price: 15000,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.post(
        "http://localhost:1000/api/payment/proses-transaksi",
        data,
        config
      );
      setToken(response.data.token);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: async (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          if (user) {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { premium: true });
            setUser({ ...user, premium: true });
          }
          setToken("");
        },
        onPending: (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setToken("");
        },
        onError: (error) => {
          console.log(error);
          setToken("");
        },
        onClose: () => {
          console.log("Anda belum menyelesaikan pembayaran");
          setToken("");
        },
      });
    }
  }, [token]);

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;

    const midtransClientKey = "SB-Mid-client-VC2kHjBBqXVV8OBr";
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <div className="container my-24 mx-auto md:px-6 xl:px-32">
      {/* Tombol Roket untuk Membuka Pop-up Subscription */}
      <button className="rocket-button" onClick={handleRocketClick}>
        <img src="rocket-icon.png" alt="Rocket" className="rocket-icon" />
      </button>
      {/* Section: Design Block */}
      <section className="mb-32">
        <div className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
          <div className="flex flex-wrap items-center">
            <div className="block w-full shrink-0 grow-0 basis-auto lg:flex lg:w-6/12 xl:w-4/12">
              <img
                src="https://tecdn.b-cdn.net/img/new/ecommerce/vertical/004.jpg"
                alt="Trendy Pants and Shoes"
                className="w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg"
              />
            </div>
            <div className="w-full shrink-0 grow-0 basis-auto lg:w-6/12 xl:w-8/12">
              <div className="px-6 py-12 md:px-12">
                <h2 className="mb-6 pb-2 text-4xl font-bold">Premium Plan</h2>
                <p className="mb-6 pb-2 text-neutral-500 dark:text-neutral-300">
                  What do you get?
                </p>
                <div className="mb-6 flex flex-wrap">
                  <div className="mb-6 w-full md:w-4/12 lg:w-6/12 xl:w-4/12">
                    <p className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="mr-3 h-5 w-5 text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Unlimited Voice Command
                    </p>
                  </div>
                  <div className="mb-6 w-full md:w-4/12 lg:w-6/12 xl:w-4/12">
                    <p className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="mr-3 h-5 w-5 text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Analytics
                    </p>
                  </div>
                  <div className="mb-6 w-full md:w-4/12 lg:w-6/12 xl:w-4/12">
                    <p className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="mr-3 h-5 w-5 text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      More Background Option
                    </p>
                  </div>
                  <div className="mb-6 w-full md:w-4/12 lg:w-6/12 xl:w-4/12">
                    <p className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="mr-3 h-5 w-5 text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Updates
                    </p>
                  </div>
                  <div className="mb-6 w-full md:w-4/12 lg:w-6/12 xl:w-4/12">
                    <p className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="mr-3 h-5 w-5 text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Reports
                    </p>
                  </div>
                  <div className="mb-6 w-full md:w-4/12 lg:w-6/12 xl:w-4/12">
                    <p className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="mr-3 h-5 w-5 text-success"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Mobile
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-block rounded bg-primary px-12 pt-3.5 pb-3 text-sm font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={handleBuyClick} // Tambahkan event handler onClick
                >
                  Buy now $1.99/Month
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {showPopup && (
        <div className="subscription-popup">
          <div className="subscription-content">
            <h2>Subscription Details</h2>
            <p>What you get with the premium plan goes here.</p>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Subscription;
