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
    let oxygen = NaN,
        co2 = NaN;

    const arrayLength = lines[0].length;
    const frequency = new Array<number>(arrayLength);
    const matcher = new Array<number>(arrayLength);

    for (let i = 0; i < arrayLength; i++) {
        frequency[i] = 0;
        matcher[i] = NaN;
    }

    for (let i = 0; i < arrayLength; i++) {
        for (const line of lines) {
            // checks that the line is a match
            const isMatch = line.startsWith(
                matcher.filter((b) => !isNaN(b)).join("")
            );
            if (i === 0 || (!isNaN(matcher[i - 1]) && isMatch)) {
                // gets the frequency of the 1s
                if (line[i] === "1") {
                    frequency[i]++;
                }
            }
        }
        // determines wheter matcher[i] should be a 0 or 1
        frequency[i] = frequency[i] >= lines.length / 2 ? 1 : 0;
        matcher[i] = frequency[i];
    }

    for (let i = 0; i < arrayLength; i++) {}

    oxygen = parseInt(matcher.join(""), 2);
    co2 = parseInt(frequency.map((b) => (b === 1 ? 0 : 1)).join(""), 2);

    Logs.Debug(`Oxygen Rating: ${oxygen}`);
    Logs.Debug(`CO2 Scrubber Rating: ${co2}`);

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
