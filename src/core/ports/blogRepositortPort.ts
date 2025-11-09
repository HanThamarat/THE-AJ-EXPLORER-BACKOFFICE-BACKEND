import { blogDTO, blogEntity, blogTypeEntity } from "../entity/blog";
import { Request } from "express";

export interface BlogRepositoryPort {
    createBlog(blogDTO: blogDTO): Promise<blogEntity>;
    findAllBlogs(): Promise<blogEntity[]>;
    findBlogById(req: Request, id: string): Promise<blogEntity>;
    updateBlog(id: string, blogDTO: blogDTO): Promise<blogEntity>;
    deleteBlog(id: string): Promise<blogEntity>;
    findAllBlogType(): Promise<blogTypeEntity[]>;
}