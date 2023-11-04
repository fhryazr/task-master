import { useState } from "react";
import Bgm from "./Bgm";
import Cookies from "js-cookie";
// import SpotifyWrapper from "./SpotifyWrapper";

const BgmWrapper = () => {
  const initialMode = Cookies.get("currentMode") || "bgm";
  const [currentMode, setCurrentMode] = useState(initialMode);
  const modes = {
    bgm: "Ambient",
    spotify: "SpotifyPro",
  };
  const songs = [
    {
      title: "Ocean",
      waveType: "Ocean.mp3",
      imageUrl: "/CalmOceanWaves.png",
    },
    {
      title: "Fire Crackling",
      waveType: "FireCrackling.m4a",
      imageUrl: "/CalmOceanWaves.png",
    },
    {
      title: "Lofi",
      waveType: "hillside.wav",
      imageUrl: "/CalmOceanWaves.png",
    },
  ];

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    Cookies.set("currentMode", mode);
  };

  return (
    <div className="flex flex-col w-[95vw] sm:w-[60vw] lg:w-[30vw] xl:w-[22vw]">
      <div className="mode-buttons flex justify-evenly items-center font-semibold text-white mb-2 text-lg">
        {Object.keys(modes).map((modeKey) => (
          <button
            key={modeKey}
            onClick={() => handleModeChange(modeKey)}
            className={`mode-button ${
              currentMode === modeKey
                ? "active text-white"
                : "text-slate-300 hover:text-white"
            }`}>
            {modes[modeKey]}
          </button>
        ))}
      </div>
      <div className="bg-white h-[12rem] p-2 rounded-lg">
        <div className="bg-white max-h-[11rem] overflow-y-auto rounded-lg hover:overflow-y-auto hover:rounded-lg">
          {currentMode === "bgm" ? (
            <Bgm songs={songs} />
          ) : (
            // <SpotifyWrapper />
            null
          )}
        </div>
      </div>
    </div>
  );
};

export default BgmWrapper;
