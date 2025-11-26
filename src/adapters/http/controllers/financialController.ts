import { Request, Response } from "express";
import { FinancialService } from "../../../core/services/financialService";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { chargeDTO, RefundDTO } from "../../../core/entity/financial";

export class FinancialController {
    constructor(private financialService: FinancialService) {}

    async balance(req: Request, res: Response) {
        try {
            const response = await this.financialService.balance();

            return setResponse({
                res: res,
                message: "Get balance successfully.",
                statusCode: 200,
                body: response
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Get balance failed.",
                error: err instanceof Error ? err.message : 'Get balance failed.',
                statusCode: 500
            });
        }
    }

    async generateQr(req: Request, res: Response) {
        try {
            const { bookingId, amount } = req.body as chargeDTO;

            const chargeDATA: chargeDTO = {
                amount,
                bookingId
            }

            const response = await this.financialService.generateQr(chargeDATA);

            return setResponse({
                res: res,
                message: "Generate the qr code successfully.",
                statusCode: 200,
                body: response
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Generate the qr code.",
                error: err instanceof Error ? err.message : 'Generate the qr code.',
                statusCode: 500
            });
        }
    }

    async findChargesById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.financialService.findChargesById(id);

            return setResponse({
                res: res,
                message: "Finding charge by charge id successfully.",
                statusCode: 200,
                body: response
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Finding charge by charge id failed.",
                error: err instanceof Error ? err.message : 'Finding charge by charge id failed.',
                statusCode: 500
            });
        }
    }

    async createRefund(req: Request, res: Response) {
        try {
            const { chargesId, amount, booking_id } = req.body as RefundDTO;

            const RefundDTOFormetter: RefundDTO = {
                chargesId,
                amount,
                booking_id
            };

            const response = await this.financialService.createRefund(RefundDTOFormetter);

            return setResponse({
                res: res,
                message: `Creating a new refund for this charges id successfully: ${chargesId}`,
                statusCode: 200,
                body: response
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: `Creating a new refund for this charges id failed.`,
                error: err instanceof Error ? err.message : `Creating a new refund for this charges id failed.`,
                statusCode: 500
            });
        }
    }
}