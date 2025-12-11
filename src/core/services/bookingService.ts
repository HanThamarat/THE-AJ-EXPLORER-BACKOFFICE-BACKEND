import { bkEntity, bookingAvgEntity } from "../entity/booking";
import { BkRepositortPort } from "../ports/bookingRepository";

export class BkService {
    constructor(private readonly bkRepositoryPort: BkRepositortPort) {}

    async findAllBooking(): Promise<bkEntity[]> {
        return this.bkRepositoryPort.findAllBooking();
    }

    async findBookingAvg(type: 'Weekly' | 'Monthly' | 'Yearly'): Promise<bookingAvgEntity> {
        return this.bkRepositoryPort.findBookingAvg(type);
    }
}