import { BlogService } from "../../../core/services/blogService";
import { Request, Response } from "express";
import { setResponse, setErrResponse } from "../../../hooks/response";
import { Ecrypt } from "../../helpers/encrypt";
import { imageDTO } from "../../../types/image";
import { BlogCreateBody, BlogUpdateBody, blogDTO } from "../../../core/entity/blog";

export class BlogController {
    constructor(private blogService: BlogService) {}

    async createBlog(req: Request, res: Response) {
        try {
            const { title, thumnbnail, descrition, status, blogType } = req.body as BlogCreateBody;
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId =  Number(userInfo?.id);

            const thumnbnailImage: imageDTO = {
                base64: thumnbnail.base64,
                fileName: thumnbnail.fileName,
                mainFile: thumnbnail.mainFile
            };

            const blogDATA: blogDTO = {
                req,
                title,
                descrition,
                status,
                blogType,
                thumnbnail: thumnbnailImage,
                created_by: userId,
                updated_by: userId,
            }

            const response = await this.blogService.createBlog(blogDATA);

            return setResponse({
                res: res,
                statusCode: 201,
                message: "Creating a new blog successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Creating a new blog failed.",
                error: error instanceof Error ? error.message : 'Creating a new blog failed.'
            });
        }
    }

    async findAllBlog(req: Request, res: Response) {
        try {
            const response = await this.blogService.findAllBlogs();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Getting all blogs successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Getting all blog failed.",
                error: error instanceof Error ? error.message : 'Getting all blog failed.'
            });
        }
    }

    async findBlogById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.blogService.findBlogById(req, id);
            
            return setResponse({
                res: res,
                statusCode: 200,
                message: "Getting blog by id successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Getting  blog by id failed.",
                error: error instanceof Error ? error.message : 'Getting blog by id failed.'
            });
        }
    }

    async updateBlog(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, thumnbnail, descrition, status, blogType } = req.body as BlogUpdateBody;
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId =  Number(userInfo?.id);

            const thumnbnailImage: imageDTO = {
                base64: thumnbnail.base64,
                fileName: thumnbnail.fileName,
                mainFile: thumnbnail.mainFile
            };

            const blogDATA: blogDTO = {
                req,
                title,
                descrition,
                status,
                blogType,
                thumnbnail: thumnbnailImage,
                created_by: userId,
                updated_by: userId,
            }

            const response = await this.blogService.updateBlog(id, blogDATA);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Updating blog by id successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Updating blog by id failed.",
                error: error instanceof Error ? error.message : 'Updating blog by id failed.'
            });
        }
    }

    async deleteBlog(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.blogService.deleteBlog(id);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "deleting blog by id successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "deleting blog by id failed.",
                error: error instanceof Error ? error.message : 'deleting blog by id failed.'
            });
        }
    }

    async findAllBlogType(req: Request, res: Response) {
        try {
            
            const response = await this.blogService.findAllBlogType();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all blog types successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all blog types failed.",
                error: error instanceof Error ? error.message : 'Finding all blog types failed.'
            });
        }
    }
}