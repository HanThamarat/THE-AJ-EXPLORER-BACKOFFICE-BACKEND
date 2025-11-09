import { FILE_SCHEMA } from "../../../const/schema/file";
import { blogDTO, blogEntity, blogTypeEntity } from "../../../core/entity/blog";
import { BlogRepositoryPort } from "../../../core/ports/blogRepositortPort";
import { prisma } from "../../database/data-source";
import { Convertion } from "../../helpers/convertion";
import FormData from 'form-data';
import { AxiosInstanceMultipart } from "../../../hooks/axiosInstance";
import { imageEntity } from "../../../const/schema/image";
import { BLOG_DATA_SOURCE } from "../../database/querys/blog";
import { Request } from "express";
import { Bucket } from "../../database/bucket";

export class BlogORM implements BlogRepositoryPort {
    async createBlog(blogDTO: blogDTO): Promise<blogEntity> {

        if (!blogDTO.thumnbnail) throw new Error("Plase attract file before submition.");

        const uploadThumnail = await Bucket.upload(blogDTO.req, blogDTO.thumnbnail, FILE_SCHEMA.BLOG_THUMBNAIL_PATH);

        const convertObjecttoString = JSON.stringify(uploadThumnail);
        
        const createNewBlog = prisma.blog.create({
            data: {
                title: blogDTO.title,
                blogType: blogDTO.blogType,
                descrition: blogDTO.descrition,
                thumnbnail: convertObjecttoString,
                status: blogDTO.status,
                created_by: blogDTO.created_by,
                updated_by: blogDTO.updated_by
            }
        });

        if (!createNewBlog) throw new Error("Creaxting a blog someting worg in createNewBlog progess!");

        const result = await BLOG_DATA_SOURCE.findBlog((await createNewBlog).id, blogDTO.req);

        return result;
    };

    async findAllBlogs(): Promise<blogEntity[]> {
        const findAll = await prisma.blog.findMany({
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                title: true,
                thumnbnail: true,
                descrition: true,
                status: true,
                created_at: true,
                updated_at: true,
                toBlogType: {
                    select: {
                        name: true,
                    }
                },
                insertBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                updateBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const responseFormetter: blogEntity[] = findAll.map((response) => ({
            id: response?.id ? response.id : 0,
            title: response?.title ? response.title : "no data",
            blogtype: response?.toBlogType.name ? response.toBlogType.name : "no data",
            thumnbnail: response?.thumnbnail ? JSON.parse(response.thumnbnail) : "no data",
            descrition: response?.descrition ? response.descrition : "no data",
            status: response?.status ? response.status : "no data",
            created_at: response?.created_at ? response.created_at : "no data",
            created_by: response?.insertBy.firstName ? `${response.insertBy.firstName} ${response.insertBy.lastName}` : "",
            updated_at: response?.updated_at ? response.updated_at : "no data",
            updated_by: response?.updateBy.firstName ? `${response.updateBy.firstName} ${response.updateBy.lastName}` : "",
        }));

        return responseFormetter;
    }

    async findBlogById(req: Request, id: string): Promise<blogEntity> {
        const response = await BLOG_DATA_SOURCE.findBlog(Number(id), req);
        
        return response;
    }

    async updateBlog(id: string, blogDTO: blogDTO): Promise<blogEntity> {
        const blogId = Number(id);
        let imageUpdatedTostirng: string = "";

        const recheckBlog = await prisma.blog.findFirst({
            where: {
                id: blogId,
                deleted_at: null
            }
        });

        if (!recheckBlog) throw new Error("This blog id not found in the system.");

        if (blogDTO.thumnbnail) {
            const updateImage = await Bucket.upload(blogDTO.req, blogDTO.thumnbnail, FILE_SCHEMA.BLOG_THUMBNAIL_PATH) as imageEntity;
            if (updateImage.file_name === "") throw new Error("have somethong worg in update image to bucket progress.");
            imageUpdatedTostirng = JSON.stringify(updateImage);
            if (recheckBlog.thumnbnail) {
                const convertoJSON: imageEntity = JSON.parse(recheckBlog.thumnbnail);
                await Bucket.delete(blogDTO.req, convertoJSON, FILE_SCHEMA.BLOG_THUMBNAIL_PATH);
            }
        }

        const updateBlog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                title: blogDTO.title,
                descrition: blogDTO.descrition,
                thumnbnail: imageUpdatedTostirng,
                status: blogDTO.status,
                blogType: blogDTO.blogType,
                created_by: blogDTO.created_by,
                updated_by: blogDTO.updated_by
            }
        });

        if (!updateBlog) throw new Error("Has somethong worng in updating a blog.");

        const response = await BLOG_DATA_SOURCE.findBlog(blogId, blogDTO.req);

        return response;
    }

    async deleteBlog(id: string): Promise<blogEntity> {
        const blogId = Number(id);

        const recheckBlog = await prisma.blog.count({
            where: {
                id: blogId,
                deleted_at: null
            }
        });

        if (recheckBlog === 0) throw new Error("This blog id not found data in the system.");

        const deleteBlog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                deleted_at: new Date()
            }
        });

        if (!deleteBlog) throw new Error("Deting has somethong worng.");

        const response = await prisma.blog.findFirst({
            where: {
                id: blogId,
            },
            select: {
                id: true,
                title: true,
                thumnbnail: true,
                descrition: true,
                status: true,
                created_at: true,
                updated_at: true,
                toBlogType: {
                    select: {
                        name: true,
                    }
                },
                insertBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                updateBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const convertStringImage: imageEntity = JSON.parse(response?.thumnbnail as string);

        const responsrFormatter: blogEntity = {
            id: response?.id ? response.id : 0,
            blogtype: response?.toBlogType.name ? response.toBlogType.name : "no data",
            title: response?.title ? response.title : "no data",
            thumnbnail: {
                file_name: convertStringImage.file_name,
                file_original_name: convertStringImage.file_original_name,
                file_path: convertStringImage.file_path,
                mainFile: convertStringImage.mainFile,
            },
            descrition: response?.descrition ? response.descrition : "no data",
            status: response?.status ? response.status : "no data",
            created_at: response?.created_at ? response.created_at : "no data",
            created_by: response?.insertBy.firstName ? `${response.insertBy.firstName} ${response.insertBy.lastName}` : "",
            updated_at: response?.updated_at ? response.updated_at : "no data",
            updated_by: response?.updateBy.firstName ? `${response.updateBy.firstName} ${response.updateBy.lastName}` : "",
        };

        return responsrFormatter;
    }

    async findAllBlogType(): Promise<blogTypeEntity[]> {
        const result = await prisma.blogType.findMany({});

        return result;
    }
}