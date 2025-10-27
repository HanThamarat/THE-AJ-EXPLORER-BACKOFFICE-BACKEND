import { Prisma } from "@prisma/client";
import { userEntity } from "./user";

export interface authEntity {
    userInfo: userEntity,
    authToken: string,
}

export interface authUserEntity {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password?: string;
    picture: string | null;
    picturePath: string | null;
    status: boolean;
    roleId: number;
    created_at: string; // or Date if you parse it
    updated_at: string; // or Date if you parse it
    iat: number; // issued at (JWT)
    exp: number; // expiration time (JWT)
}

export interface googleProfileDTO {
    email:          string;
    name:           string;
    images?:        string;
    googleId:       string;
}

export interface userCredentialDTO {
    email:          string;
    name?:          string;
    passsword:      string;
}

export type customerEntity = Prisma.UserGetPayload<{}>