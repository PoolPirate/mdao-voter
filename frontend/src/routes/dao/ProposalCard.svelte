<script lang="ts">
	import { useXMetricVoter } from '$lib/contracts';
	import { VoteType, type Proposal } from '$lib/models';
	import { createEventDispatcher } from 'svelte';
	import { signerAddress } from 'svelte-ethers-store';
	import { writable } from 'svelte/store';

	const xMETRICVoter = useXMetricVoter();

	export let proposal: Proposal;
	export let maximumVotes: bigint;

	const expanded = writable<boolean>(false);
	const dispatch = createEventDispatcher();

	function isOpen(proposal: Proposal) {
		return proposal.deadline.getTime() >= new Date().getTime();
	}
	function isAccepted(proposal: Proposal) {
		return proposal.status == 1 && proposal.deadline.getTime() < new Date().getTime();
	}
	function isRejected(proposal: Proposal) {
		return (
			(proposal.status == 2 || proposal.status == 0) &&
			proposal.deadline.getTime() < new Date().getTime()
		);
	}
</script>

<div
	on:click={() => expanded.update((val) => !val)}
	on:keydown={() => expanded.update((val) => !val)}
	class="border-1 border border-gray-500 bg-neutral-600 p-5 rounded-lg grid grid-cols-1 gap-3"
>
	<div class="flex justify-start items-center gap-4">
		<p
			class="py-1 px-6  rounded-md"
			class:bg-blue-400={isOpen(proposal)}
			class:bg-green-400={isAccepted(proposal)}
			class:bg-red-400={isRejected(proposal)}
		>
			{isOpen(proposal) ? 'Open' : ''}
			{isAccepted(proposal) ? 'Accepted' : ''}
			{isRejected(proposal) ? 'Rejected' : ''}
		</p>
		<h2 class="font-bold text-xl">
			#{proposal.proposalId}
			{proposal.metadata?.title ?? 'No Title Given'}
		</h2>
	</div>

	<div class="grid grid-cols-2">
		<div>
			<p>Voting Deadline</p>
			<p>{proposal.deadline.toLocaleString()}</p>
		</div>
		<div>
			<p>Current Outcome</p>
			<p
				class="font-bold"
				class:text-red-500={proposal.status != 1}
				class:text-green-700={proposal.status == 1}
			>
				{proposal.status == 1 ? 'Accept' : ''}
				{proposal.status != 1 ? 'Reject' : ''}
			</p>
		</div>
	</div>

	<div class="w-full border border-black rounded-md bg-blue-200 flex flex-row">
		<div style="width: {proposal.yesVotes.mul(100).div(maximumVotes)}%;" class="bg-green-700 h-2" />
		<div style="width: {proposal.noVotes.mul(100).div(maximumVotes)}%;" class="bg-red-500 h-2" />
	</div>

	{#if isOpen(proposal)}
		{#await $xMETRICVoter?.Votes(proposal.proposalId, $signerAddress)}
			<p>Loading</p>
		{:then vote}
			{#if vote?.voteType == VoteType.None}
				<button class="p-3  rounded-lg bg-gray-400" on:click={() => dispatch('open-vote-modal')}>
					Vote
				</button>
			{/if}
			{#if vote?.voteType == VoteType.Yes}
				<button class="p-3 rounded-lg bg-gray-400" on:click={() => dispatch('open-vote-modal')}>
					Update Vote (Current Vote: Yes)
				</button>
			{/if}
			{#if vote?.voteType == VoteType.No}
				<button class="p-3 rounded-lg bg-gray-400" on:click={() => dispatch('open-vote-modal')}>
					Update Vote (Current Vote: No)
				</button>
			{/if}
		{/await}
	{/if}

	<div class:hidden={!$expanded}>
		<h3 class="font-bold">Description</h3>
		<p>{proposal.metadata?.description ?? 'No Description Given'}</p>

		<h3 class="font-bold">Submitted By</h3>
		<p>{proposal.submitter}</p>
	</div>
</div>
