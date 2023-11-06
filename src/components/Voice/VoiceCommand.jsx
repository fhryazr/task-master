/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useContext } from "react";
// import { useCustomTimer } from "../Timer/TestTimer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { TranscriptionContext } from "../../context/TranscriptionContext";

function VoiceCommand() {
  const [recognizing, setRecognizing] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const { updateTranscription } = useContext(TranscriptionContext);

  const playSound = (soundFile) => {
    const audio = new Audio(soundFile);
    audio.play();
  };

  const toggleListening = useCallback(() => {
    if (recognizing === true) {
      playSound("notif-2.mp3");
      recognition.stop();
      console.log("mic mati");
      setRecognizing(false);
    } else {
      setRecognizing(true);
      playSound("notif-1.mp3");
      recognition.start();
      console.log("mic nyala");
    }
  }, [recognizing, recognition]);

  const speechRecognition = getSpeechRecognition();

  const getRecognition = () => {
    const newRecognition = new speechRecognition();
    newRecognition.continuous = true;
    newRecognition.lang = "id";

    newRecognition.onend = () => {
      if (recognizing) {
        newRecognition.start();
      }
    };

    newRecognition.onstart = () => {
      console.log("Pengenalan suara dimulai");
    };

    newRecognition.onnomatch = () => {
      console.log("Tidak ada hasil yang cocok.");
      alert("Uknown command")
      playSound('unknown.mp3')
    };

    newRecognition.onerror = (event) => {
      setRecognizing(false);
      newRecognition.abort();
      playSound('notif-2.mp3')
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
  }, [recognition, toggleListening]);

  return (
    <div>
      <button onClick={toggleListening}>
        {recognizing ? (
          <FontAwesomeIcon
            className="h-8 bg-white text-purple-900 px-4 py-3 rounded-full"
            icon={faMicrophone}
            beatFade
          />
        ) : (
          <FontAwesomeIcon
            className="h-8 text-purple-800 bg-white px-4 py-3 rounded-full"
            icon={faMicrophone}
          />
        )}
      </button>
    </div>
  );
}

export default VoiceCommand;
