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
*     responses:
*       200:
*         description: blogs list successfully.
*/
router.get("/blog_list", clientBlogController.findBlogs.bind(clientBlogController));

export default router;