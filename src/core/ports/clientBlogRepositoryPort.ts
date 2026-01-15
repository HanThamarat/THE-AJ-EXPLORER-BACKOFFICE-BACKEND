import { blogListEntityType, blogListResponseType, blogSearchParamsType } from "../entity/clientBlog";


export interface ClientBlogRepositoryPort {
    findBlogs(params: blogSearchParamsType): Promise<blogListResponseType>;
    findBlogDetail(blogId: string): Promise<blogListEntityType>;
}