import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy"
import { env } from "process";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 100
      }
    }
  },
  //etherscan: {
  //  apiKey: "---"
  //},
  //networks: {
  //  polygon: {
  //    chainId: 137,
  //    url: "https://polygon-rpc.com",
  //    throwOnTransactionFailures: true,
  //    throwOnCallFailures: true,
  //    accounts: [(env.EVM_PRIVATE_KEY ?? "Missing Private Key")]
  //  }
  //},
};

export default config;
