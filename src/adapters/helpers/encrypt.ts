import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const  JWT_SECRET : string = process.env.JWT_SECRET as string;

interface payload {
    id: string;
}

export class Ecrypt {
    static async passwordEncrypt(pass: string) {
        return bcrypt.hashSync(pass, 10);
    };

    static async passwordDecrypt(pass: string, hash: string) {
        return bcrypt.compareSync(pass, hash);
    }

    static async generateToken(payload: payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
    }
}