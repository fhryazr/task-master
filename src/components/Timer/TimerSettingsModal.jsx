/* eslint-disable no-unused-vars */
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSave = () => {
    // Validasi agar nilai tidak kurang dari 0.1
    const focus =
      parseFloat(focusDuration) >= 0.1 ? parseFloat(focusDuration) : 0;
    const shortBreak =
      parseFloat(shortBreakDuration) >= 0.1
        ? parseFloat(shortBreakDuration)
        : 0;
    const longBreak =
      parseFloat(longBreakDuration) >= 0.1 ? parseFloat(longBreakDuration) : 0;

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
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-30">
          <div
            ref={modalRef}
            className="relative flex justify-center items-center">
            <div className="bg-white flex flex-col justify-center items-center absolute z-50 w-[95vw] h-[50vh] p-5 gap-4 rounded-lg shadow-md md:w-[60vw] md:h-[30vh] lg:w-[50vw] xl:w-[35vw]">
              <h2>Timer Settings (minutes)</h2>
              <div className="w-full flex flex-col justify-center items-start gap-8 md:flex-row">
                <div className="focus-timer w-full flex flex-col items-start md:items-center gap-1">
                  <label className="w-[7rem]">Focus :</label>
                  <input
                    type="number"
                    className="rounded-md p-1 w-full border-2 md:w-[7rem]"
                    value={focusDuration}
                    onChange={(e) => setFocusDuration(e.target.value)}
                  />
                </div>
                <div className="short-timer w-full flex flex-col items-start md:items-center gap-1">
                  <label className="w-[7rem]">Short Break :</label>
                  <input
                    type="number"
                    className="rounded-md p-1 w-full md:w-[7rem] border-2"
                    value={shortBreakDuration}
                    onChange={(e) => setShortBreakDuration(e.target.value)}
                  />
                </div>
                <div className="long-timer w-full flex flex-col items-start md:items-center gap-1">
                  <label className="w-[7rem]">Long Break :</label>
                  <input
                    type="number"
                    className="block rounded-md p-1 w-full md:w-[7rem] border-2"
                    value={longBreakDuration}
                    onChange={(e) => setLongBreakDuration(e.target.value)}
                  />
                </div>
              </div>
              <div className="btn-timer-setting flex gap-3">
                <button
                  type="submit"
                  onClick={handleSave}
                  className="w-[7rem] bg-purple-900 p-2 rounded-md text-white">
                  Save
                </button>
                <button onClick={onClose}>Cancel</button>
              </div>
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
