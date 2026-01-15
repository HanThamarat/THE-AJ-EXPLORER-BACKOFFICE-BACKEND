import { ClientBlogService } from "../../../core/services/clientBlogService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { blogSearchParamsType } from "../../../core/entity/clientBlog";

export class ClientBlogController {
    constructor(private clientBlogService: ClientBlogService) {}

    async findBlogs(req: Request, res: Response) {
        try {
            const { page, limit } = req.query;

            const dataFormat: blogSearchParamsType = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10
            }

            const response = await this.clientBlogService.findBlogs(dataFormat);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Getting blogs successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Getting blogs failed",
                error: error instanceof Error ? error.message : 'Getting blogs failed'
            });
        }
    }

    async findBlogDetail(req: Request, res: Response) {
        try {
            const { blogId } = req.params;

            const response = await this.clientBlogService.findBlogDetail(blogId);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Getting blog detail successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Getting blog detail failed",
                error: error instanceof Error ? error.message : 'Getting blog detail failed'
            });
        }
    }
}