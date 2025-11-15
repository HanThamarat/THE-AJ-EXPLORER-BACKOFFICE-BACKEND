import passport from 'passport';
import { prisma } from '../../database/data-source';
import localStorategy from 'passport-local';
import passportJWT from 'passport-jwt';
import dotenv from 'dotenv';
import { Ecrypt } from '../../helpers/encrypt';

dotenv.config();

const LocalStorategy = localStorategy.Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const SecretJWT: string = process.env.JWT_SECRET as string;

passport.use(new LocalStorategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    async (username: string, password: string, cb: any) => {
        try {    
            const user = await prisma.administrator.findFirst({
                where: {
                    OR: [
                        {
                            username: {
                                equals: username,
                                mode: 'insensitive'
                            }
                        },
                        {
                            email: {
                                equals: username,
                                mode: 'insensitive'
                            }
                        }
                    ]
                }
            });

            if (!user) return cb(null, false, { message: 'This Username or Email not found in the system.' });

            const passwordDecrypted = await Ecrypt.passwordDecrypt(password, user.password as string);

            if (passwordDecrypted === false) return cb(null, false, { message: 'Invalid your password.' });

            return cb(null , user, { message: 'Sign in Successfully.' });
        } catch (error) {
            return cb(null, false, { message: 'Something wrong.' });
        }
    }
));

passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: SecretJWT
    }, (jwtPayload: any, cb: any) => {
        try {
            return cb(null, jwtPayload);
        } catch (err) {
            return cb(err);
        }
    }
));

