import { BookingService } from "../../../core/services/clientBookingService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { ClientBookingCreateBody, bookingEntity } from "../../../core/entity/clientBooking";
import { Ecrypt } from "../../helpers/encrypt";

export class BookingContorller {
    constructor(private bookingService: BookingService) {}

    async createBooking(req: Request, res: Response) {
        try {
            const {
                childPrice, childQty, adultPrice, adultQty,
                groupPrice, groupQty, amount, additionalDetail, locationId,
                pickup_lat, pickup_lgn, trip_at, policyAccept, packageId, contractBooking, pickupLocation
            } = req.body as ClientBookingCreateBody;

            const bookData: bookingEntity = {
                contractBooking,
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
                pickupLocation,
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

    async findmytrip(req: Request, res: Response) {
        try {
            const { page } = req.query as { page: "upcoming" | "cancaled" | "completed" };
            const userInfo = await Ecrypt.JWTClientDecrypt(req);
            const userId = userInfo?.id;

            const response = await this.bookingService.myTrip(page, userId as string, req);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding my trip successfully.",
                body: response,
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding my trip failed.",
                error: error instanceof Error ? error.message : 'Finding my trip failed.'
            });
        }
    }
}