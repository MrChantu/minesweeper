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
	bombChance: number;
	board: Array<cell[]>;

	constructor(size: number, bombChance: number) {
		this.size = size;
		this.bombChance = bombChance;
		this.board = this.generateEmptyBoard(size);
	}

	generateEmptyBoard(size: number) {
		const arr = [];
		for (let i = 0; i < size; i++) {
			const col = [];
			for (let j = 0; j < size; j++) {
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
			if (this.checkIfPosValid(neighbor)) {
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
		const [skipRow, skipCol] = positionToSkip;
		const arr = [];
		for (let i = 0; i < this.size; i++) {
			const col = [];
			for (let j = 0; j < this.size; j++) {
				// Make sure bomb does not spawn where user clicked
				if (i === skipRow && j === skipCol) {
					col.push({
						pos: [i, j],
						bomb: false,
						flag: false,
						revealed: false,
						number: 0
					});
				} else {
					const randomNum = Math.random();
					col.push({
						pos: [i, j],
						// bombChance 0.0 - 1.0 (1.0 is 100% bombs)
						bomb: randomNum <= this.bombChance,
						flag: false,
						revealed: false,
						number: 0
					});
				}
			}
			arr.push(col);
		}
		this.board = arr;

		// Uncover some neighbors next to the positionToSkip (make them not bombs)
		const neighbors = this.getNeighbors(positionToSkip);

		for (const neighbor of neighbors) {
			const [row, col] = neighbor;
			this.board[row][col].bomb = false;
		}
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

	checkIfPosValid(pos: number[]) {
		if (pos[0] >= 0 && pos[0] < this.size && pos[1] >= 0 && pos[1] < this.size) {
			return true;
		}
		return false;
	}
}
