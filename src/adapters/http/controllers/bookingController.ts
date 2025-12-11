import { BkService } from "../../../core/services/bookingService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";

export class BkController {
    constructor(private bkService: BkService) {}

    async findBooking(req: Request, res: Response) {
        try {
            const response = await this.bkService.findAllBooking();

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding all bookings successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding all bookings failed.",
                error: error instanceof Error ? error.message : 'Finding all bookings failed.'
            });
        }
    }

    async findBookingAvg(req: Request, res: Response) {
        try {
            const { type } = req.params;

            const response = await this.bkService.findBookingAvg(type as "Weekly" | "Monthly" | "Yearly");

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding bookings avg successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding bookings avg failed.",
                error: error instanceof Error ? error.message : 'Finding bookings avg failed.'
            });
        }
    }
}