import { authEntity, customerEntity, googleProfileDTO, userCredentialDTO } from "../entity/auth";

export interface AuthRepositoryPort {
    authenticate(auth: authEntity): Promise<authEntity>;
    findOrCreateUserByGoogle(profile: googleProfileDTO): Promise<customerEntity>;
    createUserWithPassword(userDTO: userCredentialDTO): Promise<customerEntity>;
    validateUserPassword(userDTO: userCredentialDTO): Promise<customerEntity | null>;
}