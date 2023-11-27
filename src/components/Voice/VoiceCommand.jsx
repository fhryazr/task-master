/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useContext } from "react";
// import { useCustomTimer } from "../Timer/TestTimer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { TranscriptionContext } from "../../context/TranscriptionContext";
import { ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

function VoiceCommand() {
  const [recognizing, setRecognizing] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const { updateTranscription, commandDetected, setCommandDetected } =
    useContext(TranscriptionContext);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const notify = (message) => {
    playSound("unknown.mp3");
    toast.error(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      sound: true,
    });
  };

  const [isPremium, setIsPremium] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const user = currentUser;

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
      setIsPremium(false);
    }
  }, [user]);

  const updateIsPremium = useCallback(async () => {
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setIsPremium(userSnap.data().status === "premium");
        }
      } catch (error) {
        console.error("Error updating isPremium:", error);
      }
    } else {
      setIsPremium(false); // Set to false when currentUser is null
    }
  }, [user]);

  useEffect(() => {
    updateIsPremium();
  }, [user, updateIsPremium]);

  const toggleListening = useCallback(() => {
    if (user) {
      if (recognizing === true) {
        recognition.stop();
        console.log("mic mati");
        setRecognizing(false);
      } else {
        setRecognizing(true);
        playSound("notif-1.mp3");
        recognition.start();
        console.log("mic nyala");
      }
    } else {
      notify('Login untuk menggunakan Voice Commands');
    }
  }, [recognizing, recognition]);

  const speechRecognition = getSpeechRecognition();

  const getRecognition = () => {
    const newRecognition = new speechRecognition();
    newRecognition.continuous = true;
    newRecognition.lang = "id";

    newRecognition.onend = () => {
      newRecognition.stop();
      setRecognizing(false);
    };

    newRecognition.onstart = () => {
      console.log("Pengenalan suara dimulai");
    };

    newRecognition.onnomatch = () => {
      newRecognition.stop();
      console.log("Tidak ada hasil yang cocok.");
      notify("Unknown Command");
      // alert("Uknown command");
      playSound("unknown.mp3");
    };

    newRecognition.onerror = (event) => {
      setRecognizing(false);
      newRecognition.abort();
      playSound("unknown.mp3");
      console.error("Kesalahan pengenalan suara:", event.error);
    };

    return newRecognition;
  };

  useEffect(() => {
    setRecognition(getRecognition());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function getSpeechRecognition() {
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  }


  useEffect(() => {
    if (recognition) {
      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          updateTranscription(
            (prevTranscription) => prevTranscription + transcript
          );
          // console.log("voice command", commandDetected);
          // const command = transcript.toLowerCase();
          // eksekusi command
          // executeCommand(transcript.toLowerCase());
          setTimeout(() => {
            updateTranscription("");
            toggleListening();
            recognition.stop();
          }, 200);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recognition, toggleListening, updateTranscription]);

  return (
    <div>
      <button onClick={toggleListening}>
        {recognizing ? (
          <div>
            <FontAwesomeIcon
              className="h-8 bg-white text-purple-900 px-4 py-3 rounded-full"
              icon={faMicrophone}
              beatFade
            />
          </div>
        ) : (
          <FontAwesomeIcon
            className="h-8 text-purple-800 bg-white px-4 py-3 rounded-full"
            icon={faMicrophone}
          />
        )}
      </button>
      <ToastContainer />
    </div>
  );
}

export default VoiceCommand;
