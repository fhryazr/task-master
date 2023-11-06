/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import timerNotification from "../../assets/timer_notif.mp3";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { TranscriptionContext } from "../../context/TranscriptionContext";
import { db } from "../../config/FirebaseConfig";
import {
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  collection,
} from "firebase/firestore";

const Timer = ({ mode, settings, onTimerComplete }) => {
  const { currentUser } = useContext(AuthContext);
  const { commandScript } = useContext(TranscriptionContext);
  const user = currentUser;

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

  const [initialDuration, setInitialDuration] = useState(
    getInitialDuration(mode) * 60
  );
  const [seconds, setSeconds] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);
  const [focusStartTime, setFocusStartTime] = useState(null);

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
      // console.log("lol");
      switch (mode) {
        case "focus":
          notify("Focus session completed!");
          if (mode === "focus") {
            saveTimeFocusData(user);
            setFocusStartTime(null);
          }
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
    const seconds = Math.round(timeInSeconds % 60);
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

  const keywordStart = [
    "mulai waktu",
    "start timer",
    "mulai timer",
    "jalankan waktu",
    "jalankan timer",
  ];
  const keywordPause = [
    "pause timer",
    "paus timer",
    "jeda waktu",
    "jeda timer",
    "tunda waktu",
    "berhenti sejenak",
    "berhenti sebentar",
    "jeda sementara",
    "tahan waktu",
  ];
  const keywordReset = [
    "reset timer",
    "reset waktu",
    "riset timer",
    "riset waktu",
    "nolkan waktu",
    "cukup"
  ];
  const keywordCombine = [
    "setel ulang",
    "mulai dari awal",
    "ulang dari awal",
    "ulangi",
    "restart"
  ]

  useEffect(() => {
    const lowerCommand = commandScript.toLowerCase();
    if (keywordStart.some((key) => lowerCommand.includes(key))) {
      setTimeout(() => {
        startTimer();
      }, 1000);
    } else if (keywordPause.some((key) => lowerCommand.includes(key))) {
      setTimeout(() => {
        pauseTimer();
      }, 1000);
    } else if (keywordReset.some((key) => lowerCommand.includes(key))) {
      setTimeout(() => {
        resetTimer();
      }, 1000);
    } else if (keywordCombine.some((key) => lowerCommand.includes(key))) {
      setTimeout(() => {
        resetTimer();
        startTimer();
      }, 1000);
    } 
  }, [commandScript, startTimer]);

  const formatTime2 = (timeInMilliseconds) => {
    const seconds = Math.floor(timeInMilliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}:${minutes % 60}:${seconds % 60}`;
  };

  const saveTimeFocusData = async (param) => {
    const userId = param.uid;
    const focusEndTime = new Date().getTime();
    const focusTime = focusEndTime - focusStartTime;
    const formattedTime = formatTime2(focusTime);
    const currentDate = new Date();
    const formattedDate = format(currentDate, "MM/dd/yyyy");

    // Mengambil data dari Cookies
    const storedFocusTimeCookies = Cookies.get(`stats-${userId}`);
    let focusTimeStorageCookies = [];

    if (storedFocusTimeCookies) {
      focusTimeStorageCookies = JSON.parse(storedFocusTimeCookies);
    }

    // Menambahkan data waktu fokus baru ke array objek
    focusTimeStorageCookies.push({ day: formattedDate, waktu: formattedTime });

    // Menyimpan data ke Cookies
    Cookies.set(`stats-${userId}`, JSON.stringify(focusTimeStorageCookies), {
      expires: 365,
    });

    try {
      const userRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userRef);

      if (userDocSnapshot.exists()) {
        const focusStatsRef = collection(userRef, "focusStats");
        // Check if "focusStats" already exists
        const focusStatsSnapshot = await getDocs(focusStatsRef);

        if (focusStatsSnapshot.empty) {
          // If it doesn't exist, create a new document
          await addDoc(focusStatsRef, { data: focusTimeStorageCookies });
        } else {
          // If it exists, update the existing document
          const focusStatsDoc = focusStatsSnapshot.docs[0];
          await setDoc(focusStatsDoc.ref, { data: focusTimeStorageCookies });
        }
      } else {
        // Create an empty user document
        const newUserDocRef = doc(db, "users", userId);
        await setDoc(newUserDocRef, {});

        // Create "focusStats" collection and add the data
        const focusStatsRef = collection(newUserDocRef, "focusStats");
        await addDoc(focusStatsRef, { data: focusTimeStorageCookies });
      }
    } catch (err) {
      console.log(err);
    }
  };

  // const [totalFocusTime, setTotalFocusTime] = useState(0);
  const getTimeFocus = () => {
    if (mode === "focus" && !isActive && focusStartTime) {
      saveTimeFocusData(user);
    }
  };

  useEffect(() => {
    if (mode === "focus" && isActive === true) {
      const startTime = new Date().getTime();
      setFocusStartTime(startTime);
    } else if (mode === "focus" && !isActive && focusStartTime) {
      getTimeFocus();
      setFocusStartTime(null);
    }
  }, [isActive, focusStartTime]);

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
