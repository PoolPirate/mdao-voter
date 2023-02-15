<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { submitProposalMetadata } from '$lib/proposalclient';
	import { useXMetricVoter } from '$lib/contracts';
	import { concat, keccak256, toUtf8Bytes } from 'ethers/lib/utils';

	export let open: boolean;

	const XMetricVoter = useXMetricVoter();

	var title: string;
	var description: string;

	const dispatch = createEventDispatcher();

	async function submit() {
		const contentHash = keccak256(concat([toUtf8Bytes(title), toUtf8Bytes(description)]));
		await $XMetricVoter!.submitProposal(contentHash);

		const proposalId = await $XMetricVoter!.proposalCount();

		await submitProposalMetadata({
			contentHash: contentHash,
			title: title,
			description: description,
			proposalId: proposalId
		});

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
		class="w-1/2 bg-blue-200 p-6 grid grid-cols-1 gap-2 z-20 rounded-lg"
		on:click={(e) => {
			e.stopPropagation();
		}}
		on:keydown={(e) => {
			e.stopPropagation();
		}}
	>
		<h1 class="font-bold text-4xl text-center">Create A Proposal</h1>

		<h2 class="font-bold text-lg">Title</h2>
		<input class="p-2" placeholder="Very important decision" bind:value={title} />

		<h2 class="font-bold text-lg">Description</h2>
		<textarea
			class="p-2 h-32"
			placeholder="Have GJ sing on the next community call"
			bind:value={description}
		/>

		<div class="grid grid-cols-2 gap-4 mt-4">
			<button
				class="font-bold bg-red-400 border px-4 py-2"
				on:click={() => dispatch('close')}
				on:keydown={() => dispatch('close')}>Cancel</button
			>
			<button class="font-bold bg-green-400 border px-4 py-2" on:click={submit} on:keydown={submit}
				>Submit</button
			>
		</div>
	</div>
</div>
