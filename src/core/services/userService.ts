import { UserRepositoryPort } from "../ports/userRepositiryPort";
import { userEntity, userDTO } from "../entity/user";

export class UserService {
    constructor(private readonly userRepository: UserRepositoryPort) {}

    async createUser(user: userEntity, passwordHashed: string): Promise<userEntity> {
        return this.userRepository.create(user, passwordHashed);
    }

    async findAllUser(): Promise<userEntity[]> {
        return this.userRepository.findAll();
    }

    async findUserById(id: string): Promise<userEntity | null> {
        return this.userRepository.findByID(id);
    }

    async findByJWT(id: string): Promise<userEntity  | null> {
        return this.userRepository.findByJWT(id);
    }

    async update(id: string, userDTO: userDTO): Promise<userEntity | null> {
        return this.userRepository.update(id, userDTO);
    }

    async delete(id: string): Promise<userEntity | null> {
        return this.userRepository.delete(id);
    }
}