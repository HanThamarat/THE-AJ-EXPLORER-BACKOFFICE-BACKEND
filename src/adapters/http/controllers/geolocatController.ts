import { GeolocatService } from "../../../core/services/geolocatService";
import { Request, Response } from "express";
import { setResponse, setErrResponse } from "../../../hooks/response";

export class GeolocatController {
    constructor (private geolocatService: GeolocatService) {}

    async finnAllprovince(req: Request, res: Response) {
        try {
            const response = await this.geolocatService.findAllProvince();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all province successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all province failed",
                error:  error instanceof Error ? error.message : 'Finding all province failed',
            });
        }
    }

    async findDistrictByProId(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.geolocatService.findDistrictByProId(id);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all district by pro id successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all district by pro id failed",
                error:  error instanceof Error ? error.message : 'Finding all district by pro id failed',
            });
        }
    }
}