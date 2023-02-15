<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { useXMetricVoter } from '$lib/contracts';
	import { VoteType, type Proposal } from '$lib/models';
	import { writable } from 'svelte/store';

	export let open: boolean;

	const XMetricVoter = useXMetricVoter();

	export let proposal: Proposal | null;

	let selectedVote = writable<VoteType>(VoteType.None);

	const dispatch = createEventDispatcher();

	async function submit() {
		if (proposal == null || $selectedVote == VoteType.None) {
			return;
		}

		await $XMetricVoter?.submitVote(proposal.proposalId, $selectedVote);
		dispatch('close');
	}
</script>

<div
	class="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center z-10"
	class:hidden={!open}
	on:click={() => dispatch('close')}
	on:keydown={() => dispatch('close')}
>
	<div
		class="w-1/2 bg-neutral-600 p-6 grid grid-cols-1 gap-2 z-20 rounded-lg"
		on:click={(e) => {
			e.stopPropagation();
		}}
		on:keydown={(e) => {
			e.stopPropagation();
		}}
	>
		<h2 class="font-bold text-xl">{proposal?.metadata?.title ?? 'Cast your vote'}</h2>

		<div class="flex flex-col gap-2 p-2">
			<button
				class="p-2 border"
				class:bg-green-400={$selectedVote == VoteType.Yes}
				class:bg-green-900={$selectedVote != VoteType.Yes}
				on:click={() => selectedVote.set(VoteType.Yes)}>Yes</button
			>
			<button
				class="p-2 border "
				class:bg-red-400={$selectedVote == VoteType.No}
				class:bg-red-900={$selectedVote != VoteType.No}
				on:click={() => selectedVote.set(VoteType.No)}>No</button
			>
		</div>

		<button class="p-2 mt-5 rounded-lg border bg-neutral-800" on:click={submit}>Submit</button>
	</div>
</div>
