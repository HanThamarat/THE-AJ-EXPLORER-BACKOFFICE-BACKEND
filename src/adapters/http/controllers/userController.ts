import { Request, Response } from "express";
import { UserService } from "../../../core/services/userService";
import { userEntity, userDTO } from "../../../core/entity/user";
import { Ecrypt } from "../../helpers/encrypt";
import { setResponse, setErrResponse } from "../../../hooks/response";

export class UserController {
    constructor(private userService: UserService) {}

    async createUser(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, username, password, roleId } = req.body;
        
            const passwordHashing = await Ecrypt.passwordEncrypt(password);

            const newUser = await this.userService.createUser({
                firstName: firstName,
                lastName: lastName,
                password: password,
                email: email,
                username: username,
                roleId: roleId
            } as userEntity, passwordHashing);

            
            return setResponse({
                res: res,
                statusCode: 201,
                message: "Creating the user successfully",
                body: newUser,
            });
        } catch(error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Creating the user failed",
                error: error
            });
        }
    };

    async findAllUser(req: Request, res: Response) {
        try {
            const users = await this.userService.findAllUser();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all users successfully",
                body: users,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all users failed",
                error: error,
            });
        }
    };

    async findUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await this.userService.findUserById(id);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding user by id successfully",
                body: user,
            });
        } catch(error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding user by id failed",
                error: error,
            });
        }
    } 

    async findUserByJWT(req: Request, res: Response) {
        try {
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId = userInfo?.id === null ? 0 : userInfo?.id;

            const response = await this.userService.findByJWT(`${userId}`);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding current user successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding current user failed",
                error: error,
            });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { firstName, lastName, email, username, password, roleId, currentPassword } = req.body;
            const { id } = req.params;
            
            const userDraf : userDTO =  {
                firstName: firstName,
                lastName: lastName,
                password: password,
                email: email,
                username: username,
                roleId: roleId,
                currentPassword: currentPassword,
            };

            const userResponse = await this.userService.update(id, userDraf);

            if (userResponse === null) throw "user not found";

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Updating user data successfully.",
                body: userResponse,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Updating user data failed.",
                error: error,
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const userDelete = await this.userService.delete(id);

            if (userDelete === null) throw "user not found";

            return setResponse({
                res: res,
                message: "Deleting user successfully.",
                statusCode: 200,
                body: userDelete,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Deleting user failed.",
                error: error,
            });
        }
    }
}