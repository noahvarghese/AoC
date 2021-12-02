import { getLines } from "@util/file";
import Logs from "@util/logs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const INPUT_FILE = "./data/input.txt";

const star1 = (depths: readonly number[]): number => {
    let counter = 0;

    if (depths.length < 2) {
        return counter;
    }

    for (let i = 1; i < depths.length; i++) {
        const previousDepth = depths[i - 1];
        const currentDepth = depths[i];

        if (currentDepth > previousDepth) {
            counter++;
        }
    }

    return counter;
};

const star2 = (depths: readonly number[]): number => {
    let counter = 0;

    if (depths.length < 4) {
        return counter;
    }

    if (depths.length === 4) {
        return 1;
    }

    for (let i = 3; i < depths.length; i++) {
        const previousDepth = depths[i - 3] + depths[i - 2] + depths[i - 1];
        const currentDepth = depths[i - 2] + depths[i - 1] + depths[i];

        if (currentDepth > previousDepth) {
            counter++;
        }
    }

    return counter;
};

(async () => {
    Logs.configureLogs(false);

    const reading = await getLines(INPUT_FILE);

    const depths = reading.map((d) => {
        if (isNaN(Number(d))) throw new Error("Number not found");
        return Number(d);
    });

    const firstStarResult = star1(depths);
    const secondStarResult = star2(depths);

    Logs.Result(`First result: ${firstStarResult}`);
    Logs.Result(`Second result: ${secondStarResult}`);
})();
