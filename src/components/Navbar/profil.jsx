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
  const [editedProfileImage, setEditedProfileImage] = useState(
    "No_Profile_Picture.jpg"
  );
  const [user, setUser] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const [file, setFile] = useState();
  const [showImagePopup, setShowImagePopup] = useState(false);
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
          setIsEditing(false);

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
        alert(
          "Gagal menyimpan profil. Silakan coba lagi. Error: " + error.message
        );
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
    <div className="flex">
      {isLoggedIn && (
        <button
          className="text-white hover:text-blue-200"
          onClick={() => setShowProfile(!showProfile)}>
          <div className="relative">
            <img
              src={editedProfileImage}
              alt="Profile"
              className="w-9 h-9 rounded-full"
            />
          </div>
        </button>
      )}
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="profile-popup">
            {isLoggedIn && !isEditing && (
              <div
                onClick={() => setShowProfile(false)}
                className="close-button flex justify-end">
                <FontAwesomeIcon icon={faTimes} />
              </div>
            )}
            <div className="text-center flex flex-col items-center justify-center">
              <div
                className="image-container"
                onClick={() => isEditing && inputRef.current.click()}
                style={{ cursor: "pointer" }}>
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
                  onClick={() => !isEditing && setShowImagePopup(true)}
                />
              </div>
              <h3 className="text-xl font-semibold mt-2">{editedName}</h3>
              <p className="text-gray-600">{user.email}</p>
              {showImagePopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                  <div className="popup-image">
                    <img
                      src={editedProfileImage}
                      alt="Gambar Profil"
                      className="popup-image-content"
                    />
                    <button
                      onClick={() => setShowImagePopup(false)}
                      className="popup-close-button">
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <hr className="my-4" />
            <div className="flex justify-center">
              {isEditing ? (
                <div className="flex flex-col w-full">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Username"
                  />
                  <div className="flex justify-center gap-3">
                    <button
                      className="action-button bg-blue-500"
                      onClick={handleSaveProfile}>
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="action-button bg-red-500">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleEditProfile}
                  className="action-button bg-blue-500">
                  Edit Profil
                </button>
              )}
              {isLoggedIn && !isEditing && (
                <button
                  onClick={handleLogout}
                  className="action-button bg-red-500 ml-4">
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePopup;
