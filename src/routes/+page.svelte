<script lang="ts">
	import minesweeper from '../classes/minesweeper';
	import { Bomb, Flag } from 'lucide-svelte';
	import GameOver from './GameOver.svelte';
	import Settings from './Settings.svelte';

	let generatedGame = false;
	let gameOver = false;
	let gameWin = false;
	// Change on slide input
	let boardSize = 15;
	let bombChance = 0.25;
	let game = new minesweeper(boardSize, bombChance);

	$: {
		// TODO: Figure out how to only run these when boardSize or bombChance changes.
		// boardSize, bombChance && handleRestart
		game = new minesweeper(boardSize, bombChance);
		generatedGame = false;
	}

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
		game = new minesweeper(boardSize, bombChance);
		generatedGame = false;
		gameOver = false;
		gameWin = false;
	}

	// function updateGameParams(size: number, chance: number) {
	// 	boardSize = size;
	// 	bombChance = chance;
	// }
</script>

<div class="h-screen flex justify-center items-center p-5 gap-5">
	<div
		style={`grid-template-columns: repeat(${boardSize}, minmax(0, 1fr)); grid-template-rows: repeat(${boardSize}, minmax(0, 1fr))`}
		class="grid flex-1 max-w-5xl relative"
	>
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
