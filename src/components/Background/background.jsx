import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Menginisialisasi state untuk warna latar belakang dan opsi tampilan warna
const BackgroundColorChanger = () => {
  const [backgroundColor, setBackgroundColor] = useState(
    localStorage.getItem("selectedColor") ||
      "bg-gradient-to-tr from-purple-700 via-purple-500 to-cyan-400 to-90%"
  );

  const [showColorOptions, setShowColorOptions] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Daftar warna dan gambar latar belakang
  const colors = [
    {
      label: "linear-gradient(to top right, #8B5CF6, #5A3FAC, #38B2AC)",
      color:
        "bg-gradient-to-tr from-purple-700 via-purple-500 to-cyan-400 to-90%",
    },
    {
      label: "linear-gradient(to top right, #F472A7, #F273B2, #9864A3)",
      color: "bg-gradient-to-tr from-pink-400 via-pink-300 to-purple-600",
    },
    {
      label: "linear-gradient(to top right, #DD4B4B, #C84141, #AA2929)",
      color: "bg-gradient-to-tr from-red-800 via-red-600 to-red-400",
    },
    {
      label: "linear-gradient(to top right, #68D391, #4BBF81, #3086A0)",
      color: "bg-gradient-to-tr from-green-400 via-green-300 to-blue-500",
    },
    {
      label: "linear-gradient(to top right, #808080, #606060, #404040)",
      color: "bg-gradient-to-tr from-gray-800 via-gray-600 to-gray-400",
    },
    {
      label: "url('/bg-ruang-kelas.png')",
      color: "url('/bg-ruang-kelas.png')",
    },
    {
      label: "url('/2246711.jpg')",
      color: "url('/2246711.jpg')",
    },
    {
      label: "url('/pxfuel (1).jpg')",
      color: "url('/pxfuel (1).jpg')",
    },
    {
      label: "url('/malam.jpg')",
      color: "url('/malam.jpg')",
    },
    {
      label: "url('/pxfuel (1).jpg')",
      color: "url('/pxfuel (1).jpg')",
    },
  ];

  // Fungsi untuk mengganti warna latar belakang
  const changeBackgroundColor = (color) => {
    // Memperbarui state latar belakang
    setBackgroundColor(color.color);
    // Mengatur latar belakang berdasarkan pilihan warna atau gambar
    if (color.color.startsWith("url(")) {
      // If the user is not premium, show a message and return
      if (!isPremium) {
        alert("This feature is only available for premium users.");
        return;
      }
      // Jika background yang dipilih adalah gambar
      document.body.style.backgroundImage = color.color;
    } else {
      // Jika background yang dipilih adalah warna
      document.body.style.backgroundImage = "";
      document.body.className = color.color;
    }
    Cookies.set("selectedColor", color.color, { expires: 365 }); // Simpan pilihan dalam cookie, dengan masa berlaku 365 hari
    setShowColorOptions(false);
  };

  // Fungsi untuk menampilkan/sembunyikan opsi warna
  const toggleColorOptions = () => {
    setShowColorOptions(!showColorOptions);
  };

  // Mengambil warna latar belakang yang disimpan dalam cookie saat komponen dimuat
  useEffect(() => {
    const savedColor = Cookies.get("selectedColor");
    if (savedColor) {
      // Memperbarui state latar belakang
      setBackgroundColor(savedColor);
      if (savedColor.startsWith("url(")) {
        // Jika background yang disimpan adalah gambar
        document.body.style.backgroundImage = savedColor;
      } else {
        // Jika background yang disimpan adalah warna
        document.body.style.backgroundImage = "";
        document.body.className = savedColor;
      }
    }
  }, []);

  return (
    <div className="relative">
      <button
        className="text-white hover:text-blue-200"
        onClick={toggleColorOptions}
      >
        Background
      </button>
      {showColorOptions && (
        <div className="absolute right-0 top-10">
          <div className="bg-white p-2 rounded-lg shadow-md grid grid-cols-5 space-x-2 w-[20vw] items-center">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => changeBackgroundColor(color)}
                className="w-12 h-12 relative"
              >
                <div
                  style={{
                    background: color.label,
                    border:
                      color.color === backgroundColor
                        ? "2px solid blue"
                        : "2px solid white",
                    cursor: "pointer",
                  }}
                  className={`w-10 h-10 rounded-full`}
                ></div>
                <div className="absolute top-0 left-0 p-2 text-black font-bold cursor-pointer">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BackgroundColorChanger;
