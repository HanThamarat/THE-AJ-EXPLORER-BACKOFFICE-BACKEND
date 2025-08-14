import * as bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request } from 'express';
import { authUserEntity } from '../../core/entity/auth';

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

    static async JWTDecrypt(req: Request): Promise<authUserEntity | null> {
        try {
            const authHeader = req.headers['authorization'];
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return null;
            }

            const token = authHeader.split(' ')[1];
            if (!token) {
                return null;
            }

            const userData = jwt.verify(token, JWT_SECRET);
            
            return userData as authUserEntity;
        } catch (error) {
            console.error('Invalid Token:', error);
            return null;
        }
    }
}