import { PackageService } from "../../../core/services/packageService";
import { Request, Response } from "express";
import { setResponse, setErrResponse } from "../../../hooks/response";
import { packageDTO, packageImageDTO, packageImageSave, packageOptionDTO } from "../../../core/entity/package";
import { Ecrypt } from "../../helpers/encrypt";
import { Convertion } from "../../helpers/convertion";
import { AxiosInstanceMultipart } from "../../../hooks/axiosInstance";
import FormData from 'form-data';
import { FILE_SCHEMA } from "../../../const/schema/file";

export class PackageController {
    constructor(private packageService: PackageService) {}

    async createPackage(req: Request, res: Response) {
        try {
            let fileBufferArr: any[] = [];
            let imageInBucket: packageImageSave[] = [];
            const axios = await AxiosInstanceMultipart(req);
            const { packageName, packageTypeId, description, provinceId, districtId, subDistrictId, lon, lat, status, packageImage, packageOption } = req.body;
            const packageOptionArr: packageOptionDTO[] = packageOption.map((data: packageOptionDTO) => ({
                packageId: Number(data.packageId),
                pkgOptionTypeId: Number(data.pkgOptionTypeId),
                name: data.name,
                description: data.description,
                adultPrice: Number(data?.adultPrice),
                childPrice: Number(data?.childPrice),
                groupPrice: Number(data?.groupPrice)
            }));

            const packageImageArr: packageImageDTO[] = packageImage.map((data: packageImageDTO) => ({
                base64: data.base64,
                fileName: data.fileName,
                mainFile: data.mainFile
            }));

            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId = userInfo?.id;

            for (const file of packageImageArr) {
                const fileConverted = await Convertion.Decodebase64(file.base64);
                fileBufferArr.push({
                    buffer: fileConverted,
                    fileName: file.fileName,
                    mainFile: file.mainFile
                });
            }

            for (const fileBuffer of fileBufferArr) {
                const form = new FormData();
                form.append("file", fileBuffer.buffer, {
                    filename: fileBuffer.fileName,
                });
                form.append("file_path", FILE_SCHEMA.PACKAGE_UPLOAD_IMAGE_PATH);

                const response = await axios?.post('/upload', form);

                if (response?.status === 201) {
                    imageInBucket.push({
                        file_name: response?.data?.body?.file_name,
                        file_original_name: response?.data?.body?.file_original_name,
                        file_path: response?.data?.body?.file_path,
                        mainFile: fileBuffer?.mainFile,
                    });
                }
            }

            
            const packageImg = JSON.stringify(imageInBucket);
            const packageData: packageDTO = {
                packageName: packageName,
                packageTypeId: Number(packageTypeId),
                description: description,
                provinceId: Number(provinceId),
                districtId: Number(districtId),
                subDistrictId: Number(subDistrictId),
                lon: lon,
                lat: lat,
                status: status,
                packageImage: packageImg,
                packageOption: packageOptionArr,
                created_by: userId,
                updated_by: userId
            };

            const newPackage = await this.packageService.createPackage(packageData);

            return setResponse({
                res: res,
                statusCode: 201,
                message: "Creating a package successfully.",
                body: newPackage
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Creating a package failed.",
                error: error instanceof Error ? error.message : 'Creating a package failed.'
            });
        }
    }

    async findPackages(req: Request, res: Response) {
        try {
            const response = await this.packageService.findPackage();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all package successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all package failed.",
                error: error instanceof Error ? error.message : 'Finding all package failed.'
            })
        }
    }

    async findPackageByid(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.packageService.findPackageById(id, req);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding package by id successfully.",
                body: response
            })
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding package by id failed.",
                error: error instanceof Error ? error.message : 'Finding package by id failed.'
            });
        }
    }

    async updatePackage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { packageName, packageTypeId, description, provinceId, districtId, subDistrictId, lon, lat, status, packageImage, packageOption } = req.body;
            const packageOptionArr: packageOptionDTO[] = packageOption.map((data: packageOptionDTO) => ({
                packageId: Number(data.packageId),
                pkgOptionTypeId: Number(data.pkgOptionTypeId),
                name: data.name,
                description: data.description,
                adultPrice: Number(data?.adultPrice),
                childPrice: Number(data?.childPrice),
                groupPrice: Number(data?.groupPrice)
            }));
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId = userInfo?.id;

            const packageData: packageDTO = {
                packageName: packageName,
                packageTypeId: Number(packageTypeId),
                description: description,
                provinceId: Number(provinceId),
                districtId: Number(districtId),
                subDistrictId: Number(subDistrictId),
                lon: lon,
                lat: lat,
                status: status,
                packageImage: packageImage,
                packageOption: packageOptionArr,
                updated_by: userId
            };

            const updatePackage = await this.packageService.updatePackage(id, packageData);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Updating package by id successfully.",
                body: updatePackage
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Updating package by id failed.",
                error: error instanceof Error ? error.message : 'Updating package by id failed.'
            });
        }
    }

    async deletePacakge(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.packageService.deletePackage(id);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Deleting package by id successfully.",
                body: response
            }); 
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Deleting package by id failed.",
                error: error instanceof Error ? error.message : 'Deleting package by id failed.'
            });
        }
    }
}