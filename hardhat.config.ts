import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",

  networks: {
    holesky: {
      url: process.env.RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 17000,
      gasPrice: 3000000000,
      gas: 600000,
    }
  }
};

export default config;
