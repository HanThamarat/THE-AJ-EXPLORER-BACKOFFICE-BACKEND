import express from "express";
import { ClientBlogDataSource } from "../prisma/clientBlog";
import { ClientBlogService } from "../../../core/services/clientBlogService";
import { ClientBlogController } from "../controllers/clientBlogController";

const router = express.Router();
const clientBlogRepositoryPort = new ClientBlogDataSource();
const clientBlogService = new ClientBlogService(clientBlogRepositoryPort);
const clientBlogController = new ClientBlogController(clientBlogService);

/**
 * @swagger
 * tags:
 *   name: ClientBlog
 *   description: Client Blog Service
 */

/**
* @swagger
* /api/v1/client/blog/blog_list:
*   get:
*     tags: [ClientBlog]
*     summary: Get the blogs list
*     parameters:
*       - in: query
*         name: page
*         schema:
*           type: integer
*         description: Page number
*       - in: query
*         name: limit
*         schema:
*           type: integer
*         description: Items per page
*     responses:
*       200:
*         description: blogs list successfully.
*/
router.get("/blog_list", clientBlogController.findBlogs.bind(clientBlogController));

/**
* @swagger
*  /api/v1/client/blog/blog_detail/{blogId}:
*   get:
*     tags: [ClientBlog]
*     summary: Get the blog detail
*     parameters:
*       - in: path
*         name: blogId
*         required: true
*         description: The ID of the get blog detail.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Get the blog detail successfully.
*/
router.get("/blog_detail/:blogId" , clientBlogController.findBlogDetail.bind(clientBlogController));

export default router;