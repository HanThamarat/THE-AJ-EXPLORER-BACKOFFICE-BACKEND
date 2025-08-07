import * as express from 'express';
import { UserPrismaORM } from '../prisma/user';
import { UserService } from '../../../core/services/userService';
import { UserController } from '../controllers/userController';

const router = express.Router();
const userRepository = new UserPrismaORM();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management
 */

/**
* @swagger
* components:
*   schemas:
*     User:
*       type: object
*       properties:
*          firstName:
*           type: string
*           example: Han
*          lastName:
*           type: string
*           example: Thamarat
*          email:
*           type: string
*           example: HanThamarat@gmail.com
*          username:
*           type: string
*           example: HanThamarat
*          password:
*           type: string
*           example: 123456
*          roleId:
*           type: integer
*           example: 1
* 
* 
*     UserUpdate:
*       type: object
*       allOf:
*         - $ref: '#/components/schemas/User'
*       properties:
*         currentPassword:
*           type: string
*           description: current password
*/

/**
* @swagger
* /api/usermanagement/create_user:
*   post:
*     tags: [User]
*     summary: Create a new user
*     description: Create a new user in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/User'
*     responses:
*       201:
*         description: User created
*/
router.post('/create_user', userController.createUser.bind(userController));

/**
* @swagger
* /api/usermanagement/users:
*   get:
*     tags: [User]
*     summary: Get all users
*     responses:
*       200:
*         description: Fetch a list of all users from the system.
*/
router.get('/users', userController.findAllUser.bind(userController));

/**
* @swagger
* /api/usermanagement/user/{id}:
*   get:
*     tags: [User]
*     summary: Get user info by user id
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the get user info by user id.
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Fetch a list of user info usinng user id from the system.
*/
router.get('/user/:id', userController.findUserById.bind(userController));

export default router;