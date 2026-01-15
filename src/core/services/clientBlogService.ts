import { blogListEntityType, blogListResponseType, blogSearchParamsType } from "../entity/clientBlog";
import { ClientBlogRepositoryPort } from "../ports/clientBlogRepositoryPort";

export class ClientBlogService {
    constructor(private clientBlogRepositoryPort: ClientBlogRepositoryPort) {}

    findBlogs(params: blogSearchParamsType): Promise<blogListResponseType> {
        return this.clientBlogRepositoryPort.findBlogs(params);
    }

    findBlogDetail(blogId: string): Promise<blogListEntityType> {
        return this.clientBlogRepositoryPort.findBlogDetail(blogId);
    }
}