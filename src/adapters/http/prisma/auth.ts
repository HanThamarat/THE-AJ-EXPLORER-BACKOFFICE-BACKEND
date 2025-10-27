import { authEntity, customerEntity, googleProfileDTO, userCredentialDTO } from "../../../core/entity/auth";
import { AuthRepositoryPort } from "../../../core/ports/authRepositoryPort";
import { prisma } from "../../database/data-source";
import { Ecrypt } from "../../helpers/encrypt";

export class AuthPrismaORM implements AuthRepositoryPort {
    async authenticate(auth: authEntity): Promise<authEntity> {
        return auth;
    }

    async findOrCreateUserByGoogle(profile: googleProfileDTO): Promise<customerEntity> {
        let account = await prisma.account.findUnique({
            where: {
                provider_providerAccountId: {
                    provider: 'google',
                    providerAccountId: profile.googleId
                }
            },
            include: {
                user: true
            }
        });

        if (account) return account.user as customerEntity;

        let user = await prisma.user.findUnique({
            where: {
                email: profile.email
            }
        });

        if (user) {
            await prisma.account.create({
                data: {
                    userId: user.id,
                    type: 'oauth',
                    provider: 'google',
                    providerAccountId: profile.googleId,
                }
            });

            user = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    image: user.image ?? profile.images,
                    emailVerified: user.emailVerified ?? new Date(),
                }
            });

            return user as customerEntity;
        }

        const newUser = await prisma.user.create({
            data: {
                email: profile.email,
                name: profile.name,
                image: profile.images,
                emailVerified: new Date()
            }
        });

        await prisma.account.create({
            data: {
                userId: newUser.id,
                type: 'oauth',
                provider: 'google',
                providerAccountId: profile.googleId
            }
        });

        return newUser;
    }

    async createUserWithPassword(userDTO: userCredentialDTO): Promise<customerEntity> {
        const existingUser = await prisma.user.findUnique({
            where: {
                email: userDTO.email
            }
        });

        if (existingUser) throw new Error("User already exists");

        const user = await prisma.user.create({
            data: {
                email: userDTO.email,
                name: userDTO.name,
                password: userDTO.email,
                emailVerified: null
            }
        });

        if (!user) throw new Error("Have somethong problem in creating user progress");

       return user;
    }

    async validateUserPassword(userDTO: userCredentialDTO): Promise<customerEntity | null> {
        const user = await prisma.user.findUnique({
            where: { email: userDTO.email },
        });

        if (!user || !user.password) {
            return null;
        }

        const isMatch = await Ecrypt.passwordDecrypt(userDTO.passsword, user.password);
        if (!isMatch) {
            return null;
        }

        return user;
    }
}