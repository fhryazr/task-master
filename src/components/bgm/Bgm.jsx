/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";

const Bgm = ({ songs, isPremium }) => {
  const MAX = 50;

  const [songStates, setSongStates] = useState(songs.map(() => false));
  const [songVolumes, setSongVolumes] = useState(songs.map(() => MAX));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const oceanRefs = songs.map(() => useRef(null));

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

  const toggleAudio = (index) => {
    if (songs[index].premium && !isPremium) {
      notifyError("This Ambient is only available for premium users");
      return;
    }

    const newSongStates = [...songStates];
    newSongStates[index] = !newSongStates[index];

    oceanRefs.forEach((ref, i) => {
      if (i !== index) {
        ref.current.pause();
        ref.current.currentTime = 0;
        newSongStates[i] = false;
      }
    });

    if (newSongStates[index]) {
      oceanRefs[index].current.play();
    } else {
      oceanRefs[index].current.pause();
      oceanRefs[index].current.currentTime = 0;
    }

    setSongStates(newSongStates);
  };

  const handleVolume = (e, index) => {
    const value = e.target.value;
    const newSongVolumes = [...songVolumes];
    newSongVolumes[index] = Number(value);
    oceanRefs[index].current.volume = newSongVolumes[index] / MAX;
    setSongVolumes(newSongVolumes);
  };

  return (
    <>
      <div>
        {songs.map((song, index) => (
          <div
            key={index}
            className="bg-white w-full max-w-full flex flex-col rounded-lg b-4 mb-2 text-center shadow-md">
            <div className="flex items-center gap-2 p-2">
              <div className="relative flex-shrink-0">
                <img
                  width={50}
                  height={50}
                  className="rounded-lg"
                  src={song.imageUrl}
                  alt="waves"
                />
                <button
                  onClick={() => toggleAudio(index)}
                  className="absolute right-[1px] top-1/2 -translate-y-1/2 w-12 h-12 p-2 text-white rounded-full">
                  {!songStates[index] ? (
                    <PlayIcon className="h-8 w-8" aria-hidden="true" />
                  ) : (
                    <PauseIcon className="h-8 w-8" aria-hidden="true" />
                  )}
                </button>
              </div>
              <div className="flex flex-col items-start w-full">
                <div className="mt-1">
                  <div className="text-sm font-bold">
                    {song.title}
                    {!isPremium && song.premium && (
                  <span
                    className=""
                    style={{
                      fontSize: "1rem",
                      top: "50%", // Centers vertically
                      left: "50%", // Centers horizontally
                      transform: "translate(-50%, -50%)", // Ensures true center regardless of element size
                    }}>
                    🔒
                  </span>
                )}
                  </div>
                </div>
                
                <div className="flex w-full gap-2 items-center">
                  <SpeakerWaveIcon className="h-6 w-6" aria-hidden="true" />
                  <input
                    type="range"
                    className="w-full accent-purple-900"
                    min={0}
                    max={MAX}
                    onChange={(e) => handleVolume(e, index)}
                    value={songVolumes[index]}
                    data-index={index}
                  />
                </div>
              </div>
            </div>
            <audio ref={oceanRefs[index]} loop src={song.waveType} />
          </div>
        ))}
      </div>
      <ToastContainer />
    </>
  );
};

export default Bgm;
