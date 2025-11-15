import { BookingService } from "../../../core/services/bookingService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { bookingEntity } from "../../../core/entity/booking";

export class BookingContorller {
    constructor(private bookingService: BookingService) {}

    async createBooking(req: Request, res: Response) {
        try {
            const {
                userId, childPrice, childQty, adultPrice, adultQty,
                groupPrice, groupQty, amount, additionalDetail, locationId,
                pickup_lat, pickup_lgn, trip_at, policyAccept, packageId
            } = req.body;

            const bookData: bookingEntity = {
                userId,
                childPrice,
                childQty,
                adultPrice,
                adultQty,
                groupPrice,
                groupQty,
                amount,
                additionalDetail,
                locationId,
                pickup_lat,
                pickup_lgn,
                trip_at,
                policyAccept,
                packageId: Number(packageId),
                paymentStatus: "panding",
                bookingStatus: "panding"
            };
            
            const response = await this.bookingService.createNewBooking(bookData);

            return setResponse({
                res: res,
                statusCode: 201,
                message: "Creating a new booking successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Creating a new booking failed.",
                error: error instanceof Error ? error.message : 'Creating a new booking failed.'
            });
        }
    }
}