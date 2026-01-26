import { refundDetailType, refundDTOType, refundEntityType } from "../entity/refund";
import { RefundRepositoryPort } from "../ports/refundRepositoryPort";

export class RefundService {
    constructor(private refundRepositoryPort: RefundRepositoryPort) {}

    findAllRefund(): Promise<refundEntityType[]> {
        return this.refundRepositoryPort.findAllRefund();
    }

    findRefundDetail(bookingId: string): Promise<refundDetailType> {
        return this.refundRepositoryPort.findRefundDetail(bookingId);
    }

    updateRefund(bookingId: string, refundDTO: refundDTOType): Promise<refundDetailType> {
        return this.refundRepositoryPort.updateRefund(bookingId, refundDTO);
    }
}