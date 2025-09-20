# RCX Public Sale Frontend

A React frontend application for interacting with the RCX Public Sale smart contract. Users can purchase RCX tokens using BNB (native), USDT, or USDC.

## Features

- **Multi-payment Support**: Buy RCX with BNB, USDT, or USDC
- **Stage-based Pricing**: Dynamic pricing based on current sale stage
- **Real-time Calculations**: Live cost calculations for all payment methods
- **Wallet Integration**: MetaMask wallet connection with BSC Testnet support
- **Progress Tracking**: Visual progress indicators for sale and stage completion
- **Responsive Design**: Mobile-friendly interface

## Contract Information

- **Network**: BSC Testnet (Chain ID: 97)
PublicSale: 0x7500C02683Cf7980e6777F3D75cbD8a406638bb9
Mock USDT: 0x2d86ce52565D26885DFda58b65Ff1f792DB1f3C7
Mock USDC: 0xe63926e78549d31E1958cA425794434109d7a4C1
Mock BNB/USD Feed: 0x1Ffc8ae2AF2bB1637F838D6e5F6C6b770E0F640f


## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The application will open at `http://localhost:3000`

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask wallet
2. **Select Payment Method**: Choose between BNB, USDT, or USDC
3. **Enter Amount**: Specify how many RCX tokens you want to purchase
4. **Review Costs**: Check the calculated costs in your selected currency
5. **Purchase**: Click "Purchase RCX" to complete the transaction

## Smart Contract Functions

The application interacts with the following contract functions:

- `buyWithNative(uint256 rcxAmount18)`: Purchase RCX with BNB
- `buyWithUSDT(uint256 rcxAmount18)`: Purchase RCX with USDT
- `buyWithUSDC(uint256 rcxAmount18)`: Purchase RCX with USDC
- `getCurrentStage()`: Get current stage information
- `calculateCostAcrossStages(uint256 rcxAmount18)`: Calculate USD cost
- `nativeCost(uint256 rcxAmount18)`: Calculate BNB cost

## Technical Details

- **Frontend**: React 18 with Vite
- **Web3**: Ethers.js v5 for blockchain interaction
- **Styling**: Custom CSS with modern glassmorphism design
- **Notifications**: React Hot Toast for user feedback
- **Icons**: Lucide React for consistent iconography

## Network Configuration

The app is configured for BSC Testnet. Make sure your MetaMask is connected to:
- **Network Name**: BSC Testnet
- **RPC URL**: https://data-seed-prebsc-1-s1.binance.org:8545/
- **Chain ID**: 97
- **Currency Symbol**: BNB
- **Block Explorer**: https://testnet.bscscan.com/

## Security Notes

- Always verify contract addresses before making transactions
- Test with small amounts first
- Ensure you have sufficient gas fees
- Keep your private keys secure

## Development

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.


