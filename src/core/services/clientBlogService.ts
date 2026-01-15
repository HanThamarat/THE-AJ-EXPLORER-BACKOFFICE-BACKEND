import { blogListEntityType } from "../entity/clientBlog";
import { ClientBlogRepositoryPort } from "../ports/clientBlogRepositoryPort";

export class ClientBlogService {
    constructor(private clientBlogRepositoryPort: ClientBlogRepositoryPort) {}

    findBlogs(): Promise<blogListEntityType[]> {
        return this.clientBlogRepositoryPort.findBlogs();
    }
}