import { getLines } from "@util/file";
import Logs from "@util/logs";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const INPUT_FILE = "./data/input.txt";

type Direction = "up" | "down" | "forward";
type Magnitude = number;
type Vector = [Direction, Magnitude];

const star1 = (lines: readonly string[]): number => {
    let depthPosition = 0;
    let horizontalPosition = 0;

    for (const entry of lines) {
        const [direction, magnitudeString]: Vector = entry.split(" ") as Vector;
        const magnitude = Number(magnitudeString);

        if (isNaN(magnitude)) {
            throw new Error(
                "Invalid measurement " + magnitude + " " + magnitudeString
            );
        }

        switch (direction) {
            case "forward":
                horizontalPosition += magnitude;
                break;
            case "up":
                depthPosition -= magnitude;
                break;
            case "down":
                depthPosition += magnitude;
                break;
            default:
                throw new Error("Unexpected direction: " + direction);
        }
    }

    // Logs.Debug(`Depth Position: ${depthPosition}`);
    // Logs.Debug(`Horizontal Position: ${horizontalPosition}`);
    return horizontalPosition * depthPosition;
};

const star2 = (lines: readonly string[]): number => {
    let depthPosition = 0;
    let horizontalPosition = 0;
    let aimPosition = 0;

    for (const entry of lines) {
        const [direction, magnitudeString]: Vector = entry.split(" ") as Vector;
        const magnitude = Number(magnitudeString);

        if (isNaN(magnitude)) {
            throw new Error(
                "Invalid measurement " + magnitude + " " + magnitudeString
            );
        }

        switch (direction) {
            case "forward":
                horizontalPosition += magnitude;

                if (aimPosition !== 0) {
                    depthPosition += magnitude * aimPosition;
                }
                break;
            case "up":
                aimPosition -= magnitude;
                break;
            case "down":
                aimPosition += magnitude;
                break;
            default:
                throw new Error("Unexpected direction: " + direction);
        }
    }

    // Logs.Debug(`Depth Position: ${depthPosition}`);
    // Logs.Debug(`Aim Position: ${aimPosition}`);
    // Logs.Debug(`Horizontal Position: ${horizontalPosition}`);
    return horizontalPosition * depthPosition;
};

(async () => {
    Logs.configureLogs(false);

    const lines = await getLines(INPUT_FILE);
    try {
        const result = star1(lines);
        Logs.Result(`First Product: ${result}`);
    } catch (e) {
        const { message } = e as Error;
        Logs.Error(message);
    }

    try {
        const result = star2(lines);
        Logs.Result(`Second Product: ${result}`);
    } catch (e) {
        const { message } = e as Error;
        Logs.Error(message);
    }
})();
