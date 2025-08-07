import { authEntity } from "../../../core/entity/auth";
import { AuthRepositoryPort } from "../../../core/ports/authRepositoryPort";

export class AuthPrismaORM implements AuthRepositoryPort {
    async authenticate(auth: authEntity): Promise<authEntity> {
        return auth;
    }
}