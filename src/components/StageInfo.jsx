import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { ChevronRight, Target } from "lucide-react";

const StageInfo = () => {
  const { contract } = useWeb3();
  const [currentStage, setCurrentStage] = useState(null);
  const [totalStages, setTotalStages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStageData = async () => {
      if (!contract) return;

      try {
        setLoading(true);
        const [stageData, stagesCount] = await Promise.all([
          contract.getCurrentStage(),
          contract.getTotalStages(),
        ]);

        setCurrentStage({
          stageIndex: stageData[0].toString(),
          priceUsd18: stageData[1].toString(),
          tokenAllocation: stageData[2].toString(),
          tokensSold: stageData[3].toString(),
          tokensRemaining: stageData[4].toString(),
        });

        setTotalStages(parseInt(stagesCount.toString()));
      } catch (error) {
        console.error("Error fetching stage data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStageData();
  }, [contract]);

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const formatPrice = (priceUsd18) => {
    const price = parseFloat(priceUsd18) / 1000000000000000000; // Convert from 18 decimals
    return `$${price.toFixed(6)}`;
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

  if (!currentStage) {
    return (
      <div className="card">
        <h3>Stage Information</h3>
        <p>No stage data available</p>
      </div>
    );
  }

  const progressPercentage =
    (parseFloat(currentStage.tokensSold) /
      parseFloat(currentStage.tokenAllocation)) *
    100;

  return (
    <div className="card">
      <h3>Current Stage</h3>

      <div className="stage-info">
        <div className="stage-header">
          <h4>
            Stage {parseInt(currentStage.stageIndex) + 1} of {totalStages}
          </h4>
          <div className="stage-price">
            {formatPrice(currentStage.priceUsd18)} per RCX
          </div>
        </div>

        <div className="stage-details">
          <div className="stage-detail">
            <div className="value">
              {formatNumber(currentStage.tokenAllocation)}
            </div>
            <div className="label">Total Allocation</div>
          </div>
          <div className="stage-detail">
            <div className="value">{formatNumber(currentStage.tokensSold)}</div>
            <div className="label">Tokens Sold</div>
          </div>
          <div className="stage-detail">
            <div className="value">
              {formatNumber(currentStage.tokensRemaining)}
            </div>
            <div className="label">Remaining</div>
          </div>
        </div>

        <div className="stage-progress">
          <div className="progress-label">
            Stage Progress: {progressPercentage.toFixed(2)}%
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {totalStages > 1 && (
        <div className="stage-navigation">
          <div className="stage-indicator">
            {Array.from({ length: totalStages }, (_, i) => (
              <div
                key={i}
                className={`stage-dot ${i <= parseInt(currentStage.stageIndex) ? "completed" : ""
                  } ${i === parseInt(currentStage.stageIndex) ? "current" : ""}`}
              >
                {i < parseInt(currentStage.stageIndex) ? "✓" : i + 1}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StageInfo;