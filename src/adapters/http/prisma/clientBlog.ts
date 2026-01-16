import { ClientBlogRepositoryPort } from "../../../core/ports/clientBlogRepositoryPort";
import { blogListEntityType, blogSearchParamsType, blogListResponseType } from "../../../core/entity/clientBlog";
import { prisma } from "../../database/data-source";
import { imageEntity } from "../../../types/image";
import { Bucket } from "../../database/bucket";
import { FILE_SCHEMA } from "../../../types/file";

export class ClientBlogDataSource implements ClientBlogRepositoryPort {

    async findBlogs(params: blogSearchParamsType): Promise<blogListResponseType> {
        const skip: number = (params.page - 1) * params.limit;
        const take: number = params.limit;

        const [blogResult, total] = await Promise.all([
            prisma.blog.findMany({
                skip,
                take,
                where: {
                    status: true
                },
                orderBy: {
                    created_at: 'desc'
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
            }),
            prisma.blog.count({
                where: {
                    status: true
                }
            })
        ]);



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

        return {
            page: params.page,
            limit: params.limit,
            total: total,
            totalPage: Math.ceil(total / params.limit),
            nextPage: params.page * params.limit < total ? params.page + 1 : null,
            prevPage: params.page > 1 ? params.page -1 : null,
            items: resultFormat
        } as blogListResponseType;
    }

    async findBlogDetail(blogId: string): Promise<blogListEntityType> {
    
        const reCheck = await prisma.blog.count({
            where: {
                status: true,
                id: Number(blogId)
            }
        });

        if (reCheck === 0) throw new Error("This blog id can't found in the systems, please try again later.");
        
        const blogResult = await prisma.$transaction(async (tx) => {
            await tx.blogViewer.create({
                data: {
                    blogId: Number(blogId)
                }
            });

             const result = await tx.blog.findFirst({
                where: {
                    status: true,
                    id: Number(blogId)
                },
                select: {
                    id: true,
                    title: true,
                    thumnbnail: true,
                    created_at: true,
                    descrition: true,
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

            return result;
        });

        const viewerCount = await prisma.blogViewer.count({
            where: {
                blogId: blogResult?.id
            }
        });

        const imageConvert: imageEntity = JSON.parse(blogResult?.thumnbnail as string);
        const imageResponse = await Bucket.findFirstWithoutToken(imageConvert, FILE_SCHEMA.BLOG_THUMBNAIL_PATH);

        return {
            id: blogResult?.id as number,
            blogName: blogResult?.title as string,
            blogType: blogResult?.toBlogType.name as string,
            description: blogResult?.descrition,
            viewer: viewerCount,
            thumnbnail: imageResponse as imageEntity,
            created_at: blogResult?.created_at as Date,
            created_by: `${blogResult?.insertBy.firstName} ${blogResult?.insertBy.lastName}`
        }
    }
}