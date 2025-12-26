import { bookingEntity } from "../entity/clientBooking";
import { omiseChargeEntity } from "../entity/financial";
import { BookingByCardDTOType, chargeDTO, createMobileBankChargeType } from "../entity/payment";
import { PaymentRepositoryPort } from "../ports/paymentRepositoryPort";

export class PaymentService {
    constructor(private readonly paymentRepositoryPort: PaymentRepositoryPort) {}

    async createBookingByCard(bookingDTO: BookingByCardDTOType): Promise<bookingEntity> {
        return this.paymentRepositoryPort.createBookingByCard(bookingDTO);
    }

    async generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity> {
        return this.paymentRepositoryPort.generateQr(chargeDTO);
    }

    async createBookWithMbBank(chardDTO: createMobileBankChargeType): Promise<omiseChargeEntity> {
        return this.paymentRepositoryPort.createBookWithMbBank(chardDTO);
    }

    omiseWebhook(event_name: string, data: any): Promise<omiseChargeEntity | null> {
        return this.paymentRepositoryPort.omiseWebhook(event_name, data);
    }
}