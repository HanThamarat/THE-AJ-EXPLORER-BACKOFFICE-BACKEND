import * as express from 'express';
import { AuthPrismaORM } from '../prisma/auth';
import { AuthService } from '../../../core/services/authService';
import { AuthController } from '../controllers/authController';
import { validateRequest } from '../middleware/validateRequest';
import { createCustomerSchema, credentialSigninSchema, googleSigninSchema, localSigninSchema } from '../../../core/entity/auth';
// import { ExpressAuth } from '@auth/express';
// import Google from '@auth/express/providers/google';
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from '../../database/data-source';

const router = express.Router();
const authRepository = new AuthPrismaORM();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication for use system
 */

/**
* @swagger
* components:
*   schemas:
*     Authentication:
*       type: object
*       properties:
*         username:
*           type: string
*           example: username
*           description: Here, you can take a your username.
*         password:
*           type: string
*           example: password
*           description: The passsword of username.
*     GoogleAuthentication:
*       type: object
*       properties:
*         email:
*           type: string
*           example: hanthamarat@gmail.com
*         name:
*           type: string
*           example: some name
*         picture:
*           type: string
*           example: image link from google
*         sub:
*           type: string
*           example: goolge user id
*     CreateCustomer:
*       type: object
*       properties:
*         email:
*           type: string
*           example: hanthamarat@gmail.com
*         name:
*           type: string
*           example: some name
*         password:
*           type: string
*           example: 123456
*     CredentialSignin:
*       type: object
*       properties:
*         email:
*           type: string
*           example: hanthamarat@gmail.com
*         password:
*           type: string
*           example: 123456
*/

/**
* @swagger
* /api/v1/auth/signin:
*   post:
*     tags: [Authentication]
*     summary: authenticate line
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Authentication'
*     responses:
*       200:
*         description: authentication successful
*/
router.post(
  '/signin',
  validateRequest({ body: localSigninSchema }),
  authController.authenticate.bind(authController)
);

/**
* @swagger
* /api/v1/auth/google-signin:
*   post:
*     tags: [Authentication]
*     summary: client auth with google oauth
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/GoogleAuthentication'
*     responses:
*       200:
*         description: sign in with google oauth successfully.
*/
router.post(
  '/google-signin',
  validateRequest({ body: googleSigninSchema }),
  authController.findOrCreateUserByGoogle.bind(authController)
);

/**
* @swagger
* /api/v1/auth/create-customer:
*   post:
*     tags: [Authentication]
*     summary: create client with credentail
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateCustomer'
*     responses:
*       200:
*         description: create client with credentail successfully.
*/
router.post(
  '/create-customer',
  validateRequest({ body: createCustomerSchema }),
  authController.createUserWithPassword.bind(authController)
);

/**
* @swagger
* /api/v1/auth/signin-customer:
*   post:
*     tags: [Authentication]
*     summary: sign in client with credentail
*     security:
*       - BearerAuth: []
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CredentialSignin'
*     responses:
*       200:
*         description: sign in with credentail successfully.
*/
router.post(
  '/signin-customer',
  validateRequest({ body: credentialSigninSchema }),
  authController.validateUserPassword.bind(authController)
);

// router.use("/providers", 
//     ExpressAuth({ 
//         adapter: PrismaAdapter(prisma),
//         providers: [ Google ],
//         callbacks: {
//             async signIn({ user, account, profile }) {
//                 console.log("User signed in:", user);
//                 return true;
//             },
//             async session({ session, token }) {
//                 console.log("Session:", session);
//                 return session;
//             },
//         },
//         session: {
//             strategy: 'database'
//         }
// }));

export default router;