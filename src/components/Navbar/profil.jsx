import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profil.css";

function ProfilePopup() {
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Ganti ini sesuai dengan status login yang sesuai
  const [isEditing, setIsEditing] = useState(false); // Status edit profil
  const [editedName, setEditedName] = useState(""); // Nama yang sedang diedit
  const [editedProfileImage, setEditedProfileImage] = useState(""); // URL gambar profil yang sedang diedit
  const history = useNavigate();

  const user = {
    fullName: "John Doe",
    email: "john@example.com",
    profileImage: "https://example.com/profile-image.jpg",
  };

  const handleChangePassword = () => {
    alert("Mengganti kata sandi...");
  };

  const handleLogout = () => {
    history("/login");
    setIsLoggedIn(false);
    setShowProfile(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEditedName(user.fullName);
    setEditedProfileImage(user.profileImage);
  };

  const handleSaveProfile = () => {
    // Simpan perubahan ke profil pengguna di sini
    // Anda dapat mengirim data ke server atau mengganti state sesuai kebutuhan aplikasi Anda
    // Misalnya, Anda dapat menggunakan Axios atau fetch untuk mengirim data ke server
    // Setelah menyimpan profil, Anda bisa mengatur isEditing menjadi false
    setIsEditing(false);
  };

  return (
    <div>
      <button
        className="text-blue-500 hover:underline"
        onClick={() => setShowProfile(!showProfile)}
      >
        Profil
      </button>
      {showProfile && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="profile-popup">
            <div className="text-center">
              <img
                src={isEditing ? editedProfileImage : user.profileImage}
                alt="Profil"
                className="profile-image"
              />
              {isEditing ? (
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
              ) : (
                <h3 className="text-xl font-semibold mt-2">{user.fullName}</h3>
              )}
              <p className="text-gray-600">{user.email}</p>
            </div>
            <hr className="my-4" />
            {isEditing ? (
              <div>
                <input
                  type="text"
                  value={editedProfileImage}
                  onChange={(e) => setEditedProfileImage(e.target.value)}
                />
              </div>
            ) : (
              <button
                onClick={handleChangePassword}
                className="action-button bg-blue-500"
              >
                Ganti Kata Sandi
              </button>
            )}
            {isLoggedIn && (
              <div>
                {isEditing ? (
                  <button
                    onClick={handleSaveProfile}
                    className="action-button bg-green-500"
                  >
                    Simpan Profil
                  </button>
                ) : (
                  <button
                    onClick={handleEditProfile}
                    className="action-button bg-blue-500"
                  >
                    Edit Profil
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="action-button bg-red-500 ml-4"
                >
                  Log Out
                </button>
              </div>
            )}
            <button
              onClick={() => setShowProfile(false)}
              className="action-button bg-gray-200"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePopup;
