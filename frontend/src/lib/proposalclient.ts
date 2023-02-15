import type { ProposalMetadata } from "./models";

export async function getProposalMetadata(proposalId: number): Promise<ProposalMetadata | null> {
    const response = await fetch("Api/Proposals/" + proposalId);

    if (!response.ok) {
        return null;
    }

    const result = await response.json();
    return result as ProposalMetadata;
}

export async function submitProposalMetadata(metadata: ProposalMetadata) {
    const response = await fetch("Api/Proposals/" + metadata.proposalId,
        { 
            method: "POST", 
            body: JSON.stringify(metadata), 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            } 
        });
}