<script lang="ts">
	import '../app.css';
	import MDAO from '$lib/static/mdao.png';
	import Web3Modal from '$lib/components/Web3Modal.svelte';
</script>

<div class="flex flex-col h-screen">
	<nav class="bg-gray-600 w-screen h-14 flex items-center px-2 justify-between">
		<img class="h-4/5" src={MDAO} alt="" />

		<a href="/">Home</a>
		<a href="/dao">DAO</a>

		<Web3Modal />
	</nav>

	<main class="relative p-5 bg-gray-200 h-full overflow-auto">
		<slot />
	</main>
</div>
