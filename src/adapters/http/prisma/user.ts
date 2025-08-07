import { userEntity } from "../../../core/entity/user";
import { UserRepositoryPort } from "../../../core/ports/userRepositiryPort";
import { prisma } from "../../database/data-source";

export class UserPrismaORM implements UserRepositoryPort {
    async create (user: userEntity, passwordHashed: string): Promise<userEntity> {
        const result = await prisma.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
                password: passwordHashed,
                roleId: Number(user.roleId),
            }
        });

        const createdUser: userEntity = {
            id: result.id,
            firstName: result.firstName ? result.firstName : 'no data',
            lastName: result.lastName ? result.lastName : 'no data',
            email: result.email ? result.email : 'no data',
            username: result.username ? result.username : 'no data',
            password: result.password ? result.password : 'no data',
            roleId: result.roleId,
            created_at: result.created_at,
            updated_at: result.updated_at
        }

        return createdUser;
    }

    async findAll(): Promise<userEntity[]> {
        const result = await prisma.user.findMany({});

        const mapData: userEntity[] = result.map((data) => ({
            id: data.id,
            firstName: data.firstName ? data.firstName : 'no data',
            lastName: data.lastName ? data.lastName : 'no data',
            email: data.email ? data.email : 'no data',
            username: data.username ? data.username : 'no data',
            password: data.password ? data.password : 'no data',
            roleId: data.roleId,
            created_at: data.created_at,
            updated_at: data.updated_at
        }));

        return mapData;
    }

    async findByID(id: string): Promise<userEntity | null> {
        const result = await prisma.user.findFirst({
            where: {
                id: Number(id)
            }
        });
        
        if (!result) return null;

        const user: userEntity = {
            id: result?.id,
            firstName: result.firstName ? result.firstName : 'no data',
            lastName: result.lastName ? result.lastName : 'no data',
            email: result.email ? result.email : 'no data',
            username: result.username ? result.username : 'no data',
            password: result.password ? result.password : 'no data',
            roleId: result.roleId,
            created_at: result.created_at,
            updated_at: result.updated_at
        }

        return user;
    }
}