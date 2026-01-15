import { blogListEntityType } from "../entity/clientBlog";

export interface ClientBlogRepositoryPort {
    findBlogs(): Promise<blogListEntityType[]>;
}