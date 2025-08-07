import { userEntity } from "../entity/user";

export interface UserRepositoryPort {
    create(user: userEntity, passwordHashed: string): Promise<userEntity>;
    findAll(): Promise<userEntity[]>;
    findByID(id: string): Promise<userEntity | null>;
}