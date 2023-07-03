<script lang="ts">
	import minesweeper from '../classes/minesweeper';
	import { Bomb, Flag } from 'lucide-svelte';

	let generatedGame = false;
	let game = new minesweeper();

	function handleGeneration(positionToSkip: number[]) {
		game.generateFullBoard(positionToSkip);
		generatedGame = true;
	}

	function handleReveal(pos: number[]) {
		const reveal = game.reveal(pos);
		const isSweeped = game.isSweeped();
		console.log(isSweeped);
		// TODO: Handle game over/win state
		game = game;
	}

	function handleFlagPlace(pos: number[]) {
		game.placeFlag(pos);
		game = game;
	}
</script>

<div class="h-screen flex justify-center items-center">
	<div class="grid grid-cols-10 grid-rows-10 p-5 flex-1 max-w-5xl">
		{#if !generatedGame}
			{#each game.board.flat() as cell}
				<button class="cell btn-icon variant-filled" on:click={() => handleGeneration(cell.pos)} />
			{/each}
		{:else}
			{#each game.board.flat() as cell}
				{#if cell.revealed === true && cell.bomb === true}
					<div class="cell"><Bomb fill="white" /></div>
				{:else if cell.revealed === true && cell.number > 0}
					<div class="cell">{cell.number}</div>
				{:else if cell.revealed === true && cell.bomb === false && cell.number === 0}
					<div class="cell" />
				{:else if cell.flag === true}
					<button class="cell" on:contextmenu|preventDefault={() => handleFlagPlace(cell.pos)}
						><Flag fill="white" /></button
					>
				{:else}
					<button
						type="button"
						class="cell btn-icon variant-filled"
						on:contextmenu|preventDefault={() => handleFlagPlace(cell.pos)}
						on:click={() => handleReveal(cell.pos)}
					/>
				{/if}
				<!-- {#if !cell.revealed}
					<button class="cell">{cell.bomb}</button>
				{:else}
					<button class="cell">{cell.bomb}</button>
				{/if} -->
			{/each}
		{/if}
	</div>
</div>
