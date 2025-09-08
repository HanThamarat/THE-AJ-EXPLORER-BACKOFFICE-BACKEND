import { userDTO, userEntity } from "../../../core/entity/user";
import { UserRepositoryPort } from "../../../core/ports/userRepositiryPort";
import { prisma } from "../../database/data-source";
import { Ecrypt } from "../../helpers/encrypt";

export class UserPrismaORM implements UserRepositoryPort {
    async create (user: userEntity, passwordHashed: string): Promise<userEntity> {
        const result = await prisma.administrator.create({
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
        const result = await prisma.administrator.findMany({});

        const mapData: userEntity[] = result.map((data: any) => ({
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
        const result = await prisma.administrator.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                role: true
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
            role: {
                id: result.role.id,
                name: result.role.name,
            },
            created_at: result.created_at,
            updated_at: result.updated_at
        }

        return user;
    }

    async findByJWT(id: string): Promise<userEntity | null> {
        const result = await prisma.administrator.findFirst({
            where: {
                id: Number(id)
            },
            include: {
                role: true
            }
        });
        
        if (!result) return null;

        const user: userEntity = {
            id: result?.id,
            firstName: result.firstName ? result.firstName : 'no data',
            lastName: result.lastName ? result.lastName : 'no data',
            email: result.email ? result.email : 'no data',
            username: result.username ? result.username : 'no data',
            role: {
                id: result.role.id,
                name: result.role.name,
            },
            created_at: result.created_at,
            updated_at: result.updated_at
        }

        return user;
    }

    async update(id: string, userDto: userDTO): Promise<userEntity | null> {
        const reCheckUser = await prisma.administrator.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!reCheckUser) return null;

        if (userDto?.password !== "" || userDto?.password !== null) {
            if (userDto.currentPassword === null) return null; 
            const compareOldPassword = await Ecrypt.passwordDecrypt(userDto?.currentPassword as string, reCheckUser.password as string); 
            if (compareOldPassword === true) {
                const hashNewPassword = await Ecrypt.passwordEncrypt(userDto.password as string);
                await prisma.administrator.update({
                    where: {
                        id: Number(id)
                    },
                    data: {
                        password: hashNewPassword
                    }
                });
            }
        }

        const updateUser = await prisma.administrator.update({
            where: {
                id: Number(id)
            },
            data: {
                firstName: userDto?.firstName,
                lastName: userDto?.lastName,
                username: userDto?.username,
                email: userDto?.email,
                roleId: Number(userDto?.roleId),
            }
        });

        const user: userEntity = {
            id: updateUser?.id,
            firstName: updateUser.firstName ? updateUser.firstName : 'no data',
            lastName: updateUser.lastName ? updateUser.lastName : 'no data',
            email: updateUser.email ? updateUser.email : 'no data',
            username: updateUser.username ? updateUser.username : 'no data',
            password: updateUser.password ? updateUser.password : 'no data',
            roleId: updateUser.roleId,
            created_at: updateUser.created_at,
            updated_at: updateUser.updated_at
        }

        return user;
    }

    async delete(id: string): Promise<userEntity | null> {
        const reCheckUser = await prisma.administrator.findFirst({
            where: {
                id: Number(id),
            },
        });

        if (!reCheckUser) return null;

        const deletedUser = await prisma.administrator.delete({
            where: {
                id: Number(id)
            }
        });

        const user: userEntity = {
            id: deletedUser?.id,
            firstName: deletedUser.firstName ? deletedUser.firstName : 'no data',
            lastName: deletedUser.lastName ? deletedUser.lastName : 'no data',
            email: deletedUser.email ? deletedUser.email : 'no data',
            username: deletedUser.username ? deletedUser.username : 'no data',
            password: deletedUser.password ? deletedUser.password : 'no data',
            roleId: deletedUser.roleId,
            created_at: deletedUser.created_at,
            updated_at: deletedUser.updated_at
        }

        return user;
    }
}