import { bkEntity } from "../entity/booking";
import { BkRepositortPort } from "../ports/bookingRepository";

export class BkService {
    constructor(private readonly bkRepositoryPort: BkRepositortPort) {}

    findAllBooking(): Promise<bkEntity[]> {
        return this.bkRepositoryPort.findAllBooking();
    }
}