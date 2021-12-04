import { getLines } from "@util/file";
import Logs from "@util/logs";

// const INPUT_FILE = "./data/example.txt";
const INPUT_FILE = "./data/input.txt";

class Cell {
    private _number: number;
    get number(): number {
        return this._number;
    }
    private _marked: boolean;

    constructor(number: number, called: boolean) {
        this._number = number;
        this._marked = called;
    }

    shouldMark(numberCalled: number) {
        return this._number === numberCalled;
    }

    mark() {
        this._marked = true;
    }

    isMarked() {
        return this._marked;
    }

    get [Symbol.toStringTag]() {
        return this._marked ? "X" : this._number.toString();
    }
}

class Puzzle {
    private _width: number;
    private _length: number;
    private _grid: Cell[][];
    private _won: boolean;

    get won(): boolean {
        return this._won;
    }

    constructor(bingo: string[], width = 5, length = 5) {
        this._grid = new Array(width);
        this._length = length;
        this._width = width;
        this._won = false;

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
                if (cell.shouldMark(number)) {
                    cell.mark();
                    this.checkHasWon();
                }
            }
        }
    }

    private checkHasWon(): void {
        const vertical = new Array(this._length).fill(true);

        for (let i = 0; i < this._length; i++) {
            let horizontal = true;

            for (let j = 0; j < this._width; j++) {
                const isMarked = this._grid[i][j].isMarked();

                vertical[j] = vertical[j] && isMarked;
                horizontal = horizontal && isMarked;
            }
            if (horizontal) {
                this._won = true;
                return;
            }
        }

        if (vertical.find((v) => v === true) === true) {
            this._won = true;
            return;
        }

        this._won = false;
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

    get [Symbol.toStringTag]() {
        let returnVal = "\n\n";
        for (const line of this._grid) {
            returnVal +=
                line.map((l) => (l.isMarked() ? "X" : l.number)).join(" ") +
                "\n";
        }
        returnVal += "\n\n";
        return returnVal;
    }
}

const loadBoards = (input: string[]): Puzzle[] => {
    const puzzles: Puzzle[] = [];
    let start = 0;

    for (let i = 0; i < input.length; i++) {
        if (input[i] === "" || i === input.length - 1) {
            puzzles.push(
                new Puzzle(
                    input.slice(start, i === input.length - 1 ? i + 1 : i)
                )
            );
            start = i + 1;
        }
    }
    return puzzles;
};

const star1 = (lines: readonly string[]) => {
    // first line is the numbers
    const numbersToDraw = lines[0].split(",").map((s) => Number(s));

    const puzzles = loadBoards(lines.slice(2));

    let score = 0;

    // for each turn
    for (let i = 0; i < numbersToDraw.length; i++) {
        // mark all boards
        for (const puzzle of puzzles) {
            puzzle.mark(numbersToDraw[i]);
            // check if puzzle has won
            if (puzzle.won) {
                score = puzzle.score() * numbersToDraw[i];
                break;
            }
        }
        if (score !== 0) {
            break;
        }
    }

    // calculate score
    return score;
};

const star2 = (lines: readonly string[]) => {
    // first line is the numbers
    const numbersToDraw = lines[0].split(",").map((s) => Number(s));
    const puzzles = loadBoards(lines.slice(2));

    let prevWinner: Puzzle | undefined;
    let notWon: Puzzle[] = puzzles;
    let prevNum = NaN;

    // for each turn
    for (let i = 0; i < numbersToDraw.length; i++) {
        const number = numbersToDraw[i];
        // mark all boards
        notWon.forEach((p) => {
            p.mark(number);
            notWon = notWon.filter((_p) => !_p.won);
            if (p.won) {
                prevWinner = p;
                prevNum = number;
            }
        });
    }
    return (prevWinner?.score() ?? 0) * prevNum;
};

(async () => {
    Logs.configureLogs(false);

    const lines = await getLines(INPUT_FILE);

    const score1 = star1(lines);
    Logs.Result(score1);

    const score2 = star2(lines);
    Logs.Result(score2);
})();
