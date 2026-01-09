import { FILE_SCHEMA } from "../../../types/file";
import { imageEntity } from "../../../types/image";
import { blogEntity } from "../../../core/entity/blog";
import { prisma } from "../data-source";
import { AxiosInstance } from "../../../hooks/axiosInstance";
import { Request } from "express";

export class BLOG_DATA_SOURCE {
    static async findBlog(id: number, req: Request): Promise<blogEntity> {
        const axios = await AxiosInstance(req);
        const response = await prisma.blog.findFirst({
            where: {
                id: id,
                deleted_at: null
            },
            select: {
                id: true,
                title: true,
                thumnbnail: true,
                descrition: true,
                blogType: true,
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
        

        let parseImage: imageEntity = {
            file_name: "",
            file_original_name: "",
            file_path: "",
            mainFile: true,
        }; 
        if (response?.thumnbnail) {
            parseImage = JSON.parse(response.thumnbnail);
        }

        let imgArr: Array<string> = [];
        imgArr.push(parseImage.file_name);

        const imageBase64 = await axios?.post('/findfiles', {
            file_name: imgArr,
            file_path: FILE_SCHEMA.BLOG_THUMBNAIL_PATH
        });
    
        const responsrFormatter: blogEntity = {
            id: response?.id ? response.id : 0,
            title: response?.title ? response.title : "no data",
            blogtype: response?.toBlogType.name ? response.toBlogType.name : "no data",
            blogtype_id: response?.blogType ? response.blogType : 0,
            thumnbnail: {
                file_name: parseImage.file_name,
                file_original_name: parseImage.file_original_name,
                file_path: parseImage.file_path,
                mainFile: parseImage.mainFile,
                base64: imageBase64?.data?.body[0].file_base64
            },
            descrition: response?.descrition ? response.descrition : "no data",
            status: response?.status ? response.status : false,
            created_at: response?.created_at ? response.created_at : "no data",
            created_by: response?.insertBy.firstName ? `${response.insertBy.firstName} ${response.insertBy.lastName}` : "",
            updated_at: response?.updated_at ? response.updated_at : "no data",
            updated_by: response?.updateBy.firstName ? `${response.updateBy.firstName} ${response.updateBy.lastName}` : "",
        };

        return responsrFormatter;
    }

    static async findImage(thumnbnail: any, req: Request): Promise<imageEntity> {
        const axios = await AxiosInstance(req);
        let parseImage: imageEntity = {
            file_name: "",
            file_original_name: "",
            file_path: "",
            mainFile: true,
        }; 
        if (thumnbnail) {
            parseImage = JSON.parse(thumnbnail);
        }

        let imgArr: Array<string> = [];
        imgArr.push(parseImage.file_name);

        const imageBase64 = await axios?.post('/findfiles', {
            file_name: imgArr,
            file_path: FILE_SCHEMA.BLOG_THUMBNAIL_PATH
        });

        return {
            file_name: parseImage.file_name,
            file_original_name: parseImage.file_original_name,
            file_path: parseImage.file_path,
            mainFile: parseImage.mainFile,
            base64: imageBase64?.data?.body[0].file_base64,
        };
    }
}