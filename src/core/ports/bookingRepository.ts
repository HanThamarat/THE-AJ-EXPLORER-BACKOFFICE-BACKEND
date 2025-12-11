import { bkEntity, bookingAvgEntity } from "../entity/booking";

export interface BkRepositortPort {
    findAllBooking(): Promise<bkEntity[]>;
    findBookingAvg(type: 'Weekly' | 'Monthly' | 'Yearly'): Promise<bookingAvgEntity>;
}