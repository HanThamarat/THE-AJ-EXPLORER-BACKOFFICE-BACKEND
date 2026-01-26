import { refundDetailType, refundDTOType, refundEntityType } from "../entity/refund";

export interface RefundRepositoryPort {
    findAllRefund(): Promise<refundEntityType[]>;
    findRefundDetail(bookingId: string): Promise<refundDetailType>;
    updateRefund(bookingId: string, refundDTO: refundDTOType): Promise<refundDetailType>;
}