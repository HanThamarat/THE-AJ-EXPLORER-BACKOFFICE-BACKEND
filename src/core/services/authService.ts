import { AuthRepositoryPort } from "../ports/authRepositoryPort";
import { authEntity } from "../entity/auth";

export class AuthService {
    constructor(private readonly authRepository: AuthRepositoryPort) {}

    authenticate(auth: authEntity): Promise<authEntity> {
        return this.authRepository.authenticate(auth);
    }
}