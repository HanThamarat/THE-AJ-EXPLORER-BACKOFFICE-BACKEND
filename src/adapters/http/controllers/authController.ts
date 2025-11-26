import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../../core/services/authService";
import { authEntity, googleProfileDTO, userCredentialDTO, GoogleSigninBody, CreateCustomerBody, CredentialSigninBody } from "../../../core/entity/auth";
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

  async findOrCreateUserByGoogle(req: Request, res: Response) {
    try {
      const { email, name, picture, sub } = req.body as GoogleSigninBody;

      if (!email || !name || !sub) throw "Missing Google profile details";

      const user: googleProfileDTO = {
        email,
        name,
        images: picture,
        googleId: sub,
      };

      const response = await this.authService.findOrCreateUserByGoogle(user);

      return setResponse({
        res: res,
        message: "authentication with google oauth successfully.",
        statusCode: 200,
        body: response
      });
    } catch (error) {
      return setErrResponse({
        res: res,
        message: "authentication with google oauth failed.",
        statusCode: 401,
        error: error instanceof Error ? error.message : 'authentication with google oauth failed.',
      });
    } 
  }

  async createUserWithPassword(req: Request, res: Response) {
    try {
      const { email, name, password } = req.body as CreateCustomerBody;

      const hashPassword = await Ecrypt.passwordEncrypt(password as string);

      const user: userCredentialDTO = {
        email,
        name,
        passsword: hashPassword
      };

      const response = await this.authService.createUserWithPassword(user);

      return setResponse({
        res: res,
        message: "create user with password successfully.",
        statusCode: 200,
        body: response
      });
    } catch (error) {
      return setErrResponse({
        res: res,
        message: "create user with password failed.",
        statusCode: 401,
        error: error instanceof Error ? error.message : 'create user with password failed.',
      });
    } 
  }

  async validateUserPassword(req: Request, res: Response) {
    try {
      const { email, password } = req.body as CredentialSigninBody;

      const user: userCredentialDTO = {
        email,
        passsword: password
      };

      const response = await this.authService.validateUserPassword(user);      

      return setResponse({
        res: res,
        message: "sign in with password successfully.",
        statusCode: 200,
        body: response
      });
    } catch (error) {
      return setErrResponse({
        res: res,
        message: "sign in with password failed.",
        statusCode: 401,
        error: error instanceof Error ? error.message : 'sign in with password failed.',
      });
    }
  }
}
