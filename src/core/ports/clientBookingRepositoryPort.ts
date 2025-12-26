import { Request } from "express";
import { bookingEntity, mytripEntityType } from "../entity/clientBooking";

export interface BookingRepositoryPort {
    createNewBooking(booking: bookingEntity): Promise<bookingEntity>;
    myTrip(page: "upcoming" | "cancaled" | "completed", userId: string, req: Request): Promise<mytripEntityType[] | null>;
}