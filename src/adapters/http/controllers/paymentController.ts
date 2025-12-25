import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { BookingByCardDTOType, chargeDTO, createMobileBankChargeSchema, createMobileBankChargeType } from "../../../core/entity/payment";
import { PaymentService } from "../../../core/services/paymentService";
import { Ecrypt } from "../../helpers/encrypt";

export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    async createBookingCard(req: Request, res: Response) {
        try {
            const {
                childPrice, childQty, adultPrice, adultQty,
                groupPrice, groupQty, amount, additionalDetail, locationId,
                pickup_lat, pickup_lgn, trip_at, policyAccept, packageId, contractBooking, pickupLocation, card
            } = req.body as BookingByCardDTOType;

            const userInfo = await Ecrypt.JWTClientDecrypt(req);
            const userId = userInfo?.id;

            const bookingData: BookingByCardDTOType = {
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
                packageId : Number(packageId), 
                contractBooking: {
                    userId: userId,
                    firstName: contractBooking.firstName,
                    lastName: contractBooking.lastName,
                    email: contractBooking.email,
                    country: contractBooking.country,
                    phoneNumber: contractBooking.phoneNumber
                }, 
                pickupLocation, 
                card
            };

            const response = await this.paymentService.createBookingByCard(bookingData);

            return setResponse({
                res: res,
                statusCode: 201,
                message: "Creating a booking by card successfully.",
                body: response
            })
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Creating a booking by card failed.",
                error: error instanceof Error ? error.message : 'Creating a booking by card failed.'
            });
        }
    }

    async generateQr(req: Request, res: Response) {
        try {
            const { bookingId } = req.body as chargeDTO;
            const userInfo = await Ecrypt.JWTClientDecrypt(req);
            const userId = userInfo?.id;

            const chargeDATA: chargeDTO = {
                bookingId,
                userId
            }

            const response = await this.paymentService.generateQr(chargeDATA);

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

    async createBookWithMbBank(req: Request, res: Response) {
        try {
            const { bank, bookingId } = req.body as createMobileBankChargeType;
            const userInfo = await Ecrypt.JWTClientDecrypt(req);
            const userId = userInfo?.id;

            const chargeDATA: createMobileBankChargeType = {
                bank,
                bookingId,
                userId
            }

            const response = await this.paymentService.createBookWithMbBank(chargeDATA);

            return setResponse({
                res: res,
                message: "Create charge with mobile_banking successfully.",
                statusCode: 200,
                body: response
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Create charge with mobile_banking failed.",
                error: err instanceof Error ? err.message : 'Create charge with mobile_banking failed.',
                statusCode: 500
            });
        }
    }
}