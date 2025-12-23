import { bookingEntity } from "../entity/clientBooking";
import { omiseChargeEntity } from "../entity/financial";
import { BookingByCardDTOType, chargeDTO } from "../entity/payment";
import { PaymentRepositoryPort } from "../ports/paymentRepositoryPort";

export class PaymentService {
    constructor(private readonly paymentRepositoryPort: PaymentRepositoryPort) {}

    async createBookingByCard(bookingDTO: BookingByCardDTOType): Promise<bookingEntity> {
        return this.paymentRepositoryPort.createBookingByCard(bookingDTO);
    }

    async generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity> {
        return this.paymentRepositoryPort.generateQr(chargeDTO);
    }
}