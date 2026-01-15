import { ClientBlogRepositoryPort } from "../../../core/ports/clientBlogRepositoryPort";
import { blogListEntityType } from "../../../core/entity/clientBlog";
import { prisma } from "../../database/data-source";
import { imageEntity } from "../../../types/image";
import { Bucket } from "../../database/bucket";
import { FILE_SCHEMA } from "../../../types/file";

export class ClientBlogDataSource implements ClientBlogRepositoryPort {

    async findBlogs(): Promise<blogListEntityType[]> {
        const blogResult = await prisma.blog.findMany({
            where: {
                status: true
            },
            select: {
                id: true,
                title: true,
                thumnbnail: true,
                created_at: true,
                toBlogType: {
                    select: {
                        name: true
                    }
                },
                insertBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const resultFormat: blogListEntityType[] = await Promise.all(blogResult.map(async (item) => {

            const viewerCount = await prisma.blogViewer.count({
                where: {
                    blogId: item.id
                }
            });

            const imageConvert: imageEntity = JSON.parse(item.thumnbnail as string);
            const imageResponse = await Bucket.findFirstWithoutToken(imageConvert, FILE_SCHEMA.BLOG_THUMBNAIL_PATH);
            

            return {
                id: item.id,
                blogName: item.title,
                blogType: item.toBlogType.name,
                viewer: viewerCount,
                thumnbnail: imageResponse as imageEntity,
                created_at: item.created_at,
                created_by: `${item.insertBy.firstName} ${item.insertBy.lastName}`
            }
        }));

        return resultFormat;
    }
}