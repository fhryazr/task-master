/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

const TimerSettingsModal = ({ isOpen, onClose, onSave, settings }) => {
  const [focusDuration, setFocusDuration] = useState(settings.focus);
  const [shortBreakDuration, setShortBreakDuration] = useState(
    settings.shortBreak
  );
  const [longBreakDuration, setLongBreakDuration] = useState(
    settings.longBreak
  );

  const modalRef = useRef(null); // Ref untuk modal

  // Event listener untuk menangani klik di luar modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        // Klik di luar modal
        // Simpan pengaturan dan tutup modal
        handleSave();
      }
    }

    // Tambah event listener saat modal terbuka
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Hapus event listener saat modal ditutup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSave = () => {
    // Validasi agar nilai tidak kurang dari 0.1
    const focus = parseFloat(focusDuration) >= 0.1 ? parseFloat(focusDuration) : 0;
    const shortBreak = parseFloat(shortBreakDuration) >= 0.1 ? parseFloat(shortBreakDuration) : 0;
    const longBreak = parseFloat(longBreakDuration) >= 0.1 ? parseFloat(longBreakDuration) : 0;

    // Simpan pengaturan yang diperbarui ke dalam objek
    const updatedSettings = {
      focus,
      shortBreak,
      longBreak,
    };

    // Panggil fungsi onSave dengan pengaturan yang diperbarui
    onSave(updatedSettings);

    // Tutup modal
    onClose();
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            ref={modalRef}
            className="modal relative flex justify-center items-center"
          >
            <div className="modal-content bg-white flex flex-col justify-center items-center absolute z-[999] w-[30vw] p-5 gap-4 rounded-lg shadow-md">
              <h2>Timer Settings (minutes)</h2>
              <div className="timer-setting w-full  flex justify-center gap-8">
                {/* focus duration setting */}
                <div className="focus-timer flex flex-col items-center gap-1">
                  <label className="w-[7rem]">Focus :</label>
                  <input
                    type="number"
                    className="rounded-md p-1 w-[7rem] border-2"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(e.target.value)}
                  />
                </div>
                {/* focus duration setting end */}

                {/* shortBreak duration setting */}
                <div className="short-timer flex flex-col items-center gap-1">
                  <label className="w-[7rem]">Short Break :</label>
                  <input
                    type="number"
                    className="rounded-md p-1 w-[7rem] border-2"
                    value={shortBreakDuration}
                    onChange={(e) => setShortBreakDuration(e.target.value)}
                  />
                </div>
                {/* shortBreak duration end */}

                {/* long break duration setting */}
                <div className="short-timer flex flex-col items-center gap-1">
                  <label className="w-[7rem]">Long Break :</label>
                  <input
                    type="number"
                    className="block rounded-md p-1 w-[7rem] border-2"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(e.target.value)}
                  />
                </div>
                {/* long break duration setting end*/}
              </div>

              {/* button setting */}
              <div className="btn-timer-setting flex gap-3">
                <button
                  type="submit"
                  onClick={handleSave}
                  className="w-[7rem] bg-purple-900 p-2 rounded-md text-white">
                  Save
                </button>
                <button onClick={onClose}>Cancel</button>
              </div>
              {/* button setting end */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TimerSettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Status modal (buka/tutup)
  onClose: PropTypes.func.isRequired, // Callback saat modal ditutup
  onSave: PropTypes.func.isRequired, // Callback saat pengaturan disimpan
  settings: PropTypes.object.isRequired, // Pengaturan timer saat ini
};

export default TimerSettingsModal;
