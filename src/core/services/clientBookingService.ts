import { Request } from "express";
import { bookingEntity, mytripEntityType } from "../entity/clientBooking";
import { BookingRepositoryPort } from "../ports/clientBookingRepositoryPort";

export class BookingService {
    constructor(private readonly bookingRepositoryPort: BookingRepositoryPort) {}

    createNewBooking(booking: bookingEntity): Promise<bookingEntity> {
        return this.bookingRepositoryPort.createNewBooking(booking);
    }

    myTrip(page: "upcoming" | "cancaled" | "completed", userId: string, req: Request): Promise<mytripEntityType[] | null> {
        return this.bookingRepositoryPort.myTrip(page, userId, req);
    }
}