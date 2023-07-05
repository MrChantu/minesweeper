<script lang="ts">
	import minesweeper from '../classes/minesweeper';
	import { Bomb, Flag } from 'lucide-svelte';
	import GameOver from './GameOver.svelte';

	let generatedGame = false;
	let game = new minesweeper();
	let gameOver = false;
	let gameWin = false;

	function handleGeneration(positionToSkip: number[]) {
		game.generateFullBoard(positionToSkip);
		generatedGame = true;
	}

	function handleReveal(pos: number[]) {
		// Will return "bomb" if user clicked a square with a bomb
		const reveal = game.reveal(pos);
		// Check if board is sweeped on every click.
		const isSweeped = game.isSweeped();

		handleGameOver(reveal, isSweeped);
		// Trigger rerender
		game = game;
	}

	function handleFlagPlace(pos: number[]) {
		game.placeFlag(pos);
		// Trigger rerender
		game = game;
	}

	function handleGameOver(reveal: undefined | string, isSweeped: boolean) {
		if (isSweeped) {
			gameWin = true;
		}
		if (reveal === 'bomb') {
			gameOver = true;
		}
	}

	function handleRestart() {
		game = new minesweeper();
		generatedGame = false;
		gameOver = false;
		gameWin = false;
	}
</script>

<div class="h-screen flex justify-center items-center">
	<div class="grid grid-cols-10 grid-rows-10 p-5 flex-1 max-w-5xl relative">
		{#if !generatedGame}
			<!-- Let user first click a cell to be omitted from bomb generation -->
			{#each game.board.flat() as cell}
				<button
					type="button"
					class="cell btn-icon variant-filled"
					on:click={() => handleGeneration(cell.pos)}
				/>
			{/each}
		{:else if gameOver || gameWin}
			<!-- If game is over/won, render cells without event listeners -->
			{#each game.board.flat() as cell}
				{#if cell.revealed === true && cell.bomb === true}
					<div class="cell bg-red-600"><Bomb fill="white" /></div>
				{:else if cell.revealed === true && cell.number > 0}
					<div class="cell">{cell.number}</div>
				{:else if cell.revealed === true && cell.bomb === false && cell.number === 0}
					<div class="cell" />
				{:else if cell.flag === true}
					<button type="button" class="cell variant-filled">
						<span><Flag fill="black" /></span>
					</button>
				{:else}
					<button type="button" class="cell btn-icon variant-filled" />
				{/if}
			{/each}
		{:else}
			<!-- After board generation, render the board with bombs and event listeners -->
			{#each game.board.flat() as cell}
				{#if cell.revealed === true && cell.bomb === true}
					<div class="cell bg-red-600"><Bomb fill="white" /></div>
				{:else if cell.revealed === true && cell.number > 0}
					<div class="cell">{cell.number}</div>
				{:else if cell.revealed === true && cell.bomb === false && cell.number === 0}
					<div class="cell" />
				{:else if cell.flag === true}
					<button
						type="button"
						class="cell variant-filled"
						on:contextmenu|preventDefault={() => handleFlagPlace(cell.pos)}
					>
						<span><Flag fill="black" /></span>
					</button>
				{:else}
					<button
						type="button"
						class="cell btn-icon variant-filled"
						on:contextmenu|preventDefault={() => handleFlagPlace(cell.pos)}
						on:click={() => handleReveal(cell.pos)}
					/>
				{/if}
			{/each}
		{/if}
		<!-- Render if game is over/won -->
		{#if gameOver || gameWin}
			<GameOver {gameOver} {gameWin} {handleRestart} />
		{/if}
	</div>
</div>
