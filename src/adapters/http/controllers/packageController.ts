import { PackageService } from "../../../core/services/packageService";
import { Request, Response } from "express";
import { setResponse, setErrResponse } from "../../../hooks/response";
import { packageAttractionDTO, packageDTO, packageImageDTO, packageImageSave, packageInclude, packageNotInclude, packageOptionDTO } from "../../../core/entity/package";
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
            const { packageName, packageTypeId, additional_description, description, provinceId, districtId, subDistrictId, depart_point_lat, depart_point_lon,  end_point_lat, end_point_lon, status, packageImage, packageOption, benefit_include, benefit_not_include, attraction } = req.body;
            const packageOptionArr: packageOptionDTO[] = packageOption.map((data: packageOptionDTO) => ({
                packageId: Number(data.packageId),
                pkgOptionTypeId: Number(data.pkgOptionTypeId),
                name: data.name,
                description: data.description,
                adultFromAge: data?.adultFromAge,
                adultToAge: data?.adultToAge,
                childFromAge: data?.childFromAge,
                childToAge: data?.childToAge,
                groupFromAge: data?.groupFromAge,
                groupToAge: data?.groupToAge,
                adultPrice: Number(data?.adultPrice),
                childPrice: Number(data?.childPrice),
                groupPrice: Number(data?.groupPrice)
            }));
            const packageImageArr: packageImageDTO[] = packageImage.map((data: packageImageDTO) => ({
                base64: data.base64,
                fileName: data.fileName,
                mainFile: data.mainFile
            }));
            const attractionArr: packageAttractionDTO[] = attraction.map((data: packageAttractionDTO) => ({
                packageId: Number(data?.packageId),
                attractionName: data.attractionName,
                attractionTime: new Date(data.attractionTime),
                description: data.description,
                status: data.status
            }));
            const pakcageBenefitIncludeArr: packageInclude[] = benefit_include.map((data: packageInclude) => ({
                detail: data.detail
            }));
            const pakcageBenefitNotIncludeArr: packageNotInclude[] = benefit_not_include.map((data: packageNotInclude) => ({
                detail: data.detail
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
            const packageBenefitInclude = JSON.stringify(pakcageBenefitIncludeArr);
            const packageBenefitNotInclude = JSON.stringify(pakcageBenefitNotIncludeArr);
            const packageData: packageDTO = {
                packageName: packageName,
                packageTypeId: Number(packageTypeId),
                description: description,
                additional_description: additional_description,
                provinceId: Number(provinceId),
                districtId: Number(districtId),
                subDistrictId: Number(subDistrictId),
                depart_point_lat: depart_point_lat,
                depart_point_lon: depart_point_lon,
                end_point_lat: end_point_lat,
                end_point_lon: end_point_lon,
                benefit_include: packageBenefitInclude,
                benefit_not_include: packageBenefitNotInclude,
                status: status,
                packageImage: packageImg,
                packageOption: packageOptionArr,
                packageAttraction: attractionArr,
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
            let fileBufferArr: any[] = [];
            let imageInBucket: packageImageSave[] = [];
            const axios = await AxiosInstanceMultipart(req);
            const { id } = req.params;
            const { packageName, packageTypeId, description, additional_description, provinceId, districtId, subDistrictId, depart_point_lat, depart_point_lon,  end_point_lat, end_point_lon, status, packageImage, packageOption, benefit_include, benefit_not_include, attraction } = req.body;
           
            const packageOptionArr: packageOptionDTO[] = packageOption.map((data: packageOptionDTO) => ({
                packageId: Number(data.packageId),
                pkgOptionTypeId: Number(data.pkgOptionTypeId),
                name: data.name,
                description: data.description,
                adultFromAge: data?.adultFromAge,
                adultToAge: data?.adultToAge,
                childFromAge: data?.childFromAge,
                childToAge: data?.childToAge,
                groupFromAge: data?.groupFromAge,
                groupToAge: data?.groupToAge,
                adultPrice: Number(data?.adultPrice),
                childPrice: Number(data?.childPrice),
                groupPrice: Number(data?.groupPrice)
            }));

            const attractionArr: packageAttractionDTO[] = attraction.map((data: packageAttractionDTO) => ({
                packageId: Number(data.packageId),
                attractionName: data.attractionName,
                attractionTime: new Date(data.attractionTime),
                description: data.description,
                status: data.status
            }));
            
            const pakcageBenefitIncludeArr: packageInclude[] = benefit_include.map((data: packageInclude) => ({
                detail: data.detail
            }));

            const pakcageBenefitNotIncludeArr: packageNotInclude[] = benefit_not_include.map((data: packageNotInclude) => ({
                detail: data.detail
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
            const packageBenefitInclude = JSON.stringify(pakcageBenefitIncludeArr);
            const packageBenefitNotInclude = JSON.stringify(pakcageBenefitNotIncludeArr);
            const packageData: packageDTO = {
                packageName: packageName,
                packageTypeId: Number(packageTypeId),
                description: description,
                additional_description: additional_description,
                provinceId: Number(provinceId),
                districtId: Number(districtId),
                subDistrictId: Number(subDistrictId),
                depart_point_lat: depart_point_lat,
                depart_point_lon: depart_point_lon,
                end_point_lat: end_point_lat,
                end_point_lon: end_point_lon,
                benefit_include: packageBenefitInclude,
                benefit_not_include: packageBenefitNotInclude,
                status: status,
                packageImage: packageImg,
                packageOption: packageOptionArr,
                packageAttraction: attractionArr,
                updated_by: userId
            };

            const updatePackage = await this.packageService.updatePackage(id, packageData, req);

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