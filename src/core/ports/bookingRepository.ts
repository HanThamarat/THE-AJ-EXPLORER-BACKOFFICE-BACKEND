import { bkEntity } from "../entity/booking";

export interface BkRepositortPort {
    findAllBooking(): Promise<bkEntity[]>;
}