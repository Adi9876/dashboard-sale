import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import toast from "react-hot-toast";
import { Coins, DollarSign, CreditCard, Calculator } from "lucide-react";

const PurchaseForm = ({ account }) => {
  const { contract, usdtContract, usdcContract, priceFeed } = useWeb3();
  const [rcxAmount, setRcxAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("native");
  const [costs, setCosts] = useState({
    usd: "0",
    native: "0",
    usdt: "0",
    usdc: "0",
  });
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [userPurchased, setUserPurchased] = useState("0");
  const [maxPerWallet, setMaxPerWallet] = useState("0");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!contract || !account) return;

      try {
        const [purchased, maxWallet] = await Promise.all([
          contract.purchased(account),
          contract.maxPerWallet(),
        ]);

        setUserPurchased(ethers.utils.formatEther(purchased));
        setMaxPerWallet(ethers.utils.formatEther(maxWallet));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [contract, account]);

  useEffect(() => {
    if (rcxAmount && contract) {
      calculateCosts();
    }
  }, [rcxAmount, contract, paymentMethod]);

  const calculateCosts = async () => {
    if (!rcxAmount || !contract) return;

    try {
      setCalculating(true);
      const amountWei = ethers.utils.parseEther(rcxAmount);

      // Get USD cost
      const [usdCost, canPurchase] = await contract.calculateCostAcrossStages(amountWei);

      if (!canPurchase) {
        toast.error("Amount exceeds available allocation");
        return;
      }

      // Calculate native cost using USD conversion
      const nativeCost = await contract.usdToNative(usdCost);

      setCosts({
        usd: ethers.utils.formatUnits(usdCost, 6),
        native: ethers.utils.formatEther(nativeCost),
        usdt: ethers.utils.formatUnits(usdCost, 6),
        usdc: ethers.utils.formatUnits(usdCost, 6),
      });
    } catch (error) {
      console.error("Error calculating costs:", error);
      toast.error("Error calculating costs: " + error.message);
    } finally {
      setCalculating(false);
    }
  };

  const handlePurchase = async () => {
    if (!contract || !account) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!rcxAmount || parseFloat(rcxAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const amountWei = ethers.utils.parseEther(rcxAmount);

    try {
      setLoading(true);

      if (paymentMethod === "native") {
        await purchaseWithNative(amountWei);
      } else if (paymentMethod === "usdt") {
        await purchaseWithUSDT(amountWei);
      } else if (paymentMethod === "usdc") {
        await purchaseWithUSDC(amountWei);
      }
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Purchase failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const purchaseWithNative = async (amountWei) => {
    // Get USD cost and convert to native
    const [usdCost, canPurchase] = await contract.calculateCostAcrossStages(amountWei);

    if (!canPurchase) {
      throw new Error("Cannot purchase this amount");
    }

    const nativeCost = await contract.usdToNative(usdCost);

    const tx = await contract.buyWithNative(amountWei, {
      value: nativeCost,
    });

    toast.loading("Transaction pending...", { id: "purchase" });
    await tx.wait();
    toast.success("Purchase successful!", { id: "purchase" });

    // Refresh user data
    const purchased = await contract.purchased(account);
    setUserPurchased(ethers.utils.formatEther(purchased));
  };

  const purchaseWithUSDT = async (amountWei) => {
    const [usdCost, canPurchase] = await contract.calculateCostAcrossStages(amountWei);

    if (!canPurchase) {
      throw new Error("Cannot purchase this amount");
    }

    // Check allowance
    const allowance = await usdtContract.allowance(account, contract.address);

    if (allowance.lt(usdCost)) {
      toast.loading("Approving USDT...", { id: "approve" });
      const approveTx = await usdtContract.approve(contract.address, usdCost);
      await approveTx.wait();
      toast.success("USDT approved!", { id: "approve" });
    }

    toast.loading("Transaction pending...", { id: "purchase" });
    const tx = await contract.buyWithUSDT(amountWei);
    await tx.wait();
    toast.success("Purchase successful!", { id: "purchase" });

    // Refresh user data
    const purchased = await contract.purchased(account);
    setUserPurchased(ethers.utils.formatEther(purchased));
  };

  const purchaseWithUSDC = async (amountWei) => {
    const [usdCost, canPurchase] = await contract.calculateCostAcrossStages(amountWei);

    if (!canPurchase) {
      throw new Error("Cannot purchase this amount");
    }

    // Check allowance
    const allowance = await usdcContract.allowance(account, contract.address);

    if (allowance.lt(usdCost)) {
      toast.loading("Approving USDC...", { id: "approve" });
      const approveTx = await usdcContract.approve(contract.address, usdCost);
      await approveTx.wait();
      toast.success("USDC approved!", { id: "approve" });
    }

    toast.loading("Transaction pending...", { id: "purchase" });
    const tx = await contract.buyWithUSDC(amountWei);
    await tx.wait();
    toast.success("Purchase successful!", { id: "purchase" });

    // Refresh user data
    const purchased = await contract.purchased(account);
    setUserPurchased(ethers.utils.formatEther(purchased));
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  };

  const remainingWallet = parseFloat(maxPerWallet) - parseFloat(userPurchased);

  return (
    <div className="card">
      <h2>Purchase RCX</h2>

      {account && (
        <div className="user-info">
          <div className="info-item">
            <span>Your Purchased:</span>
            <span>{formatNumber(userPurchased)} RCX</span>
          </div>
          <div className="info-item">
            <span>Remaining Limit:</span>
            <span>{formatNumber(remainingWallet.toString())} RCX</span>
          </div>
        </div>
      )}

      <div className="input-group">
        <label htmlFor="rcxAmount">RCX Amount</label>
        <input
          id="rcxAmount"
          type="number"
          value={rcxAmount}
          onChange={(e) => setRcxAmount(e.target.value)}
          placeholder="Enter RCX amount"
          min="0"
          step="0.01"
        />
      </div>

      <div className="payment-methods">
        <h3>Payment Method</h3>

        <div
          className={`payment-method ${paymentMethod === "native" ? "active" : ""
            }`}
          onClick={() => setPaymentMethod("native")}
        >
          <Coins size={20} />
          <div>
            <h4>BNB (Native)</h4>
            <p>Pay with BNB directly</p>
            {rcxAmount && (
              <div className="cost-display">
                Cost: {formatNumber(costs.native)} BNB
              </div>
            )}
          </div>
        </div>

        <div
          className={`payment-method ${paymentMethod === "usdt" ? "active" : ""
            }`}
          onClick={() => setPaymentMethod("usdt")}
        >
          <DollarSign size={20} />
          <div>
            <h4>USDT</h4>
            <p>Pay with USDT stablecoin</p>
            {rcxAmount && (
              <div className="cost-display">
                Cost: {formatNumber(costs.usdt)} USDT
              </div>
            )}
          </div>
        </div>

        <div
          className={`payment-method ${paymentMethod === "usdc" ? "active" : ""
            }`}
          onClick={() => setPaymentMethod("usdc")}
        >
          <CreditCard size={20} />
          <div>
            <h4>USDC</h4>
            <p>Pay with USDC stablecoin</p>
            {rcxAmount && (
              <div className="cost-display">
                Cost: {formatNumber(costs.usdc)} USDC
              </div>
            )}
          </div>
        </div>
      </div>

      {rcxAmount && (
        <div className="cost-summary">
          <h4>Cost Summary</h4>
          <div className="cost-item">
            <span>USD Value:</span>
            <span>${formatNumber(costs.usd)}</span>
          </div>
          <div className="cost-item">
            <span>RCX Amount:</span>
            <span>{formatNumber(rcxAmount)} RCX</span>
          </div>
        </div>
      )}

      <button
        className="btn"
        onClick={handlePurchase}
        disabled={!account || !rcxAmount || loading || calculating}
      >
        {loading ? (
          <>
            <div className="spinner"></div>
            Processing...
          </>
        ) : calculating ? (
          <>
            <Calculator size={16} />
            Calculating...
          </>
        ) : (
          <>
            <Coins size={16} />
            Purchase RCX
          </>
        )}
      </button>

      {!account && (
        <p className="connect-notice">
          Please connect your wallet to purchase RCX tokens
        </p>
      )}
    </div>
  );
};

export default PurchaseForm;