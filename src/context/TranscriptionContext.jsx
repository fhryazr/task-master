/* eslint-disable react/prop-types */
import { useState, createContext } from "react";

const TranscriptionContext = createContext();

const TranscriptionProvider = ({ children }) => {
  const [commandScript, setCommandScript] = useState("");

  const updateTranscription = (newTranscription) => {
    setCommandScript(newTranscription);
  };

  return (
    <TranscriptionContext.Provider value={{ commandScript, updateTranscription }}>
      {children}
    </TranscriptionContext.Provider>
  );
};

export { TranscriptionProvider, TranscriptionContext };
