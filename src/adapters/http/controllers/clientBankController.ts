import { ClientBankService } from "../../../core/services/clientBankService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";

export class ClientBankController {
    constructor(private clientBankService: ClientBankService) {}

    async findBankOption(req: Request, res: Response) {
        try {
            
            const response = await this.clientBankService.findBankOption();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Getting bank option successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Getting bank option failed",
                error: error instanceof Error ? error.message : 'Getting bank option failed'
            });
        }
    }
}