import { Request } from "express";
import { bookingEntity, bookingInfoType, mytripEntityType } from "../entity/clientBooking";

export interface BookingRepositoryPort {
    createNewBooking(booking: bookingEntity): Promise<bookingEntity>;
    myTrip(page: "upcoming" | "cancaled" | "completed", userId: string, req: Request): Promise<mytripEntityType[] | null>;
    bookingDetail(bookingId: string, userId: string): Promise<bookingInfoType>;
    getBookConfirmation(userId: string, bookingId: string): Promise<string>; 
}