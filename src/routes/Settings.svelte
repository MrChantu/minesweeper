<script lang="ts">
	import { CheckCircle2 } from 'lucide-svelte';

	export let boardSize: number;
	export let bombChance: number;
	export let updateGameParams: (size: number, chance: number) => void;

	// $ for whenever board and bomb change again?
	$: inputBoardSize = boardSize;
	$: inputBombChance = bombChance;
</script>

<form
	class="card p-5 text-token space-y-4"
	on:submit|preventDefault={() => updateGameParams(inputBoardSize, inputBombChance)}
>
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim">BOARD SIZE</div>
		<input type="number" max="100" placeholder="Number" bind:value={inputBoardSize} />
	</div>
	<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
		<div class="input-group-shim">% BOMB</div>
		<input
			type="number"
			min="0"
			max="1"
			step="0.1"
			placeholder="Number"
			bind:value={inputBombChance}
		/>
	</div>
	<button type="submit" class="btn variant-filled">
		<span><CheckCircle2 /></span>
		<span>Apply</span>
	</button>
</form>
