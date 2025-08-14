import { PackageService } from "../../../core/services/packageService";
import { Request, Response } from "express";
import { setResponse, setErrResponse } from "../../../hooks/response";
import { packageDTO, packageOptionDTO } from "../../../core/entity/package";
import { Ecrypt } from "../../helpers/encrypt";

export class PackageController {
    constructor(private packageService: PackageService) {}

    async createPackage(req: Request, res: Response) {
        try {
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

            const response = await this.packageService.findPackageById(id);

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