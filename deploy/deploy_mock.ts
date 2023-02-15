import { ethers } from "hardhat";

export default async function main() {
  const xMETRICFactory = await ethers.getContractFactory("MockERC20");
  console.log("Deploying xMETRIC");
  const xMETRIC = await xMETRICFactory.deploy(1000000000000000000000n, "xMETRIC", 18, "xMETRIC");
  await xMETRIC.deployed();

  console.log(`xMETRIC deployed to ${xMETRIC.address}`)

  const xMETRICVoterFactory = await ethers.getContractFactory("XMetricVoter");
  console.log("Deploying XMetricVoter");
  const xMETRICVoter = await xMETRICVoterFactory.deploy(xMETRIC.address, 100n * (10n ** 18n), 7 * 24 * 60 * 60, 40);
  await xMETRICVoter.deployed();

  console.log(`XMetricVoter deployed to ${xMETRICVoter.address}`);
}