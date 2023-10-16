import { useState } from "react";

function ProfilePopup() {
  const [showProfile, setShowProfile] = useState(false);

  const user = {
    fullName: "John Doe",
    email: "john@example.com",
    // Gambar profil (URL gambar atau gambar yang telah diimpor)
    profileImage: "https://example.com/profile-image.jpg",
  };

  const handleChangePassword = () => {
    // Tambahkan logika untuk mengganti kata sandi di sini
    alert("Mengganti kata sandi...");
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
          <div className="bg-white p-4 w-96 rounded-lg shadow-lg">
            <div className="text-center">
              <img
                src={user.profileImage}
                alt="Profil"
                className="w-32 h-32 mx-auto rounded-full"
              />
              <h3 className="text-xl font-semibold mt-2">{user.fullName}</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <hr className="my-4" />
            <button
              onClick={handleChangePassword}
              className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
            >
              Ganti Kata Sandi
            </button>
            <button
              onClick={() => setShowProfile(false)}
              className="bg-gray-200 text-gray-700 rounded px-4 py-2 ml-4 hover:bg-gray-300"
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
