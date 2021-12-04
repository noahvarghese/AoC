import { getLines } from "@util/file";
import Logs from "@util/logs";

const INPUT_FILE = "./data/example.txt";
// const INPUT_FILE = "./data/input.txt";

class Cell {
    private _number: number;
    get number(): number {
        return this._number;
    }
    private _called: boolean;

    constructor(number: number, called: boolean) {
        this._number = number;
        this._called = called;
    }

    shouldMark(numberCalled: number) {
        return this._number === numberCalled;
    }

    mark() {
        this._called = true;
    }

    isMarked() {
        return this._called;
    }
}

class Puzzle {
    private _width: number;
    private _length: number;
    private _grid: Cell[][];

    constructor(bingo: string[], width = 5, length = 5) {
        this._grid = new Array(width);
        this._length = length;
        this._width = width;

        for (let i = 0; i < length; i++) {
            this._grid[i] = new Array(length);
        }

        this.loadGrid(bingo);
    }

    private loadGrid(bingo: string[]) {
        bingo.map((s, rowIndex) =>
            s
                .trim()
                .split(/ +/)
                .forEach((val, colIndex) => {
                    this._grid[rowIndex][colIndex] = new Cell(
                        Number(val),
                        false
                    );
                })
        );
    }

    mark(number: number) {
        for (let i = 0; i < this._length; i++) {
            for (let j = 0; j < this._width; j++) {
                // not sure if a number can repeat on a board
                const cell = this._grid[i][j];
                if (cell.shouldMark(number)) cell.mark();
            }
        }
    }

    hasWon(): boolean {
        for (let i = 0; i < this._length; i++) {
            for (let j = 0; j < this._width; j++) {
                // check horizontal
                // check vertical
                // check diagonal
            }
        }
        return false;
    }

    score(): number {
        let sum = 0;
        for (let i = 0; i < this._length; i++) {
            for (let j = 0; j < this._width; j++) {
                const cell = this._grid[i][j];
                if (!cell.isMarked()) {
                    sum += cell.number;
                }
            }
        }
        return sum;
    }
}

export const mark = (
    number: number,
    puzzles: { number: number; called: boolean }[][][]
) => {
    for (let i = 0; i < puzzles.length; i++) {
        for (let j = 0; j < puzzles[i].length; j++) {
            for (let k = 0; k < puzzles[i][j].length; k++) {
                if (puzzles[i][j][k].number === number) {
                    puzzles[i][j][k].called = true;
                }
            }
        }
    }
};

const star1 = (lines: readonly string[]) => {
    // first line is the numbers
    const numbersToDraw = lines[0].split(",").map((s) => Number(s));

    const puzzles: Puzzle[] = [];
    const boardContainer = lines.slice(2);

    let start = 0;

    for (let i = 0; i < boardContainer.length; i++) {
        if (boardContainer[i] === "" || i === boardContainer.length - 1) {
            puzzles.push(
                new Puzzle(
                    boardContainer.slice(
                        start,
                        i === boardContainer.length - 1 ? i + 1 : i
                    )
                )
            );
            start = i + 1;
        }
    }

    let score = 0;

    // for each turn
    for (let i = 0; i < numbersToDraw.length; i++) {
        // mark all boards
        for (const puzzle of puzzles) {
            puzzle.mark(numbersToDraw[i]);
            // check if puzzle has won
            if (puzzle.hasWon()) {
                // score * last number called
                score = puzzle.score() * numbersToDraw[i];
                break;
            }
        }
    }

    // calculate score
    return score;
};

(async () => {
    Logs.configureLogs(false);

    const lines = await getLines(INPUT_FILE);
    const result = star1(lines);
    Logs.Result(result);
})();
