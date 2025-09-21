import React from "react";
import { useWeb3 } from "./context/Web3Context";
import Header from "./components/Header";
import SaleInfo from "./components/SaleInfo";
import PurchaseForm from "./components/PurchaseForm";
import StageInfo from "./components/StageInfo";
import WalletInfo from "./components/WalletInfo";
import DebugInfo from "./components/DebugInfo";
import OwnerControls from "./components/OwnerControls";

function AppContent() {
    const { isConnected, account } = useWeb3();

    return (
        <>
            <Header />
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
        </>
    );
}

export default AppContent;
