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
    password: string;
    picture: string | null;
    picturePath: string | null;
    status: boolean;
    roleId: number;
    created_at: string; // or Date if you parse it
    updated_at: string; // or Date if you parse it
    iat: number; // issued at (JWT)
    exp: number; // expiration time (JWT)
}