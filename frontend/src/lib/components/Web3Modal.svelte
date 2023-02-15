<script lang="ts">
	import { defaultEvmStores as evm } from 'svelte-ethers-store';
	import { connected } from 'svelte-ethers-store';

	function triggerDisconnect() {
		evm.disconnect();
	}
	function triggerConnect() {
		evm.setProvider();
	}
</script>

<div class="bg-white p-2 rounded-md">
	{#if $connected}
		<button on:click={triggerDisconnect}>Disconnnect Wallet</button>
	{:else}
		<button on:click={triggerConnect}>Connect Wallet</button>
	{/if}
</div>
