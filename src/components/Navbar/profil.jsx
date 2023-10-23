import { useState, useEffect, useContext, useRef } from "react";
import "./profil.css";
import { db } from "../../../src/config/FirebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

function ProfilePopup() {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState();
  const [editedProfileImage, setEditedProfileImage] = useState(null);
  const [user, setUser] = useState(null);
  const { dispatch } = useContext(AuthContext);
  const [file, setFile] = useState();
  const inputRef = useRef();
  const storage = getStorage();

  const fetchUserProfileImage = () => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);

      getDoc(userDocRef)
        .then((doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setEditedProfileImage(userData.photoURL);
          }
        })
        .catch((error) => {
          console.error("Error fetching user document:", error);
        });
    }
  };

  const getFirstNameFromEmail = (email) => {
    // Memisahkan alamat email untuk mendapatkan nama awal
    const emailParts = email.split("@");
    if (emailParts.length > 0) {
      return emailParts[0];
    } else {
      return email; // Gunakan alamat email sebagai nama awal jika pemisahan gagal
    }
  };

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        fetchUserProfileImage();
        const firstname = getFirstNameFromEmail(user.email);
        setEditedName(firstname);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
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
    setEditedName(user.displayName);
  };

  const handleSaveProfile = async () => {
    if (user) {
      try {
        // Jika ada file gambar yang diunggah, unggah ke Firebase Storage
        if (file) {
          const storageRef = ref(
            storage,
            `user-profiles/${user.uid}/${file.name}`
          );
          await uploadBytes(storageRef, file, {
            /* metadata opsional */
          });
          const updatedFileURL = await getDownloadURL(storageRef);

          // Perbarui foto profil pengguna dengan URL gambar yang diunggah
          await updateProfile(user, {
            photoURL: updatedFileURL,
            displayName: editedName,
          });
          // Simpan URL gambar di database
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, {
            displayName: editedName,
            email: user.email,
            photoURL: updatedFileURL,
          });
          setUser({ ...user, displayName: editedName });

          setEditedProfileImage(updatedFileURL); // Perbarui URL gambar di state
        } else {
          // Jika tidak ada gambar yang diunggah, tetap simpan data lainnya di database
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, {
            displayName: editedName,
            email: user.email,
            photoURL: editedProfileImage,
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
                      : user.photoURL
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
                  {user.displayName}
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
