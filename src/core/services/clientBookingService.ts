import { Request } from "express";
import { bookingEntity, bookingInfoType, mytripEntityType, cancelBookingResponseType, cancelBookingType } from "../entity/clientBooking";
import { BookingRepositoryPort } from "../ports/clientBookingRepositoryPort";

export class BookingService {
    constructor(private readonly bookingRepositoryPort: BookingRepositoryPort) {}

    createNewBooking(booking: bookingEntity): Promise<bookingEntity> {
        return this.bookingRepositoryPort.createNewBooking(booking);
    }

    myTrip(page: "upcoming" | "cancaled" | "completed", userId: string, req: Request): Promise<mytripEntityType[] | null> {
        return this.bookingRepositoryPort.myTrip(page, userId, req);
    }

    bookingDetail(bookingId: string, userId: string): Promise<bookingInfoType> {
        return this.bookingRepositoryPort.bookingDetail(bookingId, userId);
    }

    getBookConfirmation(userId: string, bookingId: string): Promise<string> {
        return this.bookingRepositoryPort.getBookConfirmation(userId, bookingId);
    }

    cancelBooking(cancelDTO: cancelBookingType): Promise<cancelBookingResponseType> {
        return this.bookingRepositoryPort.cancelBooking(cancelDTO);
    }    
}