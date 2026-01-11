import { bkEntity, bookingAvgEntity, bookingDetailDTOType, bookingDetailEntityType } from "../entity/booking";

export interface BkRepositortPort {
    findAllBooking(): Promise<bkEntity[]>;
    findBookingAvg(type: 'Weekly' | 'Monthly' | 'Yearly'): Promise<bookingAvgEntity>;
    findBookingDetail(bookingId: string): Promise<bookingDetailEntityType>;
    updateBookingStatus(bookingId: string, bookingStatus: "panding" | "confirmed" | "failed"): Promise<bookingDetailEntityType>;
    updateBookingDetail(bookingId: string, bookingDTO: bookingDetailDTOType): Promise<bkEntity>;
}