import { userEntity } from "./user";

export interface authEntity {
    userInfo: userEntity,
    authToken: string,
}