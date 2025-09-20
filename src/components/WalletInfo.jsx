import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import { Wallet, Coins, DollarSign } from "lucide-react";

const WalletInfo = ({ account }) => {
  const { provider, usdtContract, usdcContract } = useWeb3();
  const [balances, setBalances] = useState({
    bnb: "0",
    usdt: "0",
    usdc: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!provider || !account) return;

      try {
        setLoading(true);

        // Get BNB balance
        const bnbBalance = await provider.getBalance(account);

        // Get USDT balance
        let usdtBalance = "0";
        if (usdtContract) {
          try {
            const usdtBal = await usdtContract.balanceOf(account);
            const decimals = await usdtContract.decimals();
            usdtBalance = ethers.utils.formatUnits(usdtBal, decimals);
          } catch (error) {
            console.error("Error fetching USDT balance:", error);
          }
        }

        // Get USDC balance
        let usdcBalance = "0";
        if (usdcContract) {
          try {
            const usdcBal = await usdcContract.balanceOf(account);
            const decimals = await usdcContract.decimals();
            usdcBalance = ethers.utils.formatUnits(usdcBal, decimals);
          } catch (error) {
            console.error("Error fetching USDC balance:", error);
          }
        }

        setBalances({
          bnb: ethers.utils.formatEther(bnbBalance),
          usdt: usdtBalance,
          usdc: usdcBalance,
        });
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalances();
  }, [provider, account, usdtContract, usdcContract]);

  const formatBalance = (balance) => {
    const num = parseFloat(balance);
    if (num === 0) return "0.00";
    if (num < 0.01) return "< 0.01";
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  if (!account) {
    return (
      <div className="card">
        <h3>Wallet Information</h3>
        <p>Please connect your wallet to view balances</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Wallet Balances</h3>

      <div className="balance-list">
        <div className="balance-item">
          <div className="balance-icon">
            <Coins size={20} />
          </div>
          <div className="balance-info">
            <div className="balance-symbol">BNB</div>
            <div className="balance-amount">{formatBalance(balances.bnb)}</div>
          </div>
        </div>

        <div className="balance-item">
          <div className="balance-icon">
            <DollarSign size={20} />
          </div>
          <div className="balance-info">
            <div className="balance-symbol">USDT</div>
            <div className="balance-amount">{formatBalance(balances.usdt)}</div>
          </div>
        </div>

        <div className="balance-item">
          <div className="balance-icon">
            <DollarSign size={20} />
          </div>
          <div className="balance-info">
            <div className="balance-symbol">USDC</div>
            <div className="balance-amount">{formatBalance(balances.usdc)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletInfo;