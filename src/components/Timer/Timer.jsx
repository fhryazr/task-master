/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import timerNotification from "../../assets/timer_notif.mp3";

const Timer = ({ mode, settings, onTimerComplete }) => {
  // NOTIFIKASI
  const notifySound = new Audio(timerNotification);
  const notify = (message) => {
    notifySound.play();
    toast.success(message, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      sound: true,
    });
  };
  // NOTIFIKASI END

  const getInitialDuration = (mode) => {
    switch (mode) {
      case "focus":
        return settings.focus;
      case "shortBreak":
        return settings.shortBreak;
      case "longBreak":
        return settings.longBreak;
      default:
        return 0;
    }
  };

  const [initialDuration, setInitialDuration] = useState(getInitialDuration(mode) * 60);
  const [seconds, setSeconds] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Perbarui durasi timer saat mode berubah
    const newInitialDuration = getInitialDuration(mode) * 60;
    setInitialDuration(newInitialDuration);
    setSeconds(newInitialDuration);

    // Menghentikan timer saat mode berubah
    setIsActive(false);
  }, [mode, settings]);

  useEffect(() => {
    if (isActive) {
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            // Timer selesai
            clearInterval(intervalId);
            setIsActive(false);
            return initialDuration; // Kembali ke nilai awal saat timer habis
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(intervalId); // Membersihkan interval saat komponen dilepas
    }
  }, [isActive, initialDuration, mode]);

  useEffect(() => {
    if (isActive && seconds === 0) {
      // Timer selesai, panggil callback untuk mengubah mode
      onTimerComplete();
      console.log('lol')
      switch (mode) {
        case "focus":
          notify("Focus session completed!");
          break;
        case "shortBreak":
          notify("Short break completed!,\nLet's Focus Again");
          break;
        case "longBreak":
          notify("Long break completed!,\nLet's Focus Again");
          break;
        default:
          break;
      }
    }
  }, [isActive, seconds]);

  // Mengubah format detik menjadi "MM:SS"
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const startTimer = () => {
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(initialDuration);
  };

  return (
    <div className="timer w-[95vw] bg-white text-center p-3 rounded-lg sm:w-[60vw] lg:w-[30vw] xl:w-[22vw]">
      <div className="timer-display text-[5rem] font-bold">
        {formatTime(seconds)}
      </div>
      <div className="timer-controls flex justify-center gap-5 text-white">
        {!isActive ? (
          <button
            onClick={startTimer}
            className="w-[6rem] px-5 py-3 bg-purple-900 rounded-md">
            Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="w-[6rem] px-5 py-3 bg-purple-900 rounded-md">
            Pause
          </button>
        )}
        <button
          onClick={resetTimer}
          className="w-[6rem] px-5 py-3 bg-gray-300 rounded-md">
          Reset
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

Timer.propTypes = {
  mode: PropTypes.string.isRequired, // Mode timer (focus, shortBreak, longBreak)
  settings: PropTypes.shape({
    focus: PropTypes.number,
    shortBreak: PropTypes.number,
    longBreak: PropTypes.number,
  }).isRequired,
  onTimerComplete: PropTypes.func.isRequired, // Callback yang akan dipanggil ketika timer selesai
};

export default Timer;
