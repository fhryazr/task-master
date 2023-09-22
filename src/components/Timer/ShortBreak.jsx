import { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const ShortBreak = ({ duration, setCurrentMode, seconds_duration }) => {
  const [minutes, setMinutes] = useState(duration);
  const [seconds, setSeconds] = useState(seconds_duration);
  const [isActive, setIsActive] = useState(false);
  const [isResetDisabled, setIsResetDisabled] = useState(true);

  useEffect(() => {
    let interval;
    const tick = () => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
          setCurrentMode("focus");
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      } else {
        setSeconds(seconds - 1);
      }
    };

    if (isActive) {
      interval = setInterval(tick, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isActive, minutes, seconds, duration, setCurrentMode, seconds_duration]);

  const toggleTimer = () => {
    setIsActive(!isActive);

    // Ketika tombol "Start" ditekan, aktifkan tombol "Reset"
    if (!isActive) {
      setIsResetDisabled(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);

    // Reset timer based on the selected mode
    setMinutes(duration);
    setSeconds(seconds_duration);

    // Nonaktifkan kembali tombol "Reset"
    setIsResetDisabled(true);
  };

  return (
    <div className="short-break">
      <div className="timer-display">
        <span>{minutes < 10 ? `0${minutes}` : minutes}</span>:
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
      <div className="timer-controls">
        <button onClick={toggleTimer}>{isActive ? "Pause" : "Start"}</button>
        <button
          onClick={resetTimer}
          className={`${
            isResetDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : ""
          }`}
          disabled={isResetDisabled}
        >
          Reset
        </button>
        {/* <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        /> */}
      </div>
    </div>
  );
};

ShortBreak.propTypes = {
  duration: PropTypes.number.isRequired,
  setCurrentMode: PropTypes.func.isRequired,
  seconds_duration: PropTypes.number.isRequired,
};

export default ShortBreak;
