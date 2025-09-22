import { PkgTypeService } from "../../../core/services/pkgTypeService";
import { Request, Response } from "express";
import { setResponse, setErrResponse } from "../../../hooks/response";
import { Ecrypt } from "../../helpers/encrypt";
import { packageTypeDTO } from "../../../core/entity/packageType";
import { prisma } from "../../database/data-source";

export class PkgTypeController {
    constructor(private pkgTypeService: PkgTypeService) {}

    async createPkgType(req: Request, res: Response) {
        try {
            const { name, status } = req.body;
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId = userInfo?.id;

            const pkgTypeData: packageTypeDTO = {
                name: name,
                status: status,
                created_by: Number(userId),
                updated_by: Number(userId)
            }

            const response = await this.pkgTypeService.createPkgType(pkgTypeData);

            return setResponse({
                res: res,
                statusCode: 201,
                message: "Creating a package type successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Creating a package type failed.",
                error: error instanceof Error ? error.message : 'Creating a package failed.'
            });
        }
    }

    async findAllPkgType(req: Request, res: Response) {
        try {
            
            const response = await this.pkgTypeService.findPkgTypes();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all package type successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all package type failed.",
                error: error instanceof Error ? error.message : '"Finding all package failed.'
            });
        }
    }

    async findPkgTypeById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.pkgTypeService.findPkgTypeByid(id);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding a package type by id successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding a package type by id failed.",
                error: error instanceof Error ? error.message : '"Finding a package type by id failed.'
            });
        }
    }

    async updatePkgType(req: Request, res: Response) {
        try {
            const { name, status } = req.body;
            const { id } = req.params;
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId = userInfo?.id;

            const pkgTypeData: packageTypeDTO = {
                name: name,
                status: status,
                created_by: Number(userId),
                updated_by: Number(userId)
            }

            const response = await this.pkgTypeService.updatePkgType(id, pkgTypeData);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Updating a package type by id successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Updating a package type by id failed.",
                error: error instanceof Error ? error.message : '"Updating a package type by id failed.'
            });
        }
    }

    async deletePkgType(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.pkgTypeService.deletePkgType(id);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Deleting a package type by id successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Deleting a package type by id failed.",
                error: error instanceof Error ? error.message : '"Deleting a package type by id failed.'
            });
        }
    }
}