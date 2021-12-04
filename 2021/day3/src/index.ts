import { getLines } from "@util/file";
import Logs from "@util/logs";

const INPUT_FILE = "./data/input.txt";

const star1 = (lines: readonly string[]): number => {
    // gamma rate is 8 bits
    // each bit is the most common bit in the column
    // epsilon rate uses the least common
    let gamma = NaN;
    let epsilon = NaN;

    const arrayLength = lines[0].length;
    const frequency = new Array<number>(arrayLength);

    for (let i = 0; i < arrayLength; i++) {
        frequency[i] = 0;
    }

    for (const line of lines) {
        for (let i = 0; i < line.length; i++) {
            if (line[i] === "1") frequency[i]++;
        }
    }

    for (let i = 0; i < arrayLength; i++) {
        frequency[i] = frequency[i] > lines.length / 2 ? 1 : 0;
    }

    gamma = parseInt(frequency.join(""), 2);
    epsilon = parseInt(frequency.map((b) => (b === 1 ? 0 : 1)).join(""), 2);

    // Logs.Debug(`Gamma: ${gamma}`);
    // Logs.Debug(`Epsilon: ${epsilon}`);

    return gamma * epsilon;
};

const star2 = (lines: readonly string[]): number => {
    function filterByCommonValueAtPosition(
        rows: number[],
        commonality: "1" | "0",
        position: number
    ): number {
        // filter
        const rows0: number[] = [];
        const rows1: number[] = [];

        Logs.Debug(rows.length);
        rows.map((r) => r.toString(2)).forEach((row) => {
            if (row[position] == "0") {
                rows0.push(parseInt(row, 2));
            }
            if (row[position] == "1") {
                rows1.push(parseInt(row));
            }
        });

        if (rows.length === 0) return NaN;
        else if (rows.length === 1) return rows[0];
        else {
            if (commonality === "1")
                return filterByCommonValueAtPosition(
                    rows1.length >= rows0.length ? rows1 : rows0,
                    commonality,
                    position + 1
                );
            else
                return filterByCommonValueAtPosition(
                    rows0.length <= rows1.length ? rows0 : rows1,
                    commonality,
                    position + 1
                );
        }
    }

    const bitArrays = lines.map((n) => parseInt(n, 2));

    const co2 = filterByCommonValueAtPosition(bitArrays, "0", 0);
    const oxygen = filterByCommonValueAtPosition(bitArrays, "1", 0);

    Logs.Debug(`Oxygen Rating: ${oxygen} ${oxygen.toString(2)}`);
    Logs.Debug(`CO2 Scrubber Rating: ${co2} ${co2.toString(2)}`);

    return oxygen * co2;
};

(async () => {
    Logs.configureLogs(false);

    const data = await getLines(INPUT_FILE);

    const power = star1(data);
    Logs.Result(`Power: ${power}`);

    const lifeSupportRating = star2(data);
    Logs.Result(`Life Support Rating: ${lifeSupportRating}`);
})();
