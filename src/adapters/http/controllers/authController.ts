import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../../core/services/authService";
import { authEntity } from "../../../core/entity/auth";
import { Ecrypt } from "../../helpers/encrypt";
import { setResponse, setErrResponse } from "../../../hooks/response";
import passport from "passport";

export class AuthController {
  constructor(private authService: AuthService) {}

  async authenticate(req: Request, res: Response, next: NextFunction) {
    try {
      passport.authenticate(
        "local",
        { session: false },
        async (err: any, user: any, info: any) => {
          if (err) return next(err);
          if (user) {
            const authToken = await Ecrypt.generateToken(user);
            const response: authEntity = {
              userInfo: {
                id: user?.id,
                firstName: user?.firstName ? user?.firstName : "no data",
                lastName: user?.lastName ? user?.lastName : "no data",
                email: user?.email ? user?.email : "no data",
                username: user?.username ? user?.username : "no data",
                password: user?.password ? user?.password : "no data",
                roleId: user?.roleId,
                created_at: user?.created_at,
                updated_at: user?.updated_at,
              },
              authToken: authToken,
            };
            return setResponse({
              res: res,
              message: "authenticate successfully.",
              statusCode: 200,
              body: response
            });
          } else {
            return setErrResponse({
                res: res,
                message: "authentication failed.",
                statusCode: 402,
                error: info,
            })
          }
        }
      )(req, res, next);
    } catch (error) {
      return setErrResponse({
        res: res,
        message: "authentication failed.",
        statusCode: 401,
        error: error,
      });
    }
  }
}
