import { bookingEntity } from "../entity/booking";
import { BookingRepositoryPort } from "../ports/bookingRepositoryPort";

export class BookingService {
    constructor(private readonly bookingRepositoryPort: BookingRepositoryPort) {}

    // createNewBooking(booking: bookingEntity): Promise<bookingEntity> {
    //     return this.bookingRepositoryPort.createNewBooking(booking);
    // }
}