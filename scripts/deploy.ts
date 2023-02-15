import { ethers } from "hardhat";

export default async function main() {
    const xMETRICVoterFactory = await ethers.getContractFactory("XMetricVoter");
    console.log("Deploying XMetricVoter");
    const xMETRICVoter = await xMETRICVoterFactory.deploy('0x15848C9672e99be386807b9101f83A16EB017bb5', 100n * (10n ** 18n), 7 * 24 * 60 * 60, 40);
    await xMETRICVoter.deployed();

    console.log(`XMetricVoter deployed to ${xMETRICVoter.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});