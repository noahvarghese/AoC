import deepClone from "@util/clone";
import { getLines } from "@util/file";
import Logs from "@util/logs";

// const INPUT_FILE = "./data/input.txt";
const INPUT_FILE = "./data/example.txt";

type Grid = number[][];
type Coordinate = [number, number];
type Vector = [Coordinate, Coordinate];
type TwoDimensions = { length: number; width: number };

const getVectors = (lines: readonly string[]): Vector[] =>
    lines.map((l) =>
        l
            .trim()
            .split(" -> ")
            .reduce((prev, curr) => {
                prev.push(
                    curr
                        .trim()
                        .split(",")
                        .map((c) => Number(c)) as Coordinate
                );
                return prev;
            }, [] as unknown as Vector)
    );

const getDimensions = (vectors: Vector[]): TwoDimensions => {
    const dimensions = { width: 0, length: 0 };

    vectors.forEach((v) => {
        if (v[0][0] > dimensions.width) dimensions.width = v[0][0];
        if (v[1][0] > dimensions.width) dimensions.width = v[1][0];
        if (v[0][1] > dimensions.length) dimensions.length = v[0][1];
        if (v[1][1] > dimensions.length) dimensions.length = v[1][1];
    });

    // Since it starts at 0 we need to increment
    dimensions.length++;
    dimensions.width++;

    return dimensions;
};

const star1 = (vectors: Vector[], grid: Grid): number => {
    vectors.forEach((v) => {
        // this means that they are perfectly horizontal or vertical
        // no diagonals
        const x1 = v[0][0],
            y1 = v[0][1],
            x2 = v[1][0],
            y2 = v[1][1];

        if (x1 === x2) {
            const min = y1 > y2 ? y2 : y1;
            const max = min === y1 ? y2 : y1;

            for (let i = min; i <= max; i++) {
                grid[i][x1] = grid[i][x1] + 1;
            }
        } else if (y1 === y2) {
            const min = x1 > x2 ? x2 : x1;
            const max = min === x1 ? x2 : x1;

            for (let i = min; i <= max; i++) {
                grid[y1][i] = grid[y1][i] + 1;
            }
        }
    });

    return grid.flat().filter((c) => c >= 2).length;
};

const star2 = (vectors: Vector[], grid: Grid): number => {
    vectors.forEach((v) => {
        // this means that they are perfectly horizontal or vertical
        // no diagonals
        const x1 = v[0][0],
            y1 = v[0][1],
            x2 = v[1][0],
            y2 = v[1][1];

        // if (x1 === x2) {
        //     const min = y1 > y2 ? y2 : y1;
        //     const max = min === y1 ? y2 : y1;

        //     for (let i = min; i <= max; i++) {
        //         grid[i][x1] = grid[i][x1] + 1;
        //     }
        // } else if (y1 === y2) {
        //     const min = x1 > x2 ? x2 : x1;
        //     const max = min === x1 ? x2 : x1;

        //     for (let i = min; i <= max; i++) {
        //         grid[y1][i] = grid[y1][i] + 1;
        //     }
        // } else
        if (Math.abs(x1 - x2) === Math.abs(y1 - y2)) {
            const startingPoint = x1 < x2 ? [x2, y2] : [x1, y1];
            const endingPoint = x1 < x2 ? [x1, y1] : [x2, y2];
            Logs.Debug(
                startingPoint[0],
                endingPoint[0],
                startingPoint[0] - endingPoint[0]
            );

            for (
                let i = 0;
                startingPoint[0] < endingPoint[0]
                    ? i < startingPoint[0] - endingPoint[0]
                    : i > startingPoint[0] - endingPoint[0];
                i++
            ) {
                Logs.Debug(i);
                for (
                    let j = 0;
                    startingPoint[1] > endingPoint[1]
                        ? j > startingPoint[1] - endingPoint[1]
                        : j < startingPoint[1] + endingPoint[1];
                    startingPoint[1] > endingPoint[1] ? j++ : j--
                ) {
                    if (i === j) {
                        Logs.Debug(i, j);
                        grid[startingPoint[i] + x1][
                            startingPoint[1] < endingPoint[1]
                                ? startingPoint[j] + y1
                                : y1 - startingPoint[j]
                        ]++;
                    }
                }
            }
            Logs.Debug(v);
        }
    });
    Logs.Debug(grid);

    return grid.flat().filter((c) => c >= 2).length;
};

(async () => {
    Logs.configureLogs(false);

    const lines = await getLines(INPUT_FILE);
    const vectors = getVectors(lines);
    const dimensions = getDimensions(vectors);
    const grid = Array.from({ length: dimensions.length }, () =>
        Array.from({ length: dimensions.width }, () => 0)
    );

    const result1 = star1(vectors, deepClone(grid));
    Logs.Result(result1);

    const result2 = star2(vectors, deepClone(grid));
    Logs.Result(result2);
})();
