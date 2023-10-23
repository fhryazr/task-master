import { useState } from "react";
import Bgm from "./Bgm";

const BgmWrapper = () => {
  const [currentMode, setCurrentMode] = useState("Ambient");
  const modes = {
    bgm: "Ambient",
    spotify: <p>Spotify<sup>Pro</sup></p>
  }
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
    {
      title: "Fire Crackling",
      waveType: "FireCrackling.m4a",
      imageUrl: "/CalmOceanWaves.png",
    },
  ];

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
  };

  return (
    <div className="flex flex-col w-[50vh]">
      <div className="mode-buttons flex justify-evenly items-center font-semibold text-white mb-2 text-lg">
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
      </div>
      <div className="bg-white h-[12rem] p-2 rounded-lg">
        <div className="bg-white max-h-[11rem] overflow-y-auto rounded-lg hover:overflow-y-auto hover:rounded-lg">
          <Bgm songs={songs} />
        </div>
      </div>
    </div>
  );
};

export default BgmWrapper;
