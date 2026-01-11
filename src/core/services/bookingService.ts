import { bkEntity, bookingAvgEntity, bookingDetailDTOType, bookingDetailEntityType } from "../entity/booking";
import { BkRepositortPort } from "../ports/bookingRepository";

export class BkService {
    constructor(private readonly bkRepositoryPort: BkRepositortPort) {}

    async findAllBooking(): Promise<bkEntity[]> {
        return this.bkRepositoryPort.findAllBooking();
    }

    async findBookingAvg(type: 'Weekly' | 'Monthly' | 'Yearly'): Promise<bookingAvgEntity> {
        return this.bkRepositoryPort.findBookingAvg(type);
    }

    async findBookingDetail(bookingId: string): Promise<bookingDetailEntityType> {
        return this.bkRepositoryPort.findBookingDetail(bookingId);
    }

    async updateBookingStatus(bookingId: string, bookingStatus: "panding" | "confirmed" | "failed"): Promise<bookingDetailEntityType> {
        return this.bkRepositoryPort.updateBookingStatus(bookingId, bookingStatus);
    }

    async updateBookingDetail(bookingId: string, bookingDTO: bookingDetailDTOType): Promise<bkEntity> {
        return this.bkRepositoryPort.updateBookingDetail(bookingId, bookingDTO);
    }
}