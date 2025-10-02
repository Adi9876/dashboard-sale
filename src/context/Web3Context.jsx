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
// const CONTRACT_ADDRESSES = {
//   PublicSale: "0x8Da0db6e62E487B025316bc213960Bbc44E6D226",
//   USDT: "0xe3c6dFb9c9A031aA57b53Decab631c2665163Ae2",
//   USDC: "0x5AC5c304F2759F7b5713Ee8326Bc88029458C750",
//   BNB_USD_FEED: "0x8168b5Bc0c5023Ed5fcc4B8Ca036b648f8b39084",
// };

const CONTRACT_ADDRESSES = {
  PublicSale: "0x403992b84E0D2079FBC468E7CdF9c0a52Caa82e4",
  USDT: "0xD0B69C04A833541003f2570575a7474f36A70a81",
  USDC: "0xa94BB5383e74535734354948E134A422653Dcf86",
  BNB_USD_FEED: "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526",
};
// Owner address for contract control
const OWNER_ADDRESS = "0xbA391F0B052Eacdc3Bf9a2ee1ebD091f8f9c3828"; // Replace with actual owner address

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
  "function totalClaimed() external view returns (uint256)",
  "function maxPerWallet() external view returns (uint256)",
  "function purchased(address) external view returns (uint256)",
  "function claimed(address) external view returns (bool)",
  "function tgeTimestamp() external view returns (uint256)",
  "function tokenPriceUsd6() external view returns (uint256)",
  "function priceStalenessTolerance() external view returns (uint256)",
  "function unclaimedLiability() external view returns (uint256)",
  "function pause() external",
  "function unpause() external",
  "function paused() external view returns (bool)",
  "function startSale() external",
  "function stopSale() external",
  "function setTokenPriceUsd6(uint256 usd6) external",
  "function setMaxPerWallet(uint256 maxAmount) external",
  "function setTgeTimestamp(uint256 ts) external",
  "function setPriceStalenessTolerance(uint256 tolerance) external",
  "function fundRCX(uint256 amount) external",
  "function initializeStages(uint256[] calldata _pricesUsd6, uint256[] calldata _tokenAllocations) external",
  "function withdrawProceeds(address payable to) external",
  "function recoverTokens(address tokenAddr, address to, uint256 amount) external",
  "function owner() external view returns (address)",
  "event Purchased(address indexed buyer, uint256 rcxAmount, address paymentToken, uint256 paymentAmount)",
  "event SaleStarted()",
  "event SaleStopped()",
  "event PriceUpdated(uint256 usd6)",
  "event MaxPerWalletUpdated(uint256 maxAmount)",
  "event TgeTimestampUpdated(uint256 ts)",
  "event RcxFunded(uint256 amount)",
  "event ProceedsWithdrawn(address indexed to, uint256 usdtAmount, uint256 nativeAmount)",
  "event TokensRecovered(address indexed token, address indexed to, uint256 amount)",
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
  const [isOwner, setIsOwner] = useState(false);

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

      // Check if connected address is the owner
      const contractOwner = await publicSaleContract.owner();
      setIsOwner(contractOwner.toLowerCase() === address.toLowerCase());

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
    setIsOwner(false);
    toast.success("Wallet disconnected");
  };

  // Owner control functions
  const startSale = async () => {
    if (!contract || !isOwner) {
      toast.error("Only the contract owner can start the sale");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.startSale();
      await tx.wait();
      toast.success("Sale started successfully!");
    } catch (error) {
      console.error("Error starting sale:", error);
      toast.error("Failed to start sale");
    } finally {
      setLoading(false);
    }
  };

  const stopSale = async () => {
    if (!contract || !isOwner) {
      toast.error("Only the contract owner can stop the sale");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.stopSale();
      await tx.wait();
      toast.success("Sale stopped successfully!");
    } catch (error) {
      console.error("Error stopping sale:", error);
      toast.error("Failed to stop sale");
    } finally {
      setLoading(false);
    }
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
    isOwner,
    connectWallet,
    disconnectWallet,
    startSale,
    stopSale,
    CONTRACT_ADDRESSES,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};