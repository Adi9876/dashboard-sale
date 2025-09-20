import React from "react";
import { Wallet, LogOut } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

const Header = () => {
  const { isConnected, account, connectWallet, disconnectWallet, loading } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">RCX Public Sale</div>
        <div className="wallet-info">
          {isConnected ? (
            <>
              <div className="wallet-address">{formatAddress(account)}</div>
              <button
                className="btn btn-secondary"
                onClick={disconnectWallet}
              >
                <LogOut size={16} />
                Disconnect
              </button>
            </>
          ) : (
            <button
              className="btn"
              onClick={connectWallet}
              disabled={loading}
            >
              <Wallet size={16} />
              {loading ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;