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
}