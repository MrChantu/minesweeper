<script lang="ts">
	import { RotateCcw, Trophy, Skull } from 'lucide-svelte';
	export let gameOver: boolean;
	export let gameWin: boolean;
	export let handleRestart: () => void;
</script>

<aside
	class="alert variant-filled-surface absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
>
	<!-- Icon -->
	{#if gameOver}
		<div>
			<Skull />
		</div>
	{:else}
		<div>
			<Trophy />
		</div>
	{/if}
	<!-- Message -->
	<div class="alert-message">
		{#if gameOver}
			<h3 class="h3">YOU DETONATED A MINE</h3>
		{:else if gameWin}
			<h3 class="h3">YOU SWEEPED THE BOARD</h3>
		{/if}
	</div>
	<!-- Actions -->
	<div class="alert-actions">
		<button type="button" class="btn variant-filled" on:click={handleRestart}>
			<span><RotateCcw /></span>
			<span>Restart</span>
		</button>
	</div>
</aside>
