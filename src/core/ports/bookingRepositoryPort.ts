import { bookingEntity } from "../entity/booking";

export interface BookingRepositoryPort {
    createNewBooking(booking: bookingEntity): Promise<bookingEntity>;
}