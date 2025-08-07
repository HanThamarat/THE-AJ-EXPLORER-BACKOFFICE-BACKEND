import * as express from 'express';
import { AuthPrismaORM } from '../prisma/auth';
import { AuthService } from '../../../core/services/authService';
import { AuthController } from '../controllers/authController';

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
*           example: administrator
*           description: Here, you can take a your username.
*         password:
*           type: string
*           example: 123456
*           description: The passsword of username.
*/

/**
* @swagger
* /api/auth/signin:
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
router.post('/signin', authController.authenticate.bind(authController));

export default router;