import { packageSearchParams } from "../../../core/entity/clientPackage";
import { ClientPackageService } from "../../../core/services/clientPackage";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { Request, Response } from "express";

export class ClientPackageController {
    constructor(private clientPackagService: ClientPackageService) {}

    async findProvinceByPackages(req: Request, res: Response) {
        try {
            const response = await this.clientPackagService.findProvinceByPackage();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all paackage name by province successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all paackage name by province failed",
                error:  error instanceof Error ? error.message : 'Finding all paackage name by province failed',
            });
        }
    }

    async findBySearch(req: Request, res: Response) {
        try {
            const { page, limit, provinceId, packageName } = req.query;

            const searchQuery: packageSearchParams = {
                req: req,
                provinceId: parseInt(provinceId as string),
                packageName: packageName as string,
                page: parseInt(page as string) || 1,
                limit: parseInt(limit as string) || 10,
            };

            const response = await this.clientPackagService.findBySearch(searchQuery);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding paackages by search successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding paackages by search failed.",
                error:  error instanceof Error ? error.message : 'Finding paackages by search failed.',
            });
        }
    }

    async findPackageDetail(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.clientPackagService.findPackageDetail(Number(id), req);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding paackage detail successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding paackage detail failed.",
                error:  error instanceof Error ? error.message : 'Finding paackage detail failed.',
            });
        }
    }
}