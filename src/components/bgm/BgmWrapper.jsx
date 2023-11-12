import { useState, useContext, useEffect } from "react";
import Bgm from "./Bgm";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

const BgmWrapper = () => {
  const { currentUser } = useContext(AuthContext);
  const user = currentUser;
  const initialMode = Cookies.get("currentMode") || "bgm";
  const [currentMode, setCurrentMode] = useState(initialMode);
  const modes = {
    bgm: "Ambient",
  };

  const songs = [
    {
      title: "Ocean",
      waveType: "Ocean.mp3",
      imageUrl: "/CalmOceanWaves.png",
      premium: false,
    },
    {
      title: "Fire Crackling",
      waveType: "FireCrackling.m4a",
      imageUrl: "/CalmOceanWaves.png",
      premium: false,
    },
    {
      title: "Rain",
      waveType: "rain.mp3",
      imageUrl: "/CalmOceanWaves.png",
      premium: false,
    },
    {
      title: "Lofi Hillside",
      waveType: "hillside.wav",
      imageUrl: "/CalmOceanWaves.png",
      premium: false,
    },
    {
      title: "Dream Land",
      waveType: "dreamland.mp3",
      imageUrl: "/CalmOceanWaves.png",
      premium: true,
    },
    {
      title: "Memories",
      waveType: "Memories.mp3",
      imageUrl: "/CalmOceanWaves.png",
      premium: true,
    },
    {
      title: "Happy Nature",
      waveType: "Happy Nature.mp3",
      imageUrl: "/CalmOceanWaves.png",
      premium: true,
    },
  ];

  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Check premium status when the component mounts
    const getData = async () => {
      const userId = user.uid;
      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.data().status === "premium") {
          setIsPremium(true);
        } else {
          setIsPremium(false);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (user) {
      getData();
    } else {
      return;
    }
  }, []);

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
                ? "active text-white "
                : "text-slate-300 hover:text-white"
            }`}>
            {modes[modeKey]}
          </button>
        ))}
      </div>
      <div className="bg-white h-[10rem] md:h-[12rem] p-2 rounded-lg">
        <div className="bg-white max-h-[9rem] md:max-h-[11rem] overflow-y-auto rounded-lg hover:overflow-y-auto hover:rounded-lg">
          {currentMode === "bgm" ? (
            <Bgm songs={songs} isPremium={isPremium} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default BgmWrapper;
