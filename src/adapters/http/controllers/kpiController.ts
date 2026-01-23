import { KPIService } from "../../../core/services/kpiService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";

export class KPIController {
    constructor(private kipService: KPIService) {}

    async findPopularProvince(req: Request, res: Response) {
        try {
            const response = await this.kipService.findPopularProvince();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding popular province successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding popular province failed.",
                error:  error instanceof Error ? error.message : 'Finding popular province failed.',
            });
        }
    }

    async findTotalBooking(req: Request, res: Response) {
        try {
            
            const response = await this.kipService.findTotalBooking();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding booking qty successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding booking qty failed",
                error:  error instanceof Error ? error.message : 'Finding booking qty failed',
            });
        }
    }

    async findTotalPackage(req: Request, res: Response) {
        try {
            
            const response = await this.kipService.findTotalPackage();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding package qty successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding package qty failed",
                error:  error instanceof Error ? error.message : 'Finding package qty failed',
            });
        }
    }

    async findOverview(req: Request, res: Response) {
        try {
            
            const response = await this.kipService.findOverview();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding booking overview successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding booking overview failed",
                error:  error instanceof Error ? error.message : 'Finding booking overview failed',
            });
        }
    }

    async findTotalIncome(req: Request, res: Response) {
        try {
            
            const response = await this.kipService.findTotalIncome();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding booking total income successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding booking total income failed",
                error:  error instanceof Error ? error.message : 'Finding booking total income failed',
            });
        }
    }
}