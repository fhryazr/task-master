/* eslint-disable react/prop-types */
import { useState, createContext } from "react";

const TranscriptionContext = createContext();

const TranscriptionProvider = ({ children }) => {
  const [commandScript, setCommandScript] = useState("");
  // const [commandDetected, setCommandDetected] = useState(false)

  // console.log(commandDetected)

  const updateTranscription = (newTranscription) => {
    setCommandScript(newTranscription);
  };

  // Dalam konteks atau di komponen lain
  const allowedCommands = ["mulai waktu", "pause", "stop", "next", "previous"];


  return (
    <TranscriptionContext.Provider value={{ commandScript, updateTranscription, allowedCommands}}>
      {children}
    </TranscriptionContext.Provider>
  );
};

export { TranscriptionProvider, TranscriptionContext };
