import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv"
dotenv.config()
const config: HardhatUserConfig = {
  solidity: "0.8.28",
  paths: {
    artifacts: "./contracts/artifacts",
    sources: "./contracts/contracts",
    cache: "./contracts/cache",
    tests: "./contracts/test"
  },
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL as string,  
      accounts:[process.env.PRIVATE_KEY as string],  
    },
  },
};

export default config;
