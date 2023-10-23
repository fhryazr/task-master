import { useState, useEffect, useContext, useRef } from "react";
import "./profil.css";
import { db } from "../../../src/config/FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function ProfilePopup() {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState();
  const [editedProfileImage, setEditedProfileImage] = useState("defaultProfilePicture.jpg");
  const [user, setUser] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const [file, setFile] = useState();
  const inputRef = useRef();
  const storage = getStorage();

  useEffect(() => {
    const fetchUserProfileData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        setIsLoggedIn(true);
        setUser(user);

        try {
          const userDocRef = doc(db, "users", user.uid);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setEditedProfileImage(userData.img);
            setEditedName(userData.displayName);
          }
        } catch (error) {
          console.error("Error fetching user document:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    fetchUserProfileData();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    dispatch({ type: "LOGOUT" });
    setShowProfile(false);
    setIsLoggedIn(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (user) {
      try {
        if (file) {
          // Jika ada file gambar yang diunggah, unggah ke Firebase Storage
          const storageRef = ref(
            storage,
            `user-profiles/${user.uid}/${file.name}`
          );
          await uploadBytes(storageRef, file);

          // Perbarui foto profil pengguna dengan URL gambar yang diunggah
          const updatedFileURL = await getDownloadURL(storageRef);
          setEditedProfileImage(updatedFileURL); // Perbarui URL gambar di state

          // Perbarui field `displayName` dan `img` di Firestore
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            displayName: editedName,
            img: updatedFileURL,
          });

          setUser({ ...user, displayName: editedName, img: updatedFileURL });
        } else {
          // Jika tidak ada gambar yang diunggah, hanya perbarui field `displayName` di Firestore
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            displayName: editedName,
          });
          setUser({ ...user, displayName: editedName });
        }

        setIsEditing(false);
        alert("Profil berhasil diperbarui.");
      } catch (error) {
        console.error("Error saving profile:", error);
        alert("Gagal menyimpan profil. Silakan coba lagi. Error: " + error.message);
      }
    }
  };

  function handleChange(e) {
    // Set file yang dipilih oleh pengguna
    setFile(e.target.files[0]);
    // Set gambar yang ditampilkan di preview
    setEditedProfileImage(URL.createObjectURL(e.target.files[0]));
  }

  return (
    <div>
      {isLoggedIn ? (
        <button
          className="text-white hover:text-blue-200"
          onClick={() => setShowProfile(!showProfile)}
        >
          Profile
        </button>
      ) : null}
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="profile-popup">
            {isLoggedIn && !isEditing && (
              <button
                onClick={() => setShowProfile(false)}
                className="close-button"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            )}
            <div className="text-center">
              <div
                className="image-container"
                onClick={() => inputRef.current.click()}
                style={{ cursor: "pointer" }}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleChange}
                />
                <img
                  src={
                    isEditing
                      ? editedProfileImage
                      : file
                      ? URL.createObjectURL(file)
                      : editedProfileImage
                  }
                  alt="Foto Profil Pengguna"
                  className="profile-image items-center justify-center"
                />
              </div>

              {isEditing ? (
                <button
                  className="action-button bg-blue-500"
                  onClick={handleSaveProfile}
                >
                  Simpan Profil
                </button>
              ) : (
                <h3 className="text-xl font-semibold mt-2">
                  {editedName}
                </h3>
              )}
              <p className="text-gray-600">{user.email}</p>
            </div>
            <hr className="my-4" />
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Username"
                />
                <button
                  onClick={() => setIsEditing(false)}
                  className="action-button bg-gray-200"
                >
                  Batal
                </button>
              </div>
            ) : (
              <button
                onClick={handleEditProfile}
                className="action-button bg-blue-500"
              >
                Edit Profil
              </button>
            )}
            {isLoggedIn && !isEditing && (
              <button
                onClick={handleLogout}
                className="action-button bg-red-500 ml-4"
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePopup;
