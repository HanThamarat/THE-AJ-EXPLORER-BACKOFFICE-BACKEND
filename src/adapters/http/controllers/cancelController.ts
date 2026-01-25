import { Request, Response } from "express";
import { CancelService } from "../../../core/services/cancelService";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { cancelDTOType } from "../../../core/entity/cancel";

export class CancelController {
    constructor(private cancelService: CancelService) {}

    async findAllCancel(req: Request, res: Response) {
        try {
            const response = await this.cancelService.findAllCancel();
            
            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all cancel successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all cancel failed",
                error: error instanceof Error ? error.message : 'Finding all cancel failed'
            });
        }
    }

    async findCancelDetail(req: Request, res: Response) {
        try {
            const { bookingId } = req.params;

            const response = await this.cancelService.findCancelDetail(bookingId);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding cancel detail successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding cancel detail failed",
                error: error instanceof Error ? error.message : 'Finding cancel detail failed'
            });
        }
    }

    async updateCancelStatus(req: Request, res: Response) {
        try {
            const { cancelStatus } = req.body as cancelDTOType;
            const { bookingId } = req.params;

            const DataDTO: cancelDTOType = { cancelStatus };

            const response = await this.cancelService.updateCancel(bookingId, DataDTO);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Updating booking status successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Updating booking status failed",
                error: error instanceof Error ? error.message : 'Updating booking status failed'
            });
        }
    }
}