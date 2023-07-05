interface cell {
	pos: number[];
	bomb: boolean;
	flag: boolean;
	revealed: boolean;
	number: number;
}

// prettier-ignore
const sides = [
    [0, 1], [1, 0], [1, 1], [0, -1], [-1, 0], [-1, -1], [1, -1], [-1, 1]
]

export default class minesweeper {
	size: number;
	board: Array<cell[]>;

	constructor() {
		this.size = 10;
		this.board = this.generateEmptyBoard();
	}

	generateEmptyBoard() {
		const arr = [];
		for (let i = 0; i < 10; i++) {
			const col = [];
			for (let j = 0; j < 10; j++) {
				col.push({
					pos: [i, j]
				});
			}
			arr.push(col);
		}
		return arr;
	}

	getNeighbors(pos: number[]) {
		const [posCol, posRow] = pos;
		const neighbors = [];
		for (const side of sides) {
			const [nCol, nRow] = side;
			const neighbor = [posCol + nCol, posRow + nRow];
			// Check if this neighbor is not out of bounds
			if (
				neighbor[0] >= 0 &&
				neighbor[0] < this.size &&
				neighbor[1] >= 0 &&
				neighbor[1] < this.size
			) {
				neighbors.push([posCol + nCol, posRow + nRow]);
			}
		}
		return neighbors;
	}

	generateFullBoard(positionToSkip: number[]) {
		this.generateBombs(positionToSkip);
		this.generateNumbers();
		this.reveal(positionToSkip);
	}

	generateBombs(positionToSkip: number[]) {
		// 20% chance
		const [skipRow, skipCol] = positionToSkip;
		const arr = [];
		for (let i = 0; i < this.size; i++) {
			const col = [];
			for (let j = 0; j < this.size; j++) {
				// Make sure bomb does not spawn where user clicked
				if (i === skipRow && j === skipCol) {
					// TODO: Change logic to only show numbered ones if not bomb, and add numbers to bomb squares.
					col.push({
						pos: [i, j],
						bomb: false,
						flag: false,
						revealed: false,
						number: 0
					});
				} else {
					const randomNum = Math.random();
					// If randonNum <= 0.2, it is true.
					col.push({
						pos: [i, j],
						bomb: randomNum <= 0.2,
						flag: false,
						revealed: false,
						number: 0
					});
				}
			}
			arr.push(col);
		}
		this.board = arr;
	}

	generateNumbers() {
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				// Only place numbers on non bomb squares.
				if (this.board[i][j].bomb === false) {
					const neighbors = this.getNeighbors([i, j]);
					for (const neighbor of neighbors) {
						const [nCol, nRow] = neighbor;
						// If this neighbor is a bomb add 1 to the original pos number.
						if (this.board[nCol][nRow].bomb === true) {
							this.board[i][j].number += 1;
						}
					}
				}
			}
		}
	}

	placeFlag(pos: number[]) {
		const [posCol, posRow] = pos;
		if (this.board[posCol][posRow].revealed === false) {
			this.board[posCol][posRow].flag = !this.board[posCol][posRow].flag;
		}
	}
	// Will recursively keep revealing neighbors until it finds a neighbor that is a number next to a bomb.
	// Depth will be for stopping to many neighbors from revealing.
	reveal(pos: number[], depth = 0) {
		const [posCol, posRow] = pos;

		if (this.board[posCol][posRow].revealed === false && this.board[posCol][posRow].number > 0) {
			this.board[posCol][posRow].revealed = true;
			return;
		} else if (
			this.board[posCol][posRow].revealed === false &&
			this.board[posCol][posRow].number === 0 &&
			this.board[posCol][posRow].revealed === false &&
			this.board[posCol][posRow].bomb === false
		) {
			this.board[posCol][posRow].revealed = true;
			const neighbors = this.getNeighbors([posCol, posRow]);
			for (const neighbor of neighbors) {
				const [nCol, nRow] = neighbor;
				this.reveal([nCol, nRow], depth + 1);
			}
		} else {
			this.board[posCol][posRow].revealed = true;
			return 'bomb';
		}
	}

	isSweeped() {
		// If the board contains a square that is not revealed, it is not sweeped.
		return this.board.flat().some((e) => !e.bomb && !e.revealed) ? false : true;
	}
}
