import { useState, useEffect } from "react";

const BackgroundColorChanger = () => {
  const [backgroundColor, setBackgroundColor] = useState(
    localStorage.getItem("selectedColor") ||
      "bg-gradient-to-tr from-purple-700 via-purple-500 to-cyan-400 to-90%"
  );

  const [showColorOptions, setShowColorOptions] = useState(false);

  const colors = [
    {
      label: "Purple",
      color:
        "bg-gradient-to-tr from-purple-700 via-purple-500 to-cyan-400 to-90%",
    },
    {
      label: "Pink",
      color: "bg-gradient-to-tr from-pink-400 via-pink-300 to-purple-600",
    },
    {
      label: "Red",
      color: "bg-gradient-to-tr from-red-800 via-red-600 to-red-400",
    },
    {
      label: "Green",
      color: "bg-gradient-to-tr from-green-400 via-green-300 to-blue-500",
    },
    {
      label: "Yellow",
      color: "bg-gradient-to-tr from-gray-800 via-gray-600 to-gray-400",
    },
    {
      label: "Ruangan",
      color: "url('/bg-ruang-kelas.png')",
    },
    {
      label: "Pegunungan",
      color: "url('/2246711.jpg')",
    },
    {
      label: "Semi",
      color: "url('/pxfuel (1).jpg')",
    },
  ];

  const changeBackgroundColor = (color) => {
    setBackgroundColor(color.color);
    if (color.color.startsWith("url(")) {
      // Jika background yang dipilih adalah gambar
      document.body.style.backgroundImage = color.color;
    } else {
      // Jika background yang dipilih adalah warna
      document.body.style.backgroundImage = "";
      document.body.className = color.color;
    }
    localStorage.setItem("selectedColor", color.color);
    setShowColorOptions(false);
  };

  const toggleColorOptions = () => {
    setShowColorOptions(!showColorOptions);
  };

  useEffect(() => {
    const savedColor = localStorage.getItem("selectedColor");
    if (savedColor) {
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
          <div className="bg-white p-2 rounded-lg shadow-md flex space-x-2">
            {colors.map((color, index) => (
              <div
                key={index}
                onClick={() => changeBackgroundColor(color)}
                className="w-12 h-12 relative"
              >
                <div
                  style={{
                    background: color.color,
                    border:
                      color.color === backgroundColor
                        ? "2px solid white"
                        : "2px solid",
                    cursor: "pointer",
                  }}
                  className="w-10 h-10 rounded-full"
                ></div>
                <div className="absolute top-0 left-0 p-2 text-black font-bold cursor-pointer">
                  {index + 1}
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
