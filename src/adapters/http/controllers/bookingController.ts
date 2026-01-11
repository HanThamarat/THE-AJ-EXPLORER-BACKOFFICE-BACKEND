import { BkService } from "../../../core/services/bookingService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { bookingDetailDTOType } from "../../../core/entity/booking";

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

    async findBookingDetail(req: Request, res: Response) {
        try {
            const { bookingId } = req.params;

            const response = await this.bkService.findBookingDetail(bookingId);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding booking detail by booking id successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding booking detail by booking id failed.",
                error: error instanceof Error ? error.message : 'Finding booking detail by booking id failed.'
            });
        }
    }

    async updateBookingStatus(req: Request, res: Response) {
        try {
            const { bookingId, bookingStatus } = req.params;

            const response = await this.bkService.updateBookingStatus(bookingId, bookingStatus as  "panding" | "confirmed" | "failed");

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
                message: "Updating booking status failed.",
                error: error instanceof Error ? error.message : 'Updating booking status failed.'
            });
        }
    }

    async updateBookingDetail(req: Request, res: Response) {
        try {
            const { bookingId } = req.params;
            const { firstName, lastName, phoneNumber, pickupLocation, specialRequirement, email, trip_at, country } = req.body as bookingDetailDTOType;

            const dataDTO: bookingDetailDTOType = {
                firstName,
                lastName,
                phoneNumber,
                pickupLocation,
                specialRequirement,
                email,
                trip_at,
                country
            };

            const response = await this.bkService.updateBookingDetail(bookingId, dataDTO);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Updating booking info successfully.",
                body: response
            });
        } catch (error) {
            console.log(error);
            
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Updating booking info failed.",
                error: error instanceof Error ? error.message : 'Updating booking info failed.'
            });
        }
    }
}