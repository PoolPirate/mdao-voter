<script lang="ts">
	import { SUPPORTED_CHAIN_ID, useXMetric, useXMetricVoter } from '$lib/contracts';
	import { connected, chainId, signer } from 'svelte-ethers-store';
	import { getProposalMetadata } from '$lib/proposalclient';
	import { VoteType, type Proposal } from '$lib/models';
	import ProposalCard from './ProposalCard.svelte';
	import ProposeModal from './ProposeModal.svelte';
	import { writable } from 'svelte/store';
	import VoteModal from './VoteModal.svelte';
	import { ethers } from 'ethers';
	import type { IERC20, XMetricVoter } from '../../../../typechain-types';
	import { is_client } from 'svelte/internal';

	const xMETRIC = useXMetric();
	const xMETRICVoter = useXMetricVoter();

	const proposeModalOpen = writable<boolean>(false);
	const voteModalOpen = writable<boolean>(false);
	const voteModalProposal = writable<Proposal | null>(null);

	const xMETRICSupply = writable<bigint>(1n);

	$: anyModalOpen.set($proposeModalOpen || $voteModalOpen);
	const anyModalOpen = writable<boolean>(false);

	const loadError = writable<boolean>(false);
	const proposals = writable<Proposal[] | null>(null);

	$: if ($connected) refreshProposals($xMETRICVoter, $xMETRIC);
	async function refreshProposals(xMETRICVoter: XMetricVoter | null, xMETRIC: IERC20 | null) {
		try {
			proposals.set(null);

			if (xMETRICVoter == null || xMETRIC == null || !is_client) {
				return;
			}

			const peakId = await xMETRICVoter.proposalCount();
			xMETRICSupply.set((await xMETRIC.totalSupply())?.toBigInt() ?? 0n);
			const props: Proposal[] = [];

			for (let i = peakId; i > 0; i--) {
				const prop = await xMETRICVoter.Proposals(i);
				props.push({
					proposalId: i,
					contentHash: prop.contentHash,
					submitter: prop.submitter,
					deadline: new Date(prop.deadline.mul(1000).toNumber()),
					status: prop.status,
					metadata: await getProposalMetadata(i),
					yesVotes: await xMETRICVoter.getProposalVotes(i, VoteType.Yes),
					noVotes: await xMETRICVoter.getProposalVotes(i, VoteType.No)
				});
			}

			proposals.set(props);
			loadError.set(false);
		} catch (error) {
			console.log(error);
			loadError.set(true);
		}
	}

	function openVoteModal(proposal: Proposal) {
		voteModalProposal.set(proposal);
		voteModalOpen.set(true);
	}
</script>

{#if $chainId != SUPPORTED_CHAIN_ID}
	<p>Unsupported Chain</p>
	<p>CONNECT TO POLYGON</p>
	<p>Currently connected to {$chainId}</p>
{:else}
	<ProposeModal on:close={() => proposeModalOpen.set(false)} open={$proposeModalOpen} />
	<VoteModal
		proposal={$voteModalProposal}
		on:close={() => voteModalOpen.set(false)}
		open={$voteModalOpen}
	/>

	<div class="filter" class:blur-md={$anyModalOpen} class:pointer-events-none={$anyModalOpen}>
		<h1 class="font-bold text-2xl">Proposals</h1>

		{#if $proposals == null}
			{#if $loadError}
				<p>Loading failed...</p>
			{:else}
				<p>Loading</p>
			{/if}
		{:else}
			<div class="flex flex-col gap-3 mt-3">
				<button
					disabled={$xMETRICVoter == null}
					class="bg-blue-900 px-4 py-2 rounded-lg border-2 border-blue-700"
					on:click={() => proposeModalOpen.set(true)}>Propose</button
				>

				<p>Total of {$proposals.length} Proposals</p>

				<ul class="grid grid-cols-1 lg:grid-cols-2 gap-2">
					{#each $proposals as proposal}
						<li>
							<ProposalCard
								on:open-vote-modal={() => openVoteModal(proposal)}
								{proposal}
								maximumVotes={$xMETRICSupply}
							/>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
{/if}

<style>
</style>
