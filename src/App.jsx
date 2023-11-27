/* eslint-disable react/prop-types */
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import Login from "./pages/login";
import Register from "./pages/register";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import ForgotPassword from "./components/Login/reset";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./config/FirebaseConfig";
import NotFound from "./pages/NotFound";

const App = () => {
  const [isUserAdmin, setIsUserAdmin] = useState(null); // Menggunakan null untuk menunjukkan bahwa data belum diambil
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      setIsUserAdmin(null); // Reset nilai isUserAdmin saat pengguna logout
      const userId = currentUser.uid;
      const docRef = doc(db, "users", userId);

      const unsubscribe = onSnapshot(docRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.roles === "admin") {
            setIsUserAdmin(true);
          } else {
            setIsUserAdmin(false);
          }
        }
      });

      return () => {
        // Berhenti mendengarkan ketika komponen dibongkar
        unsubscribe();
      };
    } else {
      setIsUserAdmin(false); // Pengguna belum login, tidak memiliki role "admin"
    }
  }, [currentUser]);

  // Memeriksa apakah data telah diambil, jika belum, tampilkan pesan "Loading..."
  if (isUserAdmin === null) {
    return <div className="h-screen w-screen flex justify-center items-center bg-black bg-opacity-10"><span className="loading loading-infinity w-[5vh] text-white">Loading</span></div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin/*"
          element={
            isUserAdmin ? (
              <AdminPage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="register" element={<Register />} />
        <Route
          path="/login"
          element={
            currentUser ? (
              <Navigate to="/" />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/reset" element={<ForgotPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
