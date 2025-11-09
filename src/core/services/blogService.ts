import { blogDTO, blogEntity, blogTypeEntity } from "../entity/blog";
import { BlogRepositoryPort } from "../ports/blogRepositortPort";
import { Request } from "express";

export class BlogService {
    constructor(private readonly blogReposotoryPort: BlogRepositoryPort) {}

    createBlog(blogDTO: blogDTO): Promise<blogEntity> {
        return this.blogReposotoryPort.createBlog(blogDTO);
    }

    findAllBlogs(): Promise<blogEntity[]> {
        return this.blogReposotoryPort.findAllBlogs();
    }

    findBlogById(req: Request, id: string): Promise<blogEntity> {
        return this.blogReposotoryPort.findBlogById(req, id);
    }

    updateBlog(id: string, blogDTO: blogDTO): Promise<blogEntity> {
        return this.blogReposotoryPort.updateBlog(id, blogDTO);
    }

    deleteBlog(id: string): Promise<blogEntity> {
        return this.blogReposotoryPort.deleteBlog(id);
    }

    findAllBlogType(): Promise<blogTypeEntity[]> {
        return this.blogReposotoryPort.findAllBlogType();
    }
}