import { Request, Response } from "express";
import { UserService } from "../../../core/services/userService";
import { userEntity } from "../../../core/entity/user";
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
}