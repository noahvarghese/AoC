import fs from "fs";
import readline from "readline";

export async function getLines<T>(
    filePath: string,
    converter: (val: string) => T,
    validator?: (val: string) => boolean
): Promise<ReadonlyArray<T>> {
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

    const data: T[] = [];

    for await (const line of reader) {
        if (!validator || validator(line)) {
            data.push(converter(line));
        }
    }

    return data;
}
