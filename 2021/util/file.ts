import fs from "fs";
import readline from "readline";

export async function getLines(
    filePath: string
): Promise<ReadonlyArray<string>> {
    if (!fs.lstatSync(filePath).isFile()) {
        throw new Error("Path is not a regular file");
    }

    const fileStream = fs.createReadStream(filePath);

    const reader = readline.createInterface({
        input: fileStream,
        // Note: we use the crlfDelay option to recognize all instances of CR LF
        // ('\r\n') in input.txt as a single line break
        crlfDelay: Infinity,
    });

    const data: string[] = [];

    for await (const line of reader) {
        data.push(line);
    }

    return data;
}
