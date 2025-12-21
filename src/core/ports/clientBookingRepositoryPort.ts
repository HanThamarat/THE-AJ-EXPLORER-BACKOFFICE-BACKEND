import { bookingEntity } from "../entity/clientBooking";

export interface BookingRepositoryPort {
    createNewBooking(booking: bookingEntity): Promise<bookingEntity>;
}