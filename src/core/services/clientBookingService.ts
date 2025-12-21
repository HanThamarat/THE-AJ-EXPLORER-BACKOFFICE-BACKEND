import { bookingEntity } from "../entity/clientBooking";
import { BookingRepositoryPort } from "../ports/clientBookingRepositoryPort";

export class BookingService {
    constructor(private readonly bookingRepositoryPort: BookingRepositoryPort) {}

    createNewBooking(booking: bookingEntity): Promise<bookingEntity> {
        return this.bookingRepositoryPort.createNewBooking(booking);
    }
}