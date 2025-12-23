import { bookingEntity } from "../entity/clientBooking";
import { omiseChargeEntity } from "../entity/financial";
import { BookingByCardDTOType, chargeDTO } from "../entity/payment";

export interface PaymentRepositoryPort {
    createBookingByCard(bookingDTO: BookingByCardDTOType): Promise<bookingEntity>;
    generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity>;
}