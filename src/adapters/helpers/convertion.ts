import fs from "fs";

export class Convertion {
    static async Decodebase64(base64String: string) {
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid base64 string");

        const fileBuffer = Buffer.from(matches[2], "base64");

        return fileBuffer;
    }

    static async FileToBase64WithPath(path: string) {
        return fs.readFileSync(path, { encoding: "base64" });
    }
}