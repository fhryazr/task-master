import New from "./new/New";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig"; // Gantilah sesuai dengan impor Firestore Anda

function Edit() {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Buat fungsi async untuk mengambil data pengguna dari Firestore
    async function fetchUserData() {
      try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          setUserData(userData);
        } else {
          console.log("Data pengguna tidak ditemukan.");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    }

    fetchUserData();
  }, [userId]);

  const userInputs = [
    {
      id: "username",
      label: "Username",
      type: "text",
      placeholder: "john_doe",
      value: userData ? userData.username : "", // Menggunakan nilai userData jika tersedia
    },
    {
      id: "displayName",
      label: "Name",
      type: "text",
      placeholder: "John Doe",
      value: userData ? userData.displayName : "",
    },
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "john_doe@gmail.com",
      value: userData ? userData.email : "",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Password",
      value: "", // Jangan menampilkan kata sandi sebagai nilai awal
    },
    {
      id: "roles",
      label: "Roles",
      type: "text",
      placeholder: "User/Admin",
      value: userData ? userData.roles : "",
    },
    {
      id: "status",
      label: "Status",
      type: "text",
      placeholder: "Free/Premium",
      value: userData ? userData.status : "",
    },
  ]

  return (
    <New inputs={userInputs} title={"Edit Data User"} mode="edit"/>
  );
}

export default Edit;
