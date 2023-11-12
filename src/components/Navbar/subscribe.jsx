/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { AuthContext } from "../../context/AuthContext";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Subscription = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [token, setToken] = useState("");
  const { currentUser } = useContext(AuthContext);
  const user = currentUser;

  const handleBuyClick = async () => {
    try {
      const date = new Date();

      const data = {
        item: "Premium Plan",
        price: 10000,
      };

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        "https://taskmaster-online-server.vercel.app/api/payment/proses-transaksi",
        // "http://localhost:1000/api/payment/proses-transaksi",
        data,
        config
      );

      const { token, order_id } = response.data; // Destructuring untuk mendapatkan token dan order_id
      localStorage.setItem("x", response.data.order_id);
      setToken(token);

      if (!user || !user.uid) {
        console.error("User is not authenticated"); // Jika tidak ada user yang diautentikasi, log error
        return; // Keluar dari fungsi karena tidak ada user yang diautentikasi
      }

      const paymentRef = doc(db, "payments", order_id); // Gunakan order_id sebagai document id
      await setDoc(paymentRef, {
        userId: user.uid,
        status: "pending",
        email: user.email,
        order_id: order_id,
        expired_date: date,
      });
    } catch (error) {
      console.error("Error in handleBuyClick:", error); // Log jika terjadi kesalahan
    }
  };

  const updateUserStatus = async (userId) => {
    const userRef = doc(db, "users", userId);
    try {
      await updateDoc(userRef, {
        status: "premium", // This assumes there's a 'status' field in the user document
      });
      console.log("User status updated to premium");
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const updatePaymentStatus = async (orderId, statusParam) => {
    const paymentRef = doc(db, "payments", orderId);
    try {
      await updateDoc(paymentRef, {
        status: `${statusParam}`,
      });
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  const updateExpiredDate = async (orderId) => {
    const newExpiredDate = new Date(); // Get the current date
    newExpiredDate.setMonth(newExpiredDate.getMonth() + 1); // Add 1 month

    const paymentRef = doc(db, "payments", orderId);
    try {
      // Perform the update in the Firestore document
      await updateDoc(paymentRef, {
        expired_date: newExpiredDate,
      });
      console.log("Expired date updated");
    } catch (error) {
      console.error("Error updating expired date:", error);
    }
  };

  useEffect(() => {
    let orderId; // Declare orderId in the higher scope

    if (token) {
      window.snap.pay(token, {
        onSuccess: async (result) => {
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setToken("");

          orderId = result.order_id; // Assign orderId here

          if (user && user.uid && orderId) {
            await updateUserStatus(user.uid);
            await updatePaymentStatus(orderId, "Success");
            await updateExpiredDate(orderId);
          }
        },
        onPending: (result) => {
          orderId = result.order_id; // Assign orderId here
          localStorage.setItem("Pembayaran", JSON.stringify(result));
          setToken("");
        },
        onError: async (error) => {
          console.log(error);
          // Make sure orderId is defined before using it
          await updatePaymentStatus(localStorage.getItem("x"), "Failed");
          localStorage.removeItem("x");

          setToken("");
        },
        onClose: async () => {
          console.log("Anda batal pembayaran");
          await updatePaymentStatus(localStorage.getItem("x"), "canceled");
          localStorage.removeItem("x");

          setToken("");
        },
      });
    }
  }, [token, user]);

  useEffect(() => {
    const midtransUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransUrl;

    const midtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    scriptTag.setAttribute("data-client-key", midtransClientKey);

    document.body.appendChild(scriptTag);

    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <button className="" onClick={handleOpenModal} style={{ color: "white" }}>
        Subscribe
      </button>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={handleCloseModal}>
          <div
            className="bg-white p-5 rounded-lg shadow-md w-full max-w-md text-center relative"
            onClick={(e) => e.stopPropagation()}>
            {user ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800">Premium</h2>
                <div className="text-3xl md:text-4xl font-bold my-5">
                  Rp10.000
                  <span className="text-lg md:text-xl text-gray-600">
                    /month
                  </span>
                </div>
                <ul className="text-left list-none p-0">
                  <li className="mb-2 text-gray-800">Unlock New Background</li>
                  <li className="mb-2 text-gray-800">Unlock New Ambient</li>
                  <li className="mb-2 text-gray-800">Unlock Voice Command</li>
                </ul>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-5 focus:outline-none"
                  onClick={handleBuyClick}>
                  Buy
                </button>
              </>
            ) : (
              <>
                <h1 className="text-xl mb-4">Log In to Enjoy Premium</h1>
                <a href="/login">
                  <span className="text-lg bg-purple-900 text-white px-5 py-2 rounded-md">
                    Login
                  </span>
                </a>
              </>
            )}
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 bg-none border-none text-2xl cursor-pointer text-black">
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;
