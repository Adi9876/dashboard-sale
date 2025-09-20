#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🚀 Setting up RCX Public Sale Frontend...\n");

// Check if package.json exists
const packageJsonPath = path.join(__dirname, "..", "package.json");
if (!fs.existsSync(packageJsonPath)) {
  console.error(
    "❌ package.json not found. Please run this script from the project root."
  );
  process.exit(1);
}

console.log("✅ Project structure looks good!");
console.log("\n📋 Next steps:");
console.log("1. Run: npm install");
console.log("2. Run: npm start");
console.log("\n🔗 Contract Addresses:");
console.log("PublicSale: 0xa5837E0A34dE321c91BA38643786C75B15f01fF9");
console.log("USDT: 0xb13C4A99E163a36B23f8D144183FDEC5D058396F");
console.log("USDC: 0x618a22Df87a05c5ff99f215700eFAB6192615CA4");
console.log("BNB/USD Feed: 0x39743dA649683C1cFaf3dA8641545Fb7a1B1157e");
console.log("\n🌐 Network: BSC Testnet (Chain ID: 97)");
console.log("\n✨ Happy coding!");


