import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Settings,
  DollarSign,
  Users,
  Calendar,
  Coins,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import toast from 'react-hot-toast';

const PublicSaleAdmin = () => {
  const {
    contract,
    usdtContract,
    usdcContract,
    account,
    isOwner,
    loading: web3Loading,
    startSale: web3StartSale,
    stopSale: web3StopSale
  } = useWeb3();

  // State for contract data
  const [contractData, setContractData] = useState({
    saleActive: false,
    totalSold: '0',
    currentStage: 0,
    totalStages: 0,
    maxPerWallet: '0',
    tokenPrice: '0',
    tgeTimestamp: 0,
    totalClaimed: '0',
    unclaimedLiability: '0'
  });

  // State for forms
  const [priceInput, setPriceInput] = useState('');
  const [maxWalletInput, setMaxWalletInput] = useState('');
  const [tgeTimestampInput, setTgeTimestampInput] = useState('');
  const [fundAmount, setFundAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [recoverTokenAddress, setRecoverTokenAddress] = useState('');
  const [recoverToAddress, setRecoverToAddress] = useState('');
  const [recoverAmount, setRecoverAmount] = useState('');
  const [toleranceInput, setToleranceInput] = useState('');

  // Stage management
  const [stagesPrices, setStagesPrices] = useState(['']);
  const [stagesAllocations, setStagesAllocations] = useState(['']);

  // UI state
  const [activeTab, setActiveTab] = useState('control');
  const [loading, setLoading] = useState(false);
  const [detailedViewData, setDetailedViewData] = useState({
    stages: [],
    contractBalances: {
      usdt: '0',
      usdc: '0',
      native: '0'
    },
    priceStalenessTolerance: '0',
    unclaimedLiability: '0'
  });

  // Fetch contract data
  useEffect(() => {
    const fetchContractData = async () => {
      if (!contract) return;

      try {
        const [
          saleActive,
          totalSold,
          currentStage,
          totalStages,
          maxPerWallet,
          tokenPrice,
          tgeTimestamp,
          totalClaimed
        ] = await Promise.all([
          contract.saleActive(),
          contract.totalSold(),
          contract.getCurrentStage().then(stage => stage.stageIndex),
          contract.getTotalStages(),
          contract.maxPerWallet(),
          contract.tokenPriceUsd6(),
          contract.tgeTimestamp(),
          contract.totalClaimed()
        ]);

        setContractData({
          saleActive,
          totalSold: totalSold.toString(),
          currentStage: currentStage.toNumber(),
          totalStages: totalStages.toNumber(),
          maxPerWallet: maxPerWallet.toString(),
          tokenPrice: tokenPrice.toString(),
          tgeTimestamp: tgeTimestamp.toNumber(),
          totalClaimed: totalClaimed.toString(),
          unclaimedLiability: (totalSold - totalClaimed).toString()
        });
      } catch (error) {
        console.error('Error fetching contract data:', error);
        toast.error('Failed to fetch contract data');
      }
    };

    fetchContractData();
  }, [contract]);

  // Contract interaction functions
  const handleStartSale = async () => {
    if (!isOwner) {
      toast.error('Only the contract owner can start the sale');
      return;
    }

    setLoading(true);
    try {
      await web3StartSale();
      // Refresh data after starting sale
      const saleActive = await contract.saleActive();
      setContractData(prev => ({ ...prev, saleActive }));
    } catch (error) {
      console.error('Error starting sale:', error);
      toast.error('Failed to start sale');
    }
    setLoading(false);
  };

  const handleStopSale = async () => {
    if (!isOwner) {
      toast.error('Only the contract owner can stop the sale');
      return;
    }

    setLoading(true);
    try {
      await web3StopSale();
      // Refresh data after stopping sale
      const saleActive = await contract.saleActive();
      setContractData(prev => ({ ...prev, saleActive }));
    } catch (error) {
      console.error('Error stopping sale:', error);
      toast.error('Failed to stop sale');
    }
    setLoading(false);
  };

  const refreshData = async () => {
    if (!contract) return;

    setLoading(true);
    try {
      const [
        saleActive,
        totalSold,
        currentStage,
        totalStages,
        maxPerWallet,
        tokenPrice,
        tgeTimestamp,
        totalClaimed
      ] = await Promise.all([
        contract.saleActive(),
        contract.totalSold(),
        contract.getCurrentStage().then(stage => stage.stageIndex),
        contract.getTotalStages(),
        contract.maxPerWallet(),
        contract.tokenPriceUsd6(),
        contract.tgeTimestamp(),
        contract.totalClaimed()
      ]);

      setContractData(prev => ({
        ...prev,
        saleActive,
        totalSold: totalSold.toString(),
        currentStage: currentStage.toNumber(),
        totalStages: totalStages.toNumber(),
        maxPerWallet: maxPerWallet.toString(),
        tokenPrice: tokenPrice.toString(),
        tgeTimestamp: tgeTimestamp.toNumber(),
        totalClaimed: totalClaimed.toString(),
        unclaimedLiability: (totalSold - totalClaimed).toString()
      }));

      toast.success('Data refreshed successfully');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast.error('Failed to refresh data');
    }
    setLoading(false);
  };

  // Fetch detailed view data
  const fetchDetailedViewData = async () => {
    if (!contract || !usdtContract || !usdcContract) return;

    try {
      const [
        totalStages,
        priceStalenessTolerance,
        unclaimedLiability
      ] = await Promise.all([
        contract.getTotalStages(),
        contract.priceStalenessTolerance(),
        contract.unclaimedLiability()
      ]);

      // Fetch all stages
      const stages = [];
      for (let i = 0; i < totalStages.toNumber(); i++) {
        const stage = await contract.getStage(i);
        stages.push({
          index: i,
          price: stage.priceUsd6.toString(),
          allocation: stage.tokenAllocation.toString(),
          sold: stage.tokensSold.toString(),
          remaining: stage.tokensRemaining.toString()
        });
      }

      // Fetch contract balances
      const [usdtBalance, usdcBalance, nativeBalance] = await Promise.all([
        usdtContract.balanceOf(contract.address),
        usdcContract.balanceOf(contract.address),
        contract.provider.getBalance(contract.address)
      ]);

      setDetailedViewData({
        stages,
        contractBalances: {
          usdt: usdtBalance.toString(),
          usdc: usdcBalance.toString(),
          native: nativeBalance.toString()
        },
        priceStalenessTolerance: priceStalenessTolerance.toString(),
        unclaimedLiability: unclaimedLiability.toString()
      });
    } catch (error) {
      console.error('Error fetching detailed view data:', error);
    }
  };

  // Settings functions
  const updateTokenPrice = async () => {
    if (!contract || !isOwner) {
      toast.error('Only the contract owner can update settings');
      return;
    }

    if (!priceInput || isNaN(priceInput)) {
      toast.error('Please enter a valid price');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.setTokenPriceUsd6(priceInput);
      await tx.wait();
      toast.success('Token price updated successfully');
      setPriceInput('');
      await refreshData();
    } catch (error) {
      console.error('Error updating token price:', error);
      toast.error('Failed to update token price');
    }
    setLoading(false);
  };

  const updateMaxPerWallet = async () => {
    if (!contract || !isOwner) {
      toast.error('Only the contract owner can update settings');
      return;
    }

    if (!maxWalletInput || isNaN(maxWalletInput)) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.setMaxPerWallet(maxWalletInput);
      await tx.wait();
      toast.success('Max per wallet updated successfully');
      setMaxWalletInput('');
      await refreshData();
    } catch (error) {
      console.error('Error updating max per wallet:', error);
      toast.error('Failed to update max per wallet');
    }
    setLoading(false);
  };

  const updateTgeTimestamp = async () => {
    if (!contract || !isOwner) {
      toast.error('Only the contract owner can update settings');
      return;
    }

    if (!tgeTimestampInput || isNaN(tgeTimestampInput)) {
      toast.error('Please enter a valid timestamp');
      return;
    }

    const timestamp = parseInt(tgeTimestampInput);
    if (timestamp <= Math.floor(Date.now() / 1000)) {
      toast.error('TGE timestamp must be in the future');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.setTgeTimestamp(timestamp);
      await tx.wait();
      toast.success('TGE timestamp updated successfully');
      setTgeTimestampInput('');
      await refreshData();
    } catch (error) {
      console.error('Error updating TGE timestamp:', error);
      toast.error('Failed to update TGE timestamp');
    }
    setLoading(false);
  };

  // Stage management functions
  const addStageField = () => {
    setStagesPrices([...stagesPrices, '']);
    setStagesAllocations([...stagesAllocations, '']);
  };

  const removeStageField = (index) => {
    if (stagesPrices.length <= 1) return; // Keep at least one stage
    setStagesPrices(stagesPrices.filter((_, i) => i !== index));
    setStagesAllocations(stagesAllocations.filter((_, i) => i !== index));
  };

  const updateStagePrice = (index, value) => {
    const newPrices = [...stagesPrices];
    newPrices[index] = value;
    setStagesPrices(newPrices);
  };

  const updateStageAllocation = (index, value) => {
    const newAllocations = [...stagesAllocations];
    newAllocations[index] = value;
    setStagesAllocations(newAllocations);
  };

  const initializeStages = async () => {
    if (!contract || !isOwner) {
      toast.error('Only the contract owner can initialize stages');
      return;
    }

    // Validate inputs
    const validPrices = stagesPrices.filter(price => price && !isNaN(price));
    const validAllocations = stagesAllocations.filter(allocation => allocation && !isNaN(allocation));

    if (validPrices.length === 0 || validAllocations.length === 0) {
      toast.error('Please fill in at least one valid stage');
      return;
    }

    if (validPrices.length !== validAllocations.length) {
      toast.error('Number of prices must match number of allocations');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.initializeStages(validPrices, validAllocations);
      await tx.wait();
      toast.success('Stages initialized successfully');
      setStagesPrices(['']);
      setStagesAllocations(['']);
      await refreshData();
    } catch (error) {
      console.error('Error initializing stages:', error);
      toast.error('Failed to initialize stages');
    }
    setLoading(false);
  };

  // Funding functions
  const fundContract = async () => {
    if (!contract || !isOwner) {
      toast.error('Only the contract owner can fund the contract');
      return;
    }

    if (!fundAmount || isNaN(fundAmount)) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.fundRCX(fundAmount);
      await tx.wait();
      toast.success('Contract funded successfully');
      setFundAmount('');
      await refreshData();
    } catch (error) {
      console.error('Error funding contract:', error);
      toast.error('Failed to fund contract');
    }
    setLoading(false);
  };

  // Withdrawal functions
  const withdrawProceeds = async () => {
    if (!contract || !isOwner) {
      toast.error('Only the contract owner can withdraw proceeds');
      return;
    }

    if (!withdrawAddress) {
      toast.error('Please enter a withdrawal address');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.withdrawProceeds(withdrawAddress);
      await tx.wait();
      toast.success('Proceeds withdrawn successfully');
      setWithdrawAddress('');
      await refreshData();
    } catch (error) {
      console.error('Error withdrawing proceeds:', error);
      toast.error('Failed to withdraw proceeds');
    }
    setLoading(false);
  };

  const recoverTokens = async () => {
    if (!contract || !isOwner) {
      toast.error('Only the contract owner can recover tokens');
      return;
    }

    if (!recoverTokenAddress || !recoverToAddress || !recoverAmount) {
      toast.error('Please fill in all recovery fields');
      return;
    }

    setLoading(true);
    try {
      const tx = await contract.recoverTokens(recoverTokenAddress, recoverToAddress, recoverAmount);
      await tx.wait();
      toast.success('Tokens recovered successfully');
      setRecoverTokenAddress('');
      setRecoverToAddress('');
      setRecoverAmount('');
      await refreshData();
    } catch (error) {
      console.error('Error recovering tokens:', error);
      toast.error('Failed to recover tokens');
    }
    setLoading(false);
  };

  const tabs = [
    { id: 'control', label: 'Sale Control', icon: Play },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'stages', label: 'Stages', icon: Users },
    { id: 'funding', label: 'Funding', icon: Coins },
    { id: 'withdraw', label: 'Withdraw', icon: Download },
    { id: 'view', label: 'View Data', icon: RefreshCw },
    { id: 'stats', label: 'Statistics', icon: AlertCircle }
  ];

  if (!isOwner) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="card">
            <h2>Access Denied</h2>
            <p>You must be the contract owner to access the admin dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        {/* Header */}
        <div className="card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>RCX Public Sale Admin Dashboard</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Manage your token sale with complete administrative control</p>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Sale Status</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: contractData.saleActive ? '#4ade80' : '#f87171' }}>
                {contractData.saleActive ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Total Sold</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'white' }}>
                {contractData.totalSold} RCX
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Current Stage</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'white' }}>
                {contractData.currentStage + 1}/{contractData.totalStages}
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>Max Per Wallet</div>
              <div style={{ fontWeight: 'bold', fontSize: '1.125rem', color: 'white' }}>
                {contractData.maxPerWallet} RCX
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`btn ${activeTab === tab.id ? '' : 'btn-secondary'}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ marginBottom: '0.5rem' }}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
            <button
              className="btn btn-secondary"
              onClick={refreshData}
              disabled={loading || web3Loading}
              style={{ marginBottom: '0.5rem' }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="card">
          {activeTab === 'control' && (
            <div>
              <h3>Sale Control</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  className={`btn ${contractData.saleActive ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={handleStartSale}
                  disabled={loading || web3Loading || contractData.saleActive}
                >
                  <Play size={16} />
                  {loading ? 'Starting...' : 'Start Sale'}
                </button>
                <button
                  className={`btn ${contractData.saleActive ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={handleStopSale}
                  disabled={loading || web3Loading || !contractData.saleActive}
                >
                  <Square size={16} />
                  {loading ? 'Stopping...' : 'Stop Sale'}
                </button>
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <h4>Sale Information</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                  <div>
                    <strong>Status:</strong> {contractData.saleActive ? 'Active' : 'Inactive'}
                  </div>
                  <div>
                    <strong>Token Price:</strong> {contractData.tokenPrice} USD
                  </div>
                  <div>
                    <strong>TGE Timestamp:</strong> {new Date(contractData.tgeTimestamp * 1000).toLocaleString()}
                  </div>
                  <div>
                    <strong>Max Per Wallet:</strong> {contractData.maxPerWallet} RCX
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'view' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>Contract Data</h3>
                <button
                  className="btn btn-secondary"
                  onClick={fetchDetailedViewData}
                  disabled={loading || web3Loading}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  <RefreshCw size={16} />
                  Load Detailed Data
                </button>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {/* Sale Statistics */}
                  <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                    <h4>Sale Statistics</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div><strong>Total Sold:</strong> {contractData.totalSold} RCX</div>
                      <div><strong>Total Claimed:</strong> {contractData.totalClaimed} RCX</div>
                      <div><strong>Unclaimed Liability:</strong> {detailedViewData.unclaimedLiability || contractData.unclaimedLiability} RCX</div>
                      <div><strong>Current Stage:</strong> {contractData.currentStage + 1} of {contractData.totalStages}</div>
                    </div>
                  </div>

                  {/* Contract Configuration */}
                  <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                    <h4>Contract Configuration</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div><strong>Token Price:</strong> {contractData.tokenPrice} USD</div>
                      <div><strong>Max Per Wallet:</strong> {contractData.maxPerWallet} RCX</div>
                      <div><strong>TGE Timestamp:</strong> {new Date(contractData.tgeTimestamp * 1000).toLocaleString()}</div>
                      <div><strong>Sale Active:</strong> {contractData.saleActive ? 'Yes' : 'No'}</div>
                      <div><strong>Price Staleness Tolerance:</strong> {detailedViewData.priceStalenessTolerance || '0'} seconds</div>
                    </div>
                  </div>

                  {/* Contract Balances */}
                  <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                    <h4>Contract Balances</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div><strong>USDT Balance:</strong> {detailedViewData.contractBalances.usdt} USDT</div>
                      <div><strong>USDC Balance:</strong> {detailedViewData.contractBalances.usdc} USDC</div>
                      <div><strong>Native Balance:</strong> {detailedViewData.contractBalances.native} BNB</div>
                    </div>
                  </div>

                  {/* Stages Information */}
                  {detailedViewData.stages.length > 0 && (
                    <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                      <h4>Stage Details</h4>
                      <div style={{ marginTop: '0.5rem' }}>
                        {detailedViewData.stages.map((stage, index) => (
                          <div key={index} style={{
                            padding: '0.75rem',
                            background: index === contractData.currentStage ? '#e6fffa' : 'white',
                            border: `1px solid ${index === contractData.currentStage ? '#38b2ac' : '#e2e8f0'}`,
                            borderRadius: '4px',
                            marginBottom: '0.5rem'
                          }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                              Stage {stage.index + 1} {index === contractData.currentStage ? '(Current)' : ''}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', fontSize: '0.875rem' }}>
                              <div><strong>Price:</strong> {stage.price} USD</div>
                              <div><strong>Allocation:</strong> {stage.allocation} RCX</div>
                              <div><strong>Sold:</strong> {stage.sold} RCX</div>
                              <div><strong>Remaining:</strong> {stage.remaining} RCX</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3>Settings</h3>
              <p style={{ color: '#718096', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Update contract settings. All changes require owner privileges.
              </p>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Token Price Setting */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Token Price (USD)</h4>
                  <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                    Current: {contractData.tokenPrice} USD (6 decimals)
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Enter new price (6 decimals)"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={updateTokenPrice}
                      disabled={loading || web3Loading || !priceInput}
                    >
                      <DollarSign size={16} />
                      Update
                    </button>
                  </div>
                </div>

                {/* Max Per Wallet Setting */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Max Per Wallet (RCX)</h4>
                  <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                    Current: {contractData.maxPerWallet} RCX
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Enter new max amount (18 decimals)"
                      value={maxWalletInput}
                      onChange={(e) => setMaxWalletInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={updateMaxPerWallet}
                      disabled={loading || web3Loading || !maxWalletInput}
                    >
                      <Users size={16} />
                      Update
                    </button>
                  </div>
                </div>

                {/* TGE Timestamp Setting */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>TGE Timestamp</h4>
                  <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                    Current: {new Date(contractData.tgeTimestamp * 1000).toLocaleString()}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Enter Unix timestamp"
                      value={tgeTimestampInput}
                      onChange={(e) => setTgeTimestampInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={updateTgeTimestamp}
                      disabled={loading || web3Loading || !tgeTimestampInput}
                    >
                      <Calendar size={16} />
                      Update
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.5rem' }}>
                    Enter Unix timestamp (seconds since epoch). Must be in the future.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stages' && (
            <div>
              <h3>Stage Management</h3>
              <p style={{ color: '#718096', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Configure sale stages with different prices and token allocations.
              </p>

              {/* Current Stages Info */}
              <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Current Stages</h4>
                <p style={{ fontSize: '0.875rem', color: '#718096' }}>
                  Total Stages: {contractData.totalStages} | Current Stage: {contractData.currentStage + 1}
                </p>
              </div>

              {/* Stage Configuration */}
              <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ marginBottom: '1rem', color: '#2d3748' }}>Configure New Stages</h4>
                <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                  Warning: This will replace all existing stages. Prices are in USD (6 decimals), allocations are in RCX (18 decimals).
                </p>

                {stagesPrices.map((price, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginBottom: '0.5rem',
                    padding: '0.5rem',
                    background: 'white',
                    borderRadius: '4px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ minWidth: '60px', fontSize: '0.875rem', color: '#4a5568' }}>
                      Stage {index + 1}:
                    </span>
                    <input
                      type="number"
                      placeholder="Price (USD, 6 decimals)"
                      value={price}
                      onChange={(e) => updateStagePrice(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Allocation (RCX, 18 decimals)"
                      value={stagesAllocations[index]}
                      onChange={(e) => updateStageAllocation(index, e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      className="btn btn-secondary"
                      onClick={() => removeStageField(index)}
                      disabled={stagesPrices.length <= 1}
                      style={{ minWidth: 'auto', padding: '0.5rem' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={addStageField}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Plus size={16} />
                    Add Stage
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={initializeStages}
                    disabled={loading || web3Loading}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Users size={16} />
                    {loading ? 'Initializing...' : 'Initialize Stages'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'funding' && (
            <div>
              <h3>Contract Funding</h3>
              <p style={{ color: '#718096', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Fund the contract with RCX tokens for the public sale.
              </p>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Fund Contract */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Fund Contract with RCX</h4>
                  <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                    Transfer RCX tokens from your wallet to the contract for the public sale.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="number"
                      placeholder="Enter RCX amount (18 decimals)"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={fundContract}
                      disabled={loading || web3Loading || !fundAmount}
                    >
                      <Coins size={16} />
                      Fund Contract
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.5rem' }}>
                    Make sure you have approved the contract to spend your RCX tokens first.
                  </p>
                </div>

                {/* Funding Information */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Funding Information</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Total Sold:</strong> {contractData.totalSold} RCX
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Total Claimed:</strong> {contractData.totalClaimed} RCX
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Unclaimed Liability:</strong> {contractData.unclaimedLiability} RCX
                    </div>
                    <div style={{ fontSize: '0.875rem' }}>
                      <strong>Current Stage:</strong> {contractData.currentStage + 1} of {contractData.totalStages}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div>
              <h3>Withdraw & Recovery</h3>
              <p style={{ color: '#718096', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Withdraw sale proceeds and recover tokens from the contract.
              </p>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Withdraw Proceeds */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Withdraw Sale Proceeds</h4>
                  <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                    Withdraw all collected USDT, USDC, and native tokens from the contract.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      placeholder="Enter withdrawal address"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={withdrawProceeds}
                      disabled={loading || web3Loading || !withdrawAddress}
                    >
                      <Download size={16} />
                      Withdraw All
                    </button>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.5rem' }}>
                    This will withdraw all USDT, USDC, and native tokens to the specified address.
                  </p>
                </div>

                {/* Token Recovery */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <h4 style={{ marginBottom: '0.5rem', color: '#2d3748' }}>Recover Tokens</h4>
                  <p style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '1rem' }}>
                    Recover tokens that were mistakenly sent to the contract.
                  </p>

                  <div style={{ display: 'grid', gap: '0.5rem', marginBottom: '1rem' }}>
                    <input
                      type="text"
                      placeholder="Token contract address"
                      value={recoverTokenAddress}
                      onChange={(e) => setRecoverTokenAddress(e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Recovery destination address"
                      value={recoverToAddress}
                      onChange={(e) => setRecoverToAddress(e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Amount to recover"
                      value={recoverAmount}
                      onChange={(e) => setRecoverAmount(e.target.value)}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #cbd5e0',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}
                    />
                  </div>

                  <button
                    className="btn btn-secondary"
                    onClick={recoverTokens}
                    disabled={loading || web3Loading || !recoverTokenAddress || !recoverToAddress || !recoverAmount}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <Download size={16} />
                    Recover Tokens
                  </button>

                  <p style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.5rem' }}>
                    For RCX tokens, only excess amounts beyond unclaimed liabilities can be recovered.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div>
              <h3>Statistics & Analytics</h3>
              <p style={{ color: '#718096', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                Comprehensive analytics and performance metrics for the public sale.
              </p>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Sale Performance Metrics */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                  <h4>Sale Performance</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div><strong>Total Sold:</strong> {contractData.totalSold} RCX</div>
                    <div><strong>Total Claimed:</strong> {contractData.totalClaimed} RCX</div>
                    <div><strong>Unclaimed:</strong> {contractData.unclaimedLiability} RCX</div>
                    <div><strong>Claim Rate:</strong> {contractData.totalSold > 0 ? ((parseFloat(contractData.totalClaimed) / parseFloat(contractData.totalSold)) * 100).toFixed(2) : 0}%</div>
                  </div>
                </div>

                {/* Stage Progress */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                  <h4>Stage Progress</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div><strong>Current Stage:</strong> {contractData.currentStage + 1} of {contractData.totalStages}</div>
                    <div><strong>Stage Progress:</strong> {contractData.totalStages > 0 ? (((contractData.currentStage + 1) / contractData.totalStages) * 100).toFixed(1) : 0}%</div>
                    <div><strong>Token Price:</strong> {contractData.tokenPrice} USD</div>
                    <div><strong>Sale Status:</strong>
                      <span style={{
                        color: contractData.saleActive ? '#38a169' : '#e53e3e',
                        fontWeight: 'bold'
                      }}>
                        {contractData.saleActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contract Health */}
                <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                  <h4>Contract Health</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div><strong>Max Per Wallet:</strong> {contractData.maxPerWallet} RCX</div>
                    <div><strong>TGE Date:</strong> {new Date(contractData.tgeTimestamp * 1000).toLocaleDateString()}</div>
                    <div><strong>Time to TGE:</strong> {
                      contractData.tgeTimestamp > Math.floor(Date.now() / 1000)
                        ? `${Math.ceil((contractData.tgeTimestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24))} days`
                        : 'TGE Passed'
                    }</div>
                    <div><strong>Price Tolerance:</strong> {detailedViewData.priceStalenessTolerance || '0'} seconds</div>
                  </div>
                </div>

                {/* Financial Overview */}
                {detailedViewData.contractBalances.usdt !== '0' || detailedViewData.contractBalances.usdc !== '0' || detailedViewData.contractBalances.native !== '0' ? (
                  <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                    <h4>Financial Overview</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <div><strong>USDT Collected:</strong> {detailedViewData.contractBalances.usdt} USDT</div>
                      <div><strong>USDC Collected:</strong> {detailedViewData.contractBalances.usdc} USDC</div>
                      <div><strong>BNB Collected:</strong> {detailedViewData.contractBalances.native} BNB</div>
                      <div><strong>Total Value (Est.):</strong>
                        {contractData.tokenPrice > 0 && contractData.totalSold > 0
                          ? `~${(parseFloat(contractData.totalSold) * parseFloat(contractData.tokenPrice) / 1e12).toFixed(2)} USD`
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Stage Breakdown */}
                {detailedViewData.stages.length > 0 && (
                  <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                    <h4>Stage Breakdown</h4>
                    <div style={{ marginTop: '0.5rem' }}>
                      {detailedViewData.stages.map((stage, index) => {
                        const soldPercent = stage.allocation > 0 ? (parseFloat(stage.sold) / parseFloat(stage.allocation)) * 100 : 0;
                        return (
                          <div key={index} style={{
                            marginBottom: '0.75rem',
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '4px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <strong>Stage {stage.index + 1}</strong>
                              <span style={{ fontSize: '0.875rem', color: '#718096' }}>
                                {soldPercent.toFixed(1)}% sold
                              </span>
                            </div>
                            <div style={{
                              width: '100%',
                              height: '8px',
                              background: '#e2e8f0',
                              borderRadius: '4px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                width: `${soldPercent}%`,
                                height: '100%',
                                background: index === contractData.currentStage ? '#38b2ac' : '#667eea',
                                transition: 'width 0.3s ease'
                              }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.875rem' }}>
                              <div><strong>Price:</strong> {stage.price} USD</div>
                              <div><strong>Sold:</strong> {stage.sold} RCX</div>
                              <div><strong>Remaining:</strong> {stage.remaining} RCX</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicSaleAdmin;