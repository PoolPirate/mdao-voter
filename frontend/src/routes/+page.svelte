<script lang="ts">
	import { signerAddress } from 'svelte-ethers-store';
	import { useXMetric } from '$lib/contracts';

	const XMetric = useXMetric();
</script>

{#if $XMetric != null}
	{#await $XMetric.balanceOf($signerAddress)}
		<p>Loading Balance</p>
	{:then balance}
		<p>Balance {BigInt(balance.toString()) / 10n ** 18n} xMETRIC</p>
	{/await}
{:else}
	<p>No Wallet Connected</p>
{/if}
