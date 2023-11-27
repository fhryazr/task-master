import { useState, useEffect, useContext, useCallback } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { toast, ToastContainer } from "react-toastify";

// Menginisialisasi state untuk warna latar belakang dan opsi tampilan warna

const BackgroundColorChanger = () => {
  const [backgroundColor, setBackgroundColor] = useState(
    localStorage.getItem("selectedColor") ||
      "bg-gradient-to-tr from-purple-700 via-purple-500 to-cyan-400 to-90%"
  );
  const { currentUser } = useContext(AuthContext);
  const user = currentUser;

  const notifyError = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: true,
    });
  };

  const getData = useCallback(async () => {
    const userId = user.uid;
    try {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.data().status === "premium") {
        setIsPremium(true);
      } else {
        setIsPremium(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  const [showColorOptions, setShowColorOptions] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const updateIsPremium = useCallback(async () => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsPremium(userSnap.data().status === "premium");
        }
      } catch (error) {
        console.error("Error updating isPremium:", error);
      }
    } else {
      setIsPremium(false); // Set to false when currentUser is null
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      getData();
    } else {
      setIsPremium(false); // Set to false when currentUser is null
    }
  }, [user, getData]);

  useEffect(() => {
    updateIsPremium();
  }, [user, updateIsPremium]);


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
      label: "url('/bg-ruang-kelas.jpg')",
      color: "url('/bg-ruang-kelas.jpg')",
    },
    {
      label: "url('/work.jpg')",
      color: "url('/work.jpg')",
    },
    {
      label: "url('/laut.jpg')",
      color: "url('/laut.jpg')",
    },
    {
      label: "url('/tree.jpg')",
      color: "url('/tree.jpg')",
    },
    {
      label: "url('/lautan.jpg')",
      color: "url('/lautan.jpg')",
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
        notifyError("This feature is only available for premium users");
        return;
      }
      // Jika background yang dipilih adalah gambar
      document.body.style.backgroundImage = color.color;
      // document.getElementById("top").style.backgroundImage = color.color
    } else {
      // Jika background yang dipilih adalah warna
      document.body.style.backgroundImage = "";
      document.body.className = color.color;
    }
    Cookies.set("selectedColor", color.color, { expires: 365 }); // Simpan pilihan dalam cookie, dengan masa berlaku 365 hari
    // Save to local storage if the user is not logged in
    if (!user) {
      localStorage.setItem("selectedColor", color.color);
    }
    setShowColorOptions(false);
  };

  // Fungsi untuk menampilkan/sembunyikan opsi warna
  const toggleColorOptions = () => {
    setShowColorOptions(!showColorOptions);
  };

  // Mengambil warna latar belakang yang disimpan dalam cookie saat komponen dimuat
  useEffect(() => {
    const savedColor = user ? Cookies.get("selectedColor") : localStorage.getItem("selectedColor");
    if (savedColor) {
      setBackgroundColor(savedColor);
      if (savedColor.startsWith("url(")) {
        document.body.style.backgroundImage = savedColor;
      } else {
        document.body.style.backgroundImage = "";
        document.body.className = savedColor;
      }
    }
  }, [user]);

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
          <div className="bg-white pl-[2.5rem] pt-2 pb-1 rounded-lg shadow-md grid grid-cols-5 w-[22vw] items-center">
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
                >
                  {!isPremium && color.color.startsWith("url(") && (
                    <span
                      className="absolute"
                      style={{
                        fontSize: "0.75rem",
                        top: "50%", // Centers vertically
                        left: "50%", // Centers horizontally
                        transform: "translate(-50%, -50%)", // Ensures true center regardless of element size
                      }}
                    >
                      🔒
                    </span>
                  )}
                </div>
                <div className="absolute top-0 left-0 p-2 text-black font-bold cursor-pointer">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default BackgroundColorChanger;
