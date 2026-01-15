import { ClientBlogService } from "../../../core/services/clientBlogService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";

export class ClientBlogController {
    constructor(private clientBlogService: ClientBlogService) {}

    async findBlogs(req: Request, res: Response) {
        try {
            const response = await this.clientBlogService.findBlogs();

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
}