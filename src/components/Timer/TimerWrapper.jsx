import { useState } from "react";
import Timer from "./Timer";
import TimerSettingsModal from "./TimerSettingsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const TimerWrapper = () => {
  const [currentMode, setCurrentMode] = useState("focus");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timerSettings, setTimerSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });

  const modes = {
    focus: "Focus",
    shortBreak: "Short Break",
    longBreak: "Long Break",
  };

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveSettings = (updatedSettings) => {
    setTimerSettings(updatedSettings);
    setIsModalOpen(false);
  };

  const [intervalCount, setIntervalCount] = useState(0);

  const handleTimerComplete = () => {
    // Logika untuk mengganti mode
    setIntervalCount(intervalCount + 1);

    // Logika untuk mengganti mode
    if (currentMode === "focus" && intervalCount < 4) {
      setCurrentMode("shortBreak");
    } else if (currentMode === "focus" && intervalCount === 4) {
      setCurrentMode("longBreak");
      // Reset intervalCount setelah 2 interval
      setIntervalCount(0);
    } else {
      setCurrentMode("focus");
    }
  };

  return (
    <div className="TimerWrapper">
      <div className="mode-buttons flex justify-around items-center font-semibold text-white mb-2 text-lg">
        {Object.keys(modes).map((modeKey) => (
          <button
            key={modeKey}
            onClick={() => handleModeChange(modeKey)}
            className={`mode-button ${
              currentMode === modeKey
                ? "active text-white"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {modes[modeKey]}
          </button>
        ))}
        <FontAwesomeIcon
          icon={faGear}
          onClick={handleOpenModal}
          className="cursor-pointer"
        />
      </div>
      <Timer
        mode={currentMode}
        settings={timerSettings}
        onTimerComplete={handleTimerComplete}
      />
      {isModalOpen && (
        <TimerSettingsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveSettings}
          settings={timerSettings}
        />
      )}
    </div>
  );
};

export default TimerWrapper;
