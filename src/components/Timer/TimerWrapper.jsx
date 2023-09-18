import { useState } from "react";
import Timer from "./Timer";

const TimerWrapper = () => {
  const [currentMode, setCurrentMode] = useState("focus"); // Mode default adalah "focus"
  const [shortBreakCount, setShortBreakCount] = useState(0); // Jumlah Short Break yang sudah dilakukan

  const modes = {
    focus: {
      label: "Focus",
      duration: 0, // Durasi mode Focus dalam menit
      seconds_duration: 5,
    },
    shortBreak: {
      label: "Short Break",
      duration: 0,
      seconds_duration: 2, // Durasi mode Short Break dalam menit
    },
    longBreak: {
      label: "Long Break",
      duration: 0, // Durasi mode Long Break dalam menit
      seconds_duration: 3,
    },
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  // Fungsi untuk menambah jumlah Short Break yang sudah dilakukan
  const incrementShortBreakCount = () => {
    setShortBreakCount(shortBreakCount + 1);
  };

  // Logika untuk mengatur mode selanjutnya berdasarkan jumlah Short Break yang sudah dilakukan
  const getNextMode = () => {
    if (shortBreakCount < 2) {
      // Jika belum mencapai 2 Short Break, ganti ke Short Break berikutnya
      return "shortBreak";
    } else {
      // Jika sudah melakukan 2 Short Break, ganti ke Long Break
      setShortBreakCount(0); // Reset jumlah Short Break
      return "longBreak";
    }
  };

  // Check apakah currentMode adalah kunci yang valid dalam modes sebelum mengakses propertinya
  const currentModeData = modes[currentMode] || { duration: 0 };

  return (
    <div className="TimerWrapper">
      <div className="mode-buttons">
        {Object.keys(modes).map((modeKey) => (
          <button
            key={modeKey}
            onClick={() => handleModeChange(modeKey)}
            className={currentMode === modeKey ? "active" : ""}
          >
            {modes[modeKey].label}
          </button>
        ))}
      </div>
      <Timer
        mode={currentMode}
        duration={currentModeData.duration}
        setCurrentMode={(mode) => {
          // Handle logika perubahan mode di sini
          if (mode === "shortBreak") {
            incrementShortBreakCount(); // Tambah jumlah Short Break yang sudah dilakukan
            setCurrentMode(getNextMode()); // Ganti ke mode selanjutnya
          } else {
            setCurrentMode(mode);
          }
        }}
        seconds_duration={currentModeData.seconds_duration}
      />
    </div>
  );
};

export default TimerWrapper;
