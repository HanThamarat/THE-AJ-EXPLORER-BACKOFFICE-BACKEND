import { bookingEntity } from "../entity/clientBooking";
import { omiseChargeEntity } from "../entity/financial";
import { BookingByCardDTOType, chargeDTO, createMobileBankChargeType } from "../entity/payment";

export interface PaymentRepositoryPort {
    createBookingByCard(bookingDTO: BookingByCardDTOType): Promise<bookingEntity>;
    generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity>;
    createBookWithMbBank(chardDTO: createMobileBankChargeType): Promise<omiseChargeEntity>;
    omiseWebhook(event_name: string, data: any): Promise<omiseChargeEntity | null>;
}