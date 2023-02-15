import type { BigNumber } from "ethers";

export interface ProposalMetadata {
    proposalId: number;
    contentHash: string;
    title: string;
    description: string;
}

export interface Proposal {
    proposalId: number;
    contentHash: string;
    submitter: string;
    deadline: Date;
    status: number;
    metadata: ProposalMetadata | null; 
    yesVotes: BigNumber;
    noVotes: BigNumber;
}

export enum VoteType {
    None = 0,
    Yes = 1,
    No = 2
}