import { userEntity, userDTO } from "../entity/user";

export interface UserRepositoryPort {
    create(user: userEntity, passwordHashed: string): Promise<userEntity>;
    findAll(): Promise<userEntity[]>;
    findByID(id: string): Promise<userEntity | null>;
    findByJWT(id: string): Promise<userEntity | null>;
    update(id: string, userDto: userDTO): Promise<userEntity | null>;
    delete(id: string): Promise<userEntity | null>;
}