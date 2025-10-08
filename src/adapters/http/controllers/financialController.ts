import { Request, Response } from "express";
import { FinancialService } from "../../../core/services/financialService";
import { setErrResponse, setResponse } from "../../../hooks/response";

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
}