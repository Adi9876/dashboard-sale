import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";

const DebugInfo = () => {
    const { contract } = useWeb3();
    const [debugInfo, setDebugInfo] = useState({});

    useEffect(() => {
        const fetchDebugInfo = async () => {
            if (!contract) return;

            try {
                const [
                    saleActive,
                    totalSold,
                    presaleCap,
                    maxPerWallet,
                    tgeTimestamp,
                    tokenPriceUsd6,
                    totalStages,
                    currentStage
                ] = await Promise.all([
                    contract.saleActive().catch(() => false),
                    contract.totalSold().catch(() => "0"),
                    contract.PRESALE_CAP().catch(() => "0"),
                    contract.maxPerWallet().catch(() => "0"),
                    contract.tgeTimestamp().catch(() => "0"),
                    contract.tokenPriceUsd6().catch(() => "0"),
                    contract.getTotalStages().catch(() => "0"),
                    contract.getCurrentStage().catch(() => [0, 0, 0, 0, 0])
                ]);

                setDebugInfo({
                    saleActive,
                    totalSold: totalSold.toString(),
                    presaleCap: presaleCap.toString(),
                    maxPerWallet: maxPerWallet.toString(),
                    tgeTimestamp: tgeTimestamp.toString(),
                    tokenPriceUsd6: tokenPriceUsd6.toString(),
                    totalStages: totalStages.toString(),
                    currentStage: currentStage.map(s => s.toString())
                });
            } catch (error) {
                console.error("Error fetching debug info:", error);
            }
        };

        fetchDebugInfo();
    }, [contract]);

    if (!contract) {
        return (
            <div className="card">
                <h3>Debug Info</h3>
                <p>Contract not connected</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3>Debug Info</h3>
            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                <div><strong>Sale Active:</strong> {debugInfo.saleActive ? 'Yes' : 'No'}</div>
                <div><strong>Total Sold:</strong> {debugInfo.totalSold}</div>
                <div><strong>Presale Cap:</strong> {debugInfo.presaleCap}</div>
                <div><strong>Max Per Wallet:</strong> {debugInfo.maxPerWallet}</div>
                <div><strong>TGE Timestamp:</strong> {debugInfo.tgeTimestamp}</div>
                <div><strong>Token Price (6d):</strong> {debugInfo.tokenPriceUsd6}</div>
                <div><strong>Total Stages:</strong> {debugInfo.totalStages}</div>
                <div><strong>Current Stage:</strong> {JSON.stringify(debugInfo.currentStage)}</div>
            </div>
        </div>
    );
};

export default DebugInfo;
