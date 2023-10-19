import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./profil.css";
import { db } from "../../../src/config/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getAuth, updateProfile } from "firebase/auth";
import { useDropzone } from "react-dropzone";

function ProfilePopup() {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedProfileImage, setEditedProfileImage] = useState("");
  const [user, setUser] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    });
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await auth.signOut();
    setShowProfile(false);
    history("/login");
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedName(user.displayName);
  };

  const handleSaveProfile = async () => {
    if (user) {
      try {
        await updateProfile(user, {
          displayName: editedName,
          photoURL: editedProfileImage,
        });
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          displayName: editedName,
          photoURL: editedProfileImage,
        });

        setIsEditing(false);
        // Berikan pesan sukses atau tindakan responsif lainnya kepada pengguna
        alert("Profil berhasil diperbarui.");
      } catch (error) {
        console.error("Error saving profile:", error);
        // Tampilkan pesan kesalahan kepada pengguna jika terjadi kesalahan
        alert("Gagal menyimpan profil. Silakan coba lagi.");
      }
    }
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setEditedProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

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
            <div className="text-center">
              <div className="image-container" {...getRootProps()}>
                <input {...getInputProps()} />
                <img
                  src={isEditing ? editedProfileImage : user.photoURL}
                  alt="Foto Profil Pengguna"
                  className="profile-image"
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
            {isLoggedIn && !isEditing && (
              <button
                onClick={() => setShowProfile(false)}
                className="action-button bg-gray-200 ml-4"
              >
                Tutup
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePopup;
