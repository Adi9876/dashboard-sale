import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Web3Provider } from "./context/Web3Context";
import Header from "./components/Header";
import SaleInfo from "./components/SaleInfo";
import PurchaseForm from "./components/PurchaseForm";
import StageInfo from "./components/StageInfo";
import WalletInfo from "./components/WalletInfo";
import "./App.css";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");

  return (
    <Web3Provider>
      <div className="App">
        <Toaster position="top-right" />
        <Header
          isConnected={isConnected}
          setIsConnected={setIsConnected}
          account={account}
          setAccount={setAccount}
        />
        <main className="main-content">
          <div className="container">
            <div className="grid">
              <div className="left-panel">
                <SaleInfo />
                <StageInfo />
              </div>
              <div className="right-panel">
                <WalletInfo account={account} />
                <PurchaseForm account={account} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </Web3Provider>
  );
}

export default App;


