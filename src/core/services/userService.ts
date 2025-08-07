import { UserRepositoryPort } from "../ports/userRepositiryPort";
import { userEntity } from "../entity/user";

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
}