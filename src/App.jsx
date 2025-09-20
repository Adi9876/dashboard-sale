import React from "react";
import { Toaster } from "react-hot-toast";
import { Web3Provider } from "./context/Web3Context";
import AppContent from "./AppContent";
import "./App.css";

function App() {
  return (
    <Web3Provider>
      <div className="App">
        <Toaster position="top-right" />
        <AppContent />
      </div>
    </Web3Provider>
  );
}

export default App;

