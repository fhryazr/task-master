import { useState } from "react";

function InfoBox() {
  const [isVisible, setIsVisible] = useState(false);

  // Fungsi untuk menampilkan atau menyembunyikan kotak informasi
  const toggleInfo = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div>
      <button onClick={toggleInfo} className="text-white hover:text-blue-200">
        Info
      </button>
      {isVisible && (
        <div className="bg-blue-500 text-white p-4 mt-4">
          <p>Ini adalah kotak informasi.</p>
          <p>Isi informasi Anda di sini.</p>
          <p>Klik tombol "Info" lagi untuk menyembunyikan kotak ini.</p>
        </div>
      )}
    </div>
  );
}

export default InfoBox;
