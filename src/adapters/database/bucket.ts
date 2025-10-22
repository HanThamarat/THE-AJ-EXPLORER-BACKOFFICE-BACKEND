import { Request } from "express";
import { AxiosInstance, AxiosInstanceMultipart } from "../../hooks/axiosInstance";
import { imageDTO, imageEntity } from "../../const/schema/image";
import { Convertion } from "../helpers/convertion";
import FormData from 'form-data';

export class Bucket {
    static async findFirst(req: Request, image: imageEntity, file_path: string): Promise<imageEntity | Error> {
        try {
            const axios = await AxiosInstance(req);
            let imgArr: Array<string> = [];
            imgArr.push(image.file_name);
    
            const imageBase64 = await axios?.post('/findfiles', {
                file_name: imgArr,
                file_path: file_path
            });
    
            return {
                file_name: image.file_name,
                file_original_name: image.file_original_name,
                file_path: image.file_path,
                mainFile: image.mainFile,
                base64: imageBase64?.data?.body[0].file_base64,
            };
        } catch (error: any) {
            return error as Error;
        }
    }

    static async upload(req: Request, image: imageDTO, file_path: string): Promise<imageEntity | Error> {
        try {
            const axios = await AxiosInstanceMultipart(req);
            const fileConverted = await Convertion.Decodebase64(image.base64);    
            const form = new FormData();
            form.append("file", fileConverted, {
                filename: image.fileName
            });
            form.append("file_path", file_path);
    
            const response = await axios?.post("/upload", form);
            let imageResponse: imageEntity = {
                file_name: "",
                file_original_name: "",
                file_path: "",
                mainFile: true,
            };
            if (response?.status === 201) {
                imageResponse = {
                    file_name: response?.data?.body?.file_name,
                    file_original_name: response?.data?.body?.file_original_name,
                    file_path: response?.data?.body?.file_path,
                    mainFile: image?.mainFile,
                }
            }

            return imageResponse;
        } catch (error) {
            return error as Error;
        }
    }

    static async delete(req: Request, image: imageEntity, file_path: string): Promise<imageEntity | Error> {
        try {
            const axios = await AxiosInstance(req);
            let imgArr: Array<string> = [];
            imgArr.push(image.file_name);
    
            const imageBase64 = await axios?.post('/deletefiles', {
                file_name: imgArr,
                file_path: file_path
            });
    
            return {
                file_name: image.file_name,
                file_original_name: image.file_original_name,
                file_path: image.file_path,
                mainFile: image.mainFile,
                base64: imageBase64?.data?.body[0].file_base64,
            };
        } catch (error) {
            return error as Error;
        }
    }
}