import React from "react";
import { useWeb3 } from "./context/Web3Context";
import Header from "./components/Header";
import SaleInfo from "./components/SaleInfo";
import PurchaseForm from "./components/PurchaseForm";
import StageInfo from "./components/StageInfo";
import WalletInfo from "./components/WalletInfo";
import DebugInfo from "./components/DebugInfo";

function AppContent() {
    const { isConnected, account } = useWeb3();

    return (
        <>
            <Header />
            <main className="main-content">
                <div className="container">
                    <div className="grid">
                        <div className="left-panel">
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
