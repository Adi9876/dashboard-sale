import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Square, 
  Pause, 
  PlayCircle, 
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

const PublicSaleAdmin = () => {
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
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  // Mock functions - replace with actual Web3 calls
  const startSale = async () => {
    setLoading(true);
    try {
      // await publicSaleContract.startSale();
      addNotification('Sale started successfully!', 'success');
      setContractData(prev => ({ ...prev, saleActive: true }));
    } catch (error) {
      addNotification('Failed to start sale: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const stopSale = async () => {
    setLoading(true);
    try {
      // await publicSaleContract.stopSale();
      addNotification('Sale stopped successfully!', 'success');
      setContractData(prev => ({ ...prev, saleActive: false }));
    } catch (error) {
      addNotification('Failed to stop sale: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const pauseContract = async () => {
    setLoading(true);
    try {
      // await publicSaleContract.pause();
      addNotification('Contract paused successfully!', 'success');
    } catch (error) {
      addNotification('Failed to pause contract: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const unpauseContract = async () => {
    setLoading(true);
    try {
      // await publicSaleContract.unpause();
      addNotification('Contract unpaused successfully!', 'success');
    } catch (error) {
      addNotification('Failed to unpause contract: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const setTokenPrice = async () => {
    if (!priceInput) return;
    setLoading(true);
    try {
      // await publicSaleContract.setTokenPriceUsd18(priceInput);
      addNotification(`Token price updated to $${priceInput}!`, 'success');
      setPriceInput('');
    } catch (error) {
      addNotification('Failed to update token price: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const setMaxWallet = async () => {
    if (!maxWalletInput) return;
    setLoading(true);
    try {
      // await publicSaleContract.setMaxPerWallet(maxWalletInput);
      addNotification(`Max per wallet updated to ${maxWalletInput} RCX!`, 'success');
      setMaxWalletInput('');
    } catch (error) {
      addNotification('Failed to update max per wallet: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const setTgeTimestamp = async () => {
    if (!tgeTimestampInput) return;
    setLoading(true);
    try {
      // await publicSaleContract.setTgeTimestamp(tgeTimestampInput);
      addNotification('TGE timestamp updated!', 'success');
      setTgeTimestampInput('');
    } catch (error) {
      addNotification('Failed to update TGE timestamp: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const fundRCX = async () => {
    if (!fundAmount) return;
    setLoading(true);
    try {
      // await publicSaleContract.fundRCX(fundAmount);
      addNotification(`Funded ${fundAmount} RCX tokens!`, 'success');
      setFundAmount('');
    } catch (error) {
      addNotification('Failed to fund RCX: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const setPriceTolerance = async () => {
    if (!toleranceInput) return;
    setLoading(true);
    try {
      // await publicSaleContract.setPriceStalenessTolerance(toleranceInput);
      addNotification(`Price staleness tolerance updated to ${toleranceInput} seconds!`, 'success');
      setToleranceInput('');
    } catch (error) {
      addNotification('Failed to update price tolerance: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const initializeStages = async () => {
    const prices = stagesPrices.filter(p => p.trim() !== '');
    const allocations = stagesAllocations.filter(a => a.trim() !== '');
    
    if (prices.length !== allocations.length || prices.length === 0) {
      addNotification('Prices and allocations must have the same length and not be empty!', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // await publicSaleContract.initializeStages(prices, allocations);
      addNotification(`Initialized ${prices.length} stages successfully!`, 'success');
      setStagesPrices(['']);
      setStagesAllocations(['']);
    } catch (error) {
      addNotification('Failed to initialize stages: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const withdrawProceeds = async () => {
    if (!withdrawAddress) return;
    setLoading(true);
    try {
      // await publicSaleContract.withdrawProceeds(withdrawAddress);
      addNotification(`Proceeds withdrawn to ${withdrawAddress}!`, 'success');
      setWithdrawAddress('');
    } catch (error) {
      addNotification('Failed to withdraw proceeds: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const recoverTokens = async () => {
    if (!recoverTokenAddress || !recoverToAddress || !recoverAmount) return;
    setLoading(true);
    try {
      // await publicSaleContract.recoverTokens(recoverTokenAddress, recoverToAddress, recoverAmount);
      addNotification(`Recovered ${recoverAmount} tokens to ${recoverToAddress}!`, 'success');
      setRecoverTokenAddress('');
      setRecoverToAddress('');
      setRecoverAmount('');
    } catch (error) {
      addNotification('Failed to recover tokens: ' + error.message, 'error');
    }
    setLoading(false);
  };

  const addStageField = () => {
    setStagesPrices([...stagesPrices, '']);
    setStagesAllocations([...stagesAllocations, '']);
  };

  const removeStageField = (index) => {
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

  // Additional state for getter functions
  const [viewData, setViewData] = useState({
    rcxBalance: '0',
    usdtBalance: '0',
    usdcBalance: '0',
    nativeBalance: '0',
    userPurchased: '0',
    userClaimed: false,
    queryAddress: '',
    rcxAmount: '',
    usdCost: '0',
    nativeCost: '0',
    stageDetails: [],
    currentStageInfo: null
  });

  const tabs = [
    { id: 'control', label: 'Sale Control', icon: Play },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'stages', label: 'Stages', icon: Users },
    { id: 'funding', label: 'Funding', icon: Coins },
    { id: 'withdraw', label: 'Withdraw', icon: Download },
    { id: 'view', label: 'View Data', icon: RefreshCw },
    { id: 'stats', label: 'Statistics', icon: AlertCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2">PublicSale Admin Dashboard</h1>
          <p className="text-slate-300">Manage your token sale with complete administrative control</p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Sale Status</div>
              <div className={`font-bold text-lg ${contractData.saleActive ? 'text-green-400' : 'text-red-400'}`}>
                {contractData.saleActive ? 'ACTIVE' : 'INACTIVE'}
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Total Sold</div>
              <div className="font-bold text-lg text-white">{contractData.totalSold} RCX</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Current Stage</div>
              <div className="font-bold text-lg text-white">{contractData.currentStage + 1}/{contractData.totalStages}</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-slate-400 text-sm">Unclaimed</div>
              <div className="font-bold text-lg text-white">{contractData.unclaimedLiability} RCX</div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
                notification.type === 'success' ? 'bg-green-500' : 
                notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              } text-white max-w-sm`}
            >
              <div className="flex items-center space-x-2">
                {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span className="text-sm">{notification.message}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-8 border border-white/20">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {activeTab === 'control' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Sale Control</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Sale Management</h3>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={startSale}
                      disabled={loading || contractData.saleActive}
                      className="flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <Play size={20} />
                      <span>Start Sale</span>
                    </button>
                    
                    <button
                      onClick={stopSale}
                      disabled={loading || !contractData.saleActive}
                      className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <Square size={20} />
                      <span>Stop Sale</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contract Control</h3>
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={pauseContract}
                      disabled={loading}
                      className="flex items-center justify-center space-x-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <Pause size={20} />
                      <span>Pause Contract</span>
                    </button>
                    
                    <button
                      onClick={unpauseContract}
                      disabled={loading}
                      className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <PlayCircle size={20} />
                      <span>Unpause Contract</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Token Price (USD, 18 decimals)</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      placeholder="100000000000000000 (for $0.10)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={setTokenPrice}
                      disabled={loading || !priceInput}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Max Per Wallet (RCX)</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={maxWalletInput}
                      onChange={(e) => setMaxWalletInput(e.target.value)}
                      placeholder="100000000000000000000000 (for 100k RCX)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={setMaxWallet}
                      disabled={loading || !maxWalletInput}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">TGE Timestamp</h3>
                  <div className="flex space-x-3">
                    <input
                      type="datetime-local"
                      value={tgeTimestampInput}
                      onChange={(e) => setTgeTimestampInput(e.target.value)}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={setTgeTimestamp}
                      disabled={loading || !tgeTimestampInput}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Price Staleness Tolerance (seconds)</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={toleranceInput}
                      onChange={(e) => setToleranceInput(e.target.value)}
                      placeholder="3600 (for 1 hour)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={setPriceTolerance}
                      disabled={loading || !toleranceInput}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Initialize Presale Stages</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white">Stage Configuration</h3>
                  <button
                    onClick={addStageField}
                    className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Stage</span>
                  </button>
                </div>
                
                {stagesPrices.map((price, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white/5 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Price (USD, 18 decimals)</label>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => updateStagePrice(index, e.target.value)}
                        placeholder="100000000000000000"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Token Allocation</label>
                      <input
                        type="text"
                        value={stagesAllocations[index] || ''}
                        onChange={(e) => updateStageAllocation(index, e.target.value)}
                        placeholder="1000000000000000000000000"
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      <button
                        onClick={() => removeStageField(index)}
                        className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                        disabled={stagesPrices.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={initializeStages}
                  disabled={loading}
                  className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Initialize Stages
                </button>
              </div>
            </div>
          )}

          {activeTab === 'funding' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contract Funding</h2>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Fund RCX Tokens</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="1000000000000000000000000 (for 1M RCX)"
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  />
                  <button
                    onClick={fundRCX}
                    disabled={loading || !fundAmount}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Fund
                  </button>
                </div>
                <p className="text-sm text-slate-400">
                  Transfer RCX tokens to the contract for vesting distribution. Make sure to approve the contract first.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Withdraw & Recovery</h2>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Withdraw Proceeds</h3>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={withdrawAddress}
                      onChange={(e) => setWithdrawAddress(e.target.value)}
                      placeholder="0x... (recipient address)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={withdrawProceeds}
                      disabled={loading || !withdrawAddress}
                      className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Withdraw
                    </button>
                  </div>
                  <p className="text-sm text-slate-400">
                    Withdraw all collected USDT, USDC, and native tokens to the specified address.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Recover Tokens</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={recoverTokenAddress}
                      onChange={(e) => setRecoverTokenAddress(e.target.value)}
                      placeholder="Token contract address"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <input
                      type="text"
                      value={recoverToAddress}
                      onChange={(e) => setRecoverToAddress(e.target.value)}
                      placeholder="Recipient address"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <input
                      type="text"
                      value={recoverAmount}
                      onChange={(e) => setRecoverAmount(e.target.value)}
                      placeholder="Amount"
                      className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <button
                    onClick={recoverTokens}
                    disabled={loading || !recoverTokenAddress || !recoverToAddress || !recoverAmount}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Recover Tokens
                  </button>
                  <p className="text-sm text-slate-400">
                    Recover tokens sent by mistake. For RCX, only excess beyond unclaimed liabilities can be recovered.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'view' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-white mb-4">View Contract Data</h2>
              
              {/* Contract Balances Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Contract Balances</h3>
                  <button
                    onClick={getContractBalances}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw size={16} />
                    <span>Refresh</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">RCX Balance</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount(viewData.rcxBalance, 18, 'RCX')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">USDT Balance</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount(viewData.usdtBalance, 18, 'USDT')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">USDC Balance</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount(viewData.usdcBalance, 18, 'USDC')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Native Balance</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount(viewData.nativeBalance, 18, 'ETH')}
                    </div>
                  </div>
                </div>
              </div>

              {/* User Query Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Query User Data</h3>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={viewData.queryAddress}
                      onChange={(e) => setViewData(prev => ({ ...prev, queryAddress: e.target.value }))}
                      placeholder="0x... (user address)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={getUserData}
                      disabled={loading || !viewData.queryAddress}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Query
                    </button>
                  </div>
                  
                  {viewData.queryAddress && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-slate-400 text-sm">Purchased Amount</div>
                        <div className="text-white font-bold text-lg">
                          {formatTokenAmount(viewData.userPurchased, 18, 'RCX')}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-slate-400 text-sm">Claimed Status</div>
                        <div className={`font-bold text-lg ${viewData.userClaimed ? 'text-green-400' : 'text-red-400'}`}>
                          {viewData.userClaimed ? 'CLAIMED' : 'NOT CLAIMED'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Calculator Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Cost Calculator</h3>
                <div className="space-y-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={viewData.rcxAmount}
                      onChange={(e) => setViewData(prev => ({ ...prev, rcxAmount: e.target.value }))}
                      placeholder="RCX Amount (18 decimals)"
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-blue-400"
                    />
                    <button
                      onClick={calculateCosts}
                      disabled={loading || !viewData.rcxAmount}
                      className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                      Calculate
                    </button>
                  </div>
                  
                  {viewData.rcxAmount && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-slate-400 text-sm">USD Cost (18 decimals)</div>
                        <div className="text-white font-bold text-lg">
                          {formatUsdAmount(viewData.usdCost)}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">
                          Raw: {viewData.usdCost}
                        </div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4">
                        <div className="text-slate-400 text-sm">Native Cost</div>
                        <div className="text-white font-bold text-lg">
                          {formatTokenAmount(viewData.nativeCost, 18, 'ETH')}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">
                          Raw: {viewData.nativeCost}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Current Stage Info Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Current Stage Information</h3>
                  <button
                    onClick={getCurrentStageInfo}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw size={16} />
                    <span>Refresh</span>
                  </button>
                </div>
                
                {viewData.currentStageInfo && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-slate-400 text-sm">Stage Index</div>
                      <div className="text-white font-bold text-lg">
                        {viewData.currentStageInfo.stageIndex}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-slate-400 text-sm">Price USD</div>
                      <div className="text-white font-bold text-lg">
                        {formatUsdAmount(viewData.currentStageInfo.priceUsd18)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-slate-400 text-sm">Allocation</div>
                      <div className="text-white font-bold text-lg">
                        {formatTokenAmount(viewData.currentStageInfo.tokenAllocation, 18)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-slate-400 text-sm">Sold</div>
                      <div className="text-white font-bold text-lg">
                        {formatTokenAmount(viewData.currentStageInfo.tokensSold, 18)}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="text-slate-400 text-sm">Remaining</div>
                      <div className="text-white font-bold text-lg">
                        {formatTokenAmount(viewData.currentStageInfo.tokensRemaining, 18)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* All Stages Details Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">All Stages Details</h3>
                  <button
                    onClick={getAllStageDetails}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw size={16} />
                    <span>Load Stages</span>
                  </button>
                </div>
                
                {viewData.stageDetails.length > 0 && (
                  <div className="space-y-4">
                    {viewData.stageDetails.map((stage, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-white font-semibold">Stage {stage.index}</h4>
                          <div className={`px-3 py-1 rounded-full text-sm ${
                            index === contractData.currentStage 
                              ? 'bg-green-500 text-white' 
                              : 'bg-gray-500 text-gray-300'
                          }`}>
                            {index === contractData.currentStage ? 'ACTIVE' : 'INACTIVE'}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-slate-400 text-sm">Price USD</div>
                            <div className="text-white font-medium">
                              {formatUsdAmount(stage.priceUsd18)}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-sm">Allocation</div>
                            <div className="text-white font-medium">
                              {formatTokenAmount(stage.tokenAllocation, 18, 'RCX')}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-sm">Sold</div>
                            <div className="text-white font-medium">
                              {formatTokenAmount(stage.tokensSold, 18, 'RCX')}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-400 text-sm">Remaining</div>
                            <div className="text-white font-medium">
                              {formatTokenAmount(stage.tokensRemaining, 18, 'RCX')}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress bar for each stage */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Progress</span>
                            <span>
                              {((parseFloat(stage.tokensSold) / parseFloat(stage.tokenAllocation)) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                              style={{
                                width: `${(parseFloat(stage.tokensSold) / parseFloat(stage.tokenAllocation)) * 100}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Liability Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Unclaimed Liability</h3>
                  <button
                    onClick={getUnclaimedLiability}
                    disabled={loading}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
                  >
                    <RefreshCw size={16} />
                    <span>Refresh</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Total Sold</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount(contractData.totalSold, 18, 'RCX')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Total Claimed</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount(contractData.totalClaimed, 18, 'RCX')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Unclaimed Liability</div>
                    <div className="text-red-400 font-bold text-lg">
                      {formatTokenAmount(contractData.unclaimedLiability, 18, 'RCX')}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={20} className="text-yellow-500" />
                    <span className="text-yellow-200 font-medium">Important:</span>
                  </div>
                  <p className="text-yellow-100 mt-2">
                    Unclaimed liability represents RCX tokens that have been sold but not yet claimed to vesting contracts. 
                    Only excess RCX beyond this liability can be recovered.
                  </p>
                </div>
              </div>

              {/* Contract Constants Section */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Contract Constants & Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Presale Cap</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount('20000000000000000000000000', 18, 'RCX')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Max Per Wallet</div>
                    <div className="text-white font-bold text-lg">
                      {formatTokenAmount(contractData.maxPerWallet, 18, 'RCX')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Token Price</div>
                    <div className="text-white font-bold text-lg">
                      {formatUsdAmount(contractData.tokenPriceUsd18)}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">TGE Timestamp</div>
                    <div className="text-white font-bold text-lg">
                      {contractData.tgeTimestamp ? 
                        new Date(contractData.tgeTimestamp * 1000).toLocaleString() : 
                        'Not Set'
                      }
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Price Tolerance</div>
                    <div className="text-white font-bold text-lg">
                      {Math.floor(priceStalenessTolerance / 3600)} hours
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-slate-400 text-sm">Sale Status</div>
                    <div className={`font-bold text-lg ${contractData.saleActive ? 'text-green-400' : 'text-red-400'}`}>
                      {contractData.saleActive ? 'ACTIVE' : 'INACTIVE'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">Statistics & Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Sale Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Sold:</span>
                      <span className="text-white font-medium">{contractData.totalSold} RCX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Presale Cap:</span>
                      <span className="text-white font-medium">20,000,000 RCX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Progress:</span>
                      <span className="text-white font-medium">
                        {((parseFloat(contractData.totalSold) / 20000000) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Stage Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Current Stage:</span>
                      <span className="text-white font-medium">{contractData.currentStage + 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Stages:</span>
                      <span className="text-white font-medium">{contractData.totalStages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Token Price:</span>
                      <span className="text-white font-medium">${contractData.tokenPrice}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Vesting Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Total Claimed:</span>
                      <span className="text-white font-medium">{contractData.totalClaimed} RCX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Unclaimed:</span>
                      <span className="text-white font-medium">{contractData.unclaimedLiability} RCX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">TGE Date:</span>
                      <span className="text-white font-medium">
                        {contractData.tgeTimestamp ? new Date(contractData.tgeTimestamp * 1000).toLocaleDateString() : 'Not set'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Limits & Controls</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Max Per Wallet:</span>
                      <span className="text-white font-medium">{contractData.maxPerWallet} RCX</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Sale Status:</span>
                      <span className={`font-medium ${contractData.saleActive ? 'text-green-400' : 'text-red-400'}`}>
                        {contractData.saleActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Contract Addresses</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-slate-300">RCX Token:</span>
                      <div className="text-white font-mono break-all">0x1234...5678</div>
                    </div>
                    <div>
                      <span className="text-slate-300">USDT:</span>
                      <div className="text-white font-mono break-all">0x1234...5678</div>
                    </div>
                    <div>
                      <span className="text-slate-300">USDC:</span>
                      <div className="text-white font-mono break-all">0x1234...5678</div>
                    </div>
                    <div>
                      <span className="text-slate-300">Vesting Factory:</span>
                      <div className="text-white font-mono break-all">0x1234...5678</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <RefreshCw size={16} />
                      <span>Refresh Data</span>
                    </button>
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2">
                      <Copy size={16} />
                      <span>Copy Contract Address</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Current Stage Details */}
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Current Stage Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-slate-300 text-sm">Stage Index:</span>
                    <div className="text-white font-medium text-lg">{contractData.currentStage}</div>
                  </div>
                  <div>
                    <span className="text-slate-300 text-sm">Stage Price:</span>
                    <div className="text-white font-medium text-lg">$0.10</div>
                  </div>
                  <div>
                    <span className="text-slate-300 text-sm">Allocation:</span>
                    <div className="text-white font-medium text-lg">1,000,000 RCX</div>
                  </div>
                  <div>
                    <span className="text-slate-300 text-sm">Remaining:</span>
                    <div className="text-white font-medium text-lg">750,000 RCX</div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-300 mb-2">
                    <span>Stage Progress</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>PublicSale Admin Dashboard v1.0 - Use with caution. All transactions are irreversible.</p>
          <p className="mt-2">
            Always verify transaction details before confirming. 
            <span className="text-red-400 font-medium"> Double-check addresses and amounts.</span>
          </p>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="text-white font-medium">Processing transaction...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicSaleAdmin;