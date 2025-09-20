import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ethers } from "ethers";
import { TrendingUp, Users, Clock, Shield } from "lucide-react";

const SaleInfo = () => {
  const { contract } = useWeb3();
  const [saleData, setSaleData] = useState({
    saleActive: false,
    totalSold: "0",
    presaleCap: "0",
    maxPerWallet: "0",
    tgeTimestamp: "0",
    priceUsd6: "0",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleData = async () => {
      if (!contract) return;

      try {
        setLoading(true);
        const [
          saleActive,
          totalSold,
          presaleCap,
          maxPerWallet,
          tgeTimestamp,
          priceUsd6,
        ] = await Promise.all([
          contract.saleActive(),
          contract.totalSold(),
          contract.PRESALE_CAP(),
          contract.maxPerWallet(),
          contract.tgeTimestamp(),
          contract.tokenPriceUsd6(),
        ]);

        setSaleData({
          saleActive,
          totalSold: ethers.utils.formatEther(totalSold),
          presaleCap: ethers.utils.formatEther(presaleCap),
          maxPerWallet: ethers.utils.formatEther(maxPerWallet),
          tgeTimestamp: tgeTimestamp.toString(),
          priceUsd6: priceUsd6.toString(),
        });
      } catch (error) {
        console.error("Error fetching sale data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleData();
  }, [contract]);

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatPrice = (priceUsd6) => {
    const price = parseFloat(priceUsd6) / 1000000; // Convert from 6 decimals
    return `$${price.toFixed(6)}`;
  };

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString();
  };

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
      <h2>Sale Information</h2>

      <div className="sale-status">
        <div
          className={`status-indicator ${saleData.saleActive ? "active" : "inactive"
            }`}
        >
          {saleData.saleActive ? "🟢 Sale Active" : "🔴 Sale Inactive"}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{formatNumber(saleData.totalSold)}</div>
          <div className="stat-label">RCX Sold</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatNumber(saleData.presaleCap)}</div>
          <div className="stat-label">Total Cap</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">
            {formatNumber(saleData.maxPerWallet)}
          </div>
          <div className="stat-label">Max per Wallet</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{formatPrice(saleData.priceUsd6)}</div>
          <div className="stat-label">RCX Price</div>
        </div>
      </div>

      <div className="sale-details">
        <div className="detail-item">
          <Clock size={16} />
          <span>TGE: {formatDate(saleData.tgeTimestamp)}</span>
        </div>
        <div className="detail-item">
          <Shield size={16} />
          <span>Vesting: 15% TGE, 9 months</span>
        </div>
      </div>

      <div className="progress-bar">
        <div className="progress-label">
          Progress:{" "}
          {(
            (parseFloat(saleData.totalSold) / parseFloat(saleData.presaleCap)) *
            100
          ).toFixed(2)}
          %
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${(parseFloat(saleData.totalSold) /
                  parseFloat(saleData.presaleCap)) *
                100
                }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SaleInfo;