import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { RefundService } from "../../../core/services/refundService";
import { refundDTOType } from "../../../core/entity/refund";

export class RefundController {
    constructor(private refundService: RefundService) {}

    async findAllRefund(req: Request, res: Response) {
        try {
            
            const response = await this.refundService.findAllRefund();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Find all refund successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Find all refund failed",
                error: error instanceof Error ? error.message : 'Finding all refund failed'
            });
        }
    }

    async findRefundDetail(req: Request, res: Response) {
        try {
            const { bookingId } = req.params;

            const response = await this.refundService.findRefundDetail(bookingId);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Find refund detail successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Find refund detail failed",
                error: error instanceof Error ? error.message : 'Finding refund detail failed'
            });
        }
    }

    async updateRefund(req: Request, res: Response) {
        try {
            const { bookingId } = req.params;
            const { refundStatus } = req.body as refundDTOType;

            const dataDTO: refundDTOType = { refundStatus };

            const response = await this.refundService.updateRefund(bookingId, dataDTO);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Update refund status successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Update refund status failed.",
                error: error instanceof Error ? error.message : 'FUpdate refund status failed.'
            });
        }
    }
}