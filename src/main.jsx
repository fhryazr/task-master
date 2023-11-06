import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { TranscriptionProvider } from "./context/TranscriptionContext.jsx";
// import { TimerProvider } from "./context/TimerContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <TranscriptionProvider>
          <App />
        </TranscriptionProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
