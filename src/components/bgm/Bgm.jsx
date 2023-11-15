/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { SpeakerWaveIcon } from "@heroicons/react/24/outline";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import { toast, ToastContainer } from "react-toastify";
// import { AuthContext } from "../../context/AuthContext";

const Bgm = ({ songs, isPremium }) => {
  const MAX = 50;

  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [songVolumes, setSongVolumes] = useState(songs.map(() => MAX));
  const audioRefs = useRef(songs.map(() => new Audio()));
  const [isPlaying, setIsPlaying] = useState(false);

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

    const audio = audioRefs.current[index];

    if (currentSongIndex === index) {
      // If the same song is clicked again, toggle play/pause
      if (audio.paused) {
        // If paused, resume from the saved currentTime
        audio.play().then(() => {
          if (audio.dataset.currentTime) {
            audio.currentTime = audio.dataset.currentTime;
          }
        });
        setIsPlaying(true);
      } else {
        // If playing, pause and save the currentTime
        audio.pause();
        audio.dataset.currentTime = audio.currentTime;
        setIsPlaying(false);
      }
    } else {
      // Play the selected song
      if (currentSongIndex !== null) {
        // Pause and reset the previously playing audio
        const currentAudio = audioRefs.current[currentSongIndex];
        currentAudio.pause();
        currentAudio.currentTime = 0;
        setIsPlaying(false);
      }

      audio.src = songs[index].waveType;
      audio.volume = songVolumes[index] / MAX;
      audio.loop = true;
      audio.play().then(() => {
        setCurrentSongIndex(index);
        setIsPlaying(true);
      });
    }
  };

  const handleVolume = (e, index) => {
    const value = e.target.value;
    const newSongVolumes = [...songVolumes];
    newSongVolumes[index] = Number(value);
    setSongVolumes(newSongVolumes);
  
    if (currentSongIndex === index) {
      // Update the volume for the specific audio element
      audioRefs.current[index].volume = Number(value) / MAX;
    }
  };
  

  return (
    <>
      <div>
        {songs.map((song, index) => (
          <div
            key={index}
            className="bg-white w-full max-w-full flex flex-col rounded-lg b-4 mb-2 text-center shadow-md"
          >
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
                  className="absolute right-[1px] top-1/2 -translate-y-1/2 w-12 h-12 p-2 text-white rounded-full"
                >
                  {isPlaying && currentSongIndex !== null && currentSongIndex === index ? (
                    <PauseIcon className="h-8 w-8" aria-hidden="true" />
                  ) : (
                    <PlayIcon className="h-8 w-8" aria-hidden="true" />
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
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
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
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer />
    </>
  );
};

export default Bgm;
