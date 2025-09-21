import React, { useState, useEffect } from "react";
import { useWeb3 } from "../context/Web3Context";
import { Play, Square, Shield } from "lucide-react";

const OwnerControls = () => {
    const { isConnected, isOwner, contract, startSale, stopSale, loading } = useWeb3();
    const [saleActive, setSaleActive] = useState(false);

    // Fetch sale status
    useEffect(() => {
        const fetchSaleStatus = async () => {
            if (contract) {
                try {
                    const active = await contract.saleActive();
                    setSaleActive(active);
                } catch (error) {
                    console.error("Error fetching sale status:", error);
                }
            }
        };

        fetchSaleStatus();
    }, [contract]);

    // Don't render if not connected or not owner
    if (!isConnected || !isOwner) {
        return null;
    }

    const handleStartSale = async () => {
        await startSale();
        // Refresh sale status after starting
        if (contract) {
            const active = await contract.saleActive();
            setSaleActive(active);
        }
    };

    const handleStopSale = async () => {
        await stopSale();
        // Refresh sale status after stopping
        if (contract) {
            const active = await contract.saleActive();
            setSaleActive(active);
        }
    };

    return (
        <div className="owner-controls">
            <div className="owner-controls-header">
                <Shield size={20} />
                <h3>Owner Controls</h3>
            </div>

            <div className="sale-status">
                <div className={`status-indicator ${saleActive ? 'active' : 'inactive'}`}>
                    <div className="status-dot"></div>
                    <span>{saleActive ? 'Sale Active' : 'Sale Inactive'}</span>
                </div>
            </div>

            <div className="control-buttons">
                <button
                    className={`btn ${saleActive ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={handleStartSale}
                    disabled={loading || saleActive}
                >
                    <Play size={16} />
                    {loading ? 'Starting...' : 'Start Sale'}
                </button>

                <button
                    className={`btn ${saleActive ? 'btn-danger' : 'btn-secondary'}`}
                    onClick={handleStopSale}
                    disabled={loading || !saleActive}
                >
                    <Square size={16} />
                    {loading ? 'Stopping...' : 'Stop Sale'}
                </button>
            </div>

            <div className="owner-info">
                <small>Only the contract owner can control the sale</small>
            </div>
        </div>
    );
};

export default OwnerControls;
