import express from "express";
import { BlogORM } from "../prisma/blog";
import { BlogController } from "../controllers/blogController";
import { BlogService } from "../../../core/services/blogService";
import { prisma as db } from "../../database/data-source";

const router = express.Router();
const blogRepositortPort = new BlogORM(db);
const blogService = new BlogService(blogRepositortPort);
const blogController = new BlogController(blogService);

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog Manament
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BlogImageDTO:
 *       type: object
 *       properties:
 *         base64:
 *           type: string
 *           example: base64
 *         fileName:
 *           type: string
 *           example: fileName.png
 *         mainFile:
 *           type: boolean
 *           example: true
 *       required:
 *         - base64
 *         - fileName
 *         - mainFile
 *
 *     CreateBlogDTO:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           example: "Phuket Adventure"
 *         blogType:
 *           type: integer
 *           example: 1
 *         descrition:
 *           type: string
 *           example: "A 3-day adventure in Phuket"
 *         status:
 *           type: boolean
 *           example: true
 *         thumnbnail:
 *           $ref: '#/components/schemas/BlogImageDTO'
 *       required:
 *         - title
 *         - descrition
 *         - status
 *         - thumnbnail
 */


/**
* @swagger
* /api/v1/blogmanagement/blog:
*   post:
*     tags: [Blog]
*     summary: Create a new blog.
*     description: Create a new blog.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateBlogDTO'
*     responses:
*       201:
*         description: Create a new blog successfully.
*/
router.post("/blog", blogController.createBlog.bind(blogController));

/**
* @swagger
* /api/v1/blogmanagement/blog:
*   get:
*     tags: [Blog]
*     summary: Get all blog
*     responses:
*       200:
*         description: Fetch a list of all blog from the system.
*/
router.get("/blog", blogController.findAllBlog.bind(blogController));

/**
* @swagger
* /api/v1/blogmanagement/blog/{id}:
*   get:
*     tags: [Blog]
*     summary: Getting the blog by id
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: Get charges info by charge id
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Getting blog by id successfully.
*/
router.get("/blog/:id", blogController.findBlogById.bind(blogController));

/**
* @swagger
* /api/v1/blogmanagement/blog/{id}:
*   put:
*     tags: [Blog]
*     summary: Update a blog by ID
*     description: Update blog in the system.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the updated blog.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateBlogDTO'
*     responses:
*       200:
*         description: update blog by blog id successfully
*/
router.put("/blog/:id", blogController.updateBlog.bind(blogController));

/**
 * @swagger
 * /api/v1/blogmanagement/blog/{id}:
 *   delete:
 *     tags: [Blog]
 *     summary: Delete a blog by ID
 *     description: Delete a blog from the system based on their unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the blog to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: deleting blog by id successfully
 */
router.delete("/blog/:id", blogController.deleteBlog.bind(blogController));

/**
* @swagger
* /api/v1/blogmanagement/blog_type:
*   get:
*     tags: [Blog]
*     summary: Get all blog type
*     responses:
*       200:
*         description: Finding all blog types successfully.
*/
router.get("/blog_type", blogController.findAllBlogType.bind(blogController));

export default router;