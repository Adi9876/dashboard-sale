import React from "react";
import { Wallet, LogOut, Settings } from "lucide-react";
import { useWeb3 } from "../context/Web3Context";

const Header = ({ showAdminView, onToggleAdminView }) => {
  const { isConnected, account, connectWallet, disconnectWallet, loading, isOwner } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">RCX Public Sale</div>
        <div className="header-actions">
          {/* Admin Toggle Button - Only show for owners */}
          {isConnected && isOwner && (
            <button
              className={`btn ${showAdminView ? 'btn-primary' : 'btn-secondary'}`}
              onClick={onToggleAdminView}
              style={{ marginRight: '1rem' }}
            >
              <Settings size={16} />
              {showAdminView ? 'Public View' : 'Admin Dashboard'}
            </button>
          )}

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
      </div>
    </header>
  );
};

export default Header;