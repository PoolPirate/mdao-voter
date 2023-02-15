<script lang="ts">
	import { SUPPORTED_CHAIN_ID, useXMetric, useXMetricVoter } from '$lib/contracts';
	import { chainId, signer } from 'svelte-ethers-store';
	import { getProposalMetadata } from '$lib/proposalclient';
	import { VoteType, type Proposal } from '$lib/models';
	import ProposalCard from './ProposalCard.svelte';
	import ProposeModal from './ProposeModal.svelte';
	import { writable } from 'svelte/store';
	import VoteModal from './VoteModal.svelte';
	import { ethers } from 'ethers';

	const xMETRIC = useXMetric();
	const xMETRICVoter = useXMetricVoter();

	const proposeModalOpen = writable<boolean>(false);
	const voteModalOpen = writable<boolean>(false);
	const voteModalProposal = writable<Proposal | null>(null);

	const xMETRICSupply = writable<bigint>(1n);

	$: anyModalOpen.set($proposeModalOpen || $voteModalOpen);
	const anyModalOpen = writable<boolean>(false);

	async function loadLatestProposals() {
		const peakId = await $xMETRICVoter!.proposalCount();

		xMETRICSupply.set((await $xMETRIC?.totalSupply())?.toBigInt() ?? 0n);

		const proposals: Proposal[] = [];

		for (let i = peakId; i > 0; i--) {
			const prop = await $xMETRICVoter!.Proposals(i);
			proposals.push({
				proposalId: i,
				contentHash: prop.contentHash,
				submitter: prop.submitter,
				deadline: new Date(prop.deadline.mul(1000).toNumber()),
				status: prop.status,
				metadata: await getProposalMetadata(i),
				yesVotes: await $xMETRICVoter!.getProposalVotes(i, VoteType.Yes),
				noVotes: await $xMETRICVoter!.getProposalVotes(i, VoteType.No)
			});
		}

		return { peakId, proposals };
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

		{#await loadLatestProposals()}
			<p>Loading</p>
		{:then result}
			<div class="flex flex-col gap-3 mt-3">
				<button
					disabled={$xMETRICVoter == null}
					class="bg-blue-900 px-4 py-2 rounded-lg border-2 border-blue-700"
					on:click={() => proposeModalOpen.set(true)}>Propose</button
				>

				<p>Total of {result?.peakId} Proposals</p>

				<ul class="grid grid-cols-1 lg:grid-cols-2 gap-2">
					{#each result.proposals as proposal}
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
		{:catch err}
			<p>There was an error loading</p>
		{/await}
	</div>
{/if}

<style>
</style>
