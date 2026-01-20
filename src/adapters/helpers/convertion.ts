import fs from "fs";
import mime from "mime-types";


export class Convertion {
    static async Decodebase64(base64String: string) {
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid base64 string");

        const fileBuffer = Buffer.from(matches[2], "base64");

        return fileBuffer;
    }

    static async FileToBase64WithPath(path: string) {
        const buffer = fs.readFileSync(path);
        const base64 = buffer.toString("base64");
        const mineType = mime.lookup(path) || "application/octet-stream";

        return `data:${mineType};base64,${base64}`;
    }
}