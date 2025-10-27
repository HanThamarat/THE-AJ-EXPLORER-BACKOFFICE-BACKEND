import { AuthRepositoryPort } from "../ports/authRepositoryPort";
import { authEntity, customerEntity, googleProfileDTO, userCredentialDTO } from "../entity/auth";

export class AuthService {
    constructor(private readonly authRepository: AuthRepositoryPort) {}

    authenticate(auth: authEntity): Promise<authEntity> {
        return this.authRepository.authenticate(auth);
    }

    findOrCreateUserByGoogle(profile: googleProfileDTO): Promise<customerEntity> {
        return this.authRepository.findOrCreateUserByGoogle(profile);
    }

    createUserWithPassword(userDTO: userCredentialDTO): Promise<customerEntity> {
        return this.authRepository.createUserWithPassword(userDTO);
    }

    validateUserPassword(userDTO: userCredentialDTO): Promise<customerEntity | null> {
        return this.authRepository.validateUserPassword(userDTO);
    }
}