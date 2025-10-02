import React, { useState } from "react";
import { useWeb3 } from "./context/Web3Context";
import Header from "./components/Header";
import SaleInfo from "./components/SaleInfo";
import PurchaseForm from "./components/PurchaseForm";
import StageInfo from "./components/StageInfo";
import WalletInfo from "./components/WalletInfo";
import DebugInfo from "./components/DebugInfo";
import OwnerControls from "./components/OwnerControls";
import PublicSaleAdmin from "./components/admin";

function AppContent() {
    const { isConnected, account, isOwner } = useWeb3();
    const [showAdminView, setShowAdminView] = useState(false);

    const handleToggleAdminView = () => {
        setShowAdminView(!showAdminView);
    };

    return (
        <>
            <Header
                showAdminView={showAdminView}
                onToggleAdminView={handleToggleAdminView}
            />

            {showAdminView && isConnected && isOwner ? (
                <PublicSaleAdmin />
            ) : (
                <main className="main-content">
                    <div className="container">
                        <div className="grid">
                            <div className="left-panel">
                                <OwnerControls />
                                <SaleInfo />
                                <StageInfo />
                                <DebugInfo />
                            </div>
                            <div className="right-panel">
                                <WalletInfo account={account} />
                                <PurchaseForm account={account} />
                            </div>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
}

export default AppContent;
