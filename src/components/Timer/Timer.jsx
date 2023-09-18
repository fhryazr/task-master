import PropTypes from "prop-types";
import Focus from "./Focus";
import ShortBreak from "./ShortBreak";
import LongBreak from "./LongBreak";
import "./TimerStyles.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import timerNotification from "../../assets/timer_notif.mp3";

const Timer = ({ mode, duration, setCurrentMode, seconds_duration }) => {
  const notifySound = new Audio(timerNotification);
  const notify = (message) => {
    notifySound.play();
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      sound: true,
    });
  };

  return (
    <div className="Timer">
      {mode === "focus" && (
        <>
          <Focus
            duration={duration}
            seconds_duration={seconds_duration}
            setCurrentMode={(newMode) => {
              setCurrentMode(newMode);
              notify("Saatnya Istirahat!");
            }}
          />
        </>
      )}
      {mode === "shortBreak" && (
        <>
          <ShortBreak
            duration={duration}
            seconds_duration={seconds_duration}
            setCurrentMode={(newMode) => {
              setCurrentMode(newMode);
              notify("Saatnya Kembali Bekerja!");
            }}
          />
        </>
      )}
      {mode === "longBreak" && (
        <>
          <LongBreak
            duration={duration}
            setCurrentMode={(newMode) => {
              setCurrentMode(newMode);
              notify("Istirahat yang Cukup Lama, Saatnya Kembali Bekerja!");
            }}
            seconds_duration={seconds_duration}
          />
        </>
      )}
      <ToastContainer
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
      />
    </div>
  );
};

Timer.propTypes = {
  mode: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  setCurrentMode: PropTypes.func.isRequired,
  seconds_duration: PropTypes.number.isRequired,
};

export default Timer;
