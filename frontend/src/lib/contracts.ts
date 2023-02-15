import { signer } from 'svelte-ethers-store';
import { writable } from 'svelte/store';
import type { IERC20 } from '../../../typechain-types';
import IERC20Abi from '../../../artifacts/@openzeppelin/contracts/token/ERC20/IERC20.sol/IERC20.json';
import type { XMetricVoter } from '../../../typechain-types';
import xMETRICVoterABI from '../../../artifacts/contracts/XMetricVoter.sol/XMetricVoter.json';
import { ethers, type Signer } from 'ethers';

export const SUPPORTED_CHAIN_ID = 137;
export const VOTER_CONTRACT_ADDRESS = "0x9a8a7C26cF66CD61CA6D582Bf362D40b19B54746";
export const XMETRIC_CONTRACT_ADDRESS = "0x15848C9672e99be386807b9101f83A16EB017bb5";

export function useXMetric() {
    const { subscribe, set } = writable<IERC20 | null>(null);

    signer.subscribe(currentSigner => {
        updateContract(currentSigner as any);
    }, () => set(null));

    function updateContract(signer: Signer | null) {
        const contract = (new ethers.Contract(
            XMETRIC_CONTRACT_ADDRESS,
            IERC20Abi.abi,
            signer as any
        ) as any as IERC20);

        set(contract);
    }

    return {
        subscribe
    };
}

export function useXMetricVoter() {
    const { subscribe, set } = writable<XMetricVoter | null>(null);

    signer.subscribe(currentSigner => {
        updateContract(currentSigner as any);
    }, () => set(null));

    function updateContract(signer: Signer | null) {
        const contract = (new ethers.Contract(
            VOTER_CONTRACT_ADDRESS,
            xMETRICVoterABI.abi,
            signer as any
        ) as any as XMetricVoter);

        set(contract);
    }

    return {
        subscribe
    };
}