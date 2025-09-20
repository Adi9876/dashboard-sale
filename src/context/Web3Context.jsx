import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

const Web3Context = createContext();

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};

// Contract addresses from new deployment
const CONTRACT_ADDRESSES = {
  PublicSale: "0x7500C02683Cf7980e6777F3D75cbD8a406638bb9",
  USDT: "0x2d86ce52565D26885DFda58b65Ff1f792DB1f3C7",
  USDC: "0xe63926e78549d31E1958cA425794434109d7a4C1",
  BNB_USD_FEED: "0x1Ffc8ae2AF2bB1637F838D6e5F6C6b770E0F640f",
};

// Contract ABI (simplified version of the full ABI)
const PUBLIC_SALE_ABI = [
  "function initialize(address _rcx, address _usdt, address _usdc, address _nativeUsdFeed, address _vestingFactory, address _owner, uint256 _tokenPriceUsd6, uint256 _tgeTimestamp, uint256 _maxPerWallet) external",
  "function buyWithNative(uint256 rcxAmount18) external payable",
  "function buyWithUSDT(uint256 rcxAmount18) external",
  "function buyWithUSDC(uint256 rcxAmount18) external",
  "function getCurrentStage() external view returns (uint256 stageIndex, uint256 priceUsd6, uint256 tokenAllocation, uint256 tokensSold, uint256 tokensRemaining)",
  "function getStage(uint256 stageIndex) external view returns (uint256 priceUsd6, uint256 tokenAllocation, uint256 tokensSold, uint256 tokensRemaining)",
  "function getTotalStages() external view returns (uint256)",
  "function calculateCostAcrossStages(uint256 rcxAmount18) external view returns (uint256 totalCostUsd6, bool canPurchase)",
  "function nativeCost(uint256 rcxAmount18) external view returns (uint256)",
  "function usdToNative(uint256 usdAmount6) external view returns (uint256)",
  "function saleActive() external view returns (bool)",
  "function totalSold() external view returns (uint256)",
  "function maxPerWallet() external view returns (uint256)",
  "function purchased(address) external view returns (uint256)",
  "function claimed(address) external view returns (bool)",
  "function tgeTimestamp() external view returns (uint256)",
  "function tokenPriceUsd6() external view returns (uint256)",
  "function PRESALE_CAP() external view returns (uint256)",
  "function priceStalenessTolerance() external view returns (uint256)",
  "event Purchased(address indexed buyer, uint256 rcxAmount, address paymentToken, uint256 paymentAmount)",
];

const ERC20_ABI = [
  "function balanceOf(address owner) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function name() external view returns (string)",
];

const CHAINLINK_ABI = [
  "function latestRoundData() external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)",
  "function decimals() external view returns (uint8)",
];

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [contract, setContract] = useState(null);
  const [usdtContract, setUsdtContract] = useState(null);
  const [usdcContract, setUsdcContract] = useState(null);
  const [priceFeed, setPriceFeed] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(false);

  // BSC Testnet configuration
  const BSC_TESTNET = {
    chainId: "0x61", // 97 in decimal
    chainName: "BSC Testnet",
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  };

  const connectWallet = async () => {
    try {
      setLoading(true);

      if (!window.ethereum) {
        toast.error("Please install MetaMask!");
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length === 0) {
        toast.error("No accounts found");
        return;
      }

      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      if (chainId !== BSC_TESTNET.chainId) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: BSC_TESTNET.chainId }],
          });
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [BSC_TESTNET],
              });
            } catch (addError) {
              toast.error("Failed to add BSC Testnet to MetaMask");
              return;
            }
          } else {
            toast.error("Failed to switch to BSC Testnet");
            return;
          }
        }
      }

      // Set up provider and signer
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const web3Signer = web3Provider.getSigner();
      const address = await web3Signer.getAddress();
      const network = await web3Provider.getNetwork();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(address);
      setIsConnected(true);
      setNetwork(network);

      // Initialize contracts
      const publicSaleContract = new ethers.Contract(
        CONTRACT_ADDRESSES.PublicSale,
        PUBLIC_SALE_ABI,
        web3Signer
      );

      const usdtContractInstance = new ethers.Contract(
        CONTRACT_ADDRESSES.USDT,
        ERC20_ABI,
        web3Signer
      );

      const usdcContractInstance = new ethers.Contract(
        CONTRACT_ADDRESSES.USDC,
        ERC20_ABI,
        web3Signer
      );

      const priceFeedContract = new ethers.Contract(
        CONTRACT_ADDRESSES.BNB_USD_FEED,
        CHAINLINK_ABI,
        web3Provider
      );

      setContract(publicSaleContract);
      setUsdtContract(usdtContractInstance);
      setUsdcContract(usdcContractInstance);
      setPriceFeed(priceFeedContract);

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setAccount("");
    setIsConnected(false);
    setContract(null);
    setUsdtContract(null);
    setUsdcContract(null);
    setPriceFeed(null);
    setNetwork(null);
    toast.success("Wallet disconnected");
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainId) => {
        if (chainId !== BSC_TESTNET.chainId) {
          toast.error("Please switch to BSC Testnet");
          disconnectWallet();
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [account]);

  const value = {
    provider,
    signer,
    account,
    isConnected,
    contract,
    usdtContract,
    usdcContract,
    priceFeed,
    network,
    loading,
    connectWallet,
    disconnectWallet,
    CONTRACT_ADDRESSES,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};