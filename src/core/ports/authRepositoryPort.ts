import { authEntity } from "../entity/auth";

export interface AuthRepositoryPort {
    authenticate(auth: authEntity): Promise<authEntity>;
}