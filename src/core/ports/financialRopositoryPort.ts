import { omiseFinancialEntity, OmiseRefundEntiry, RefundDTO } from "../entity/financial";
import { omiseChargeEntity } from "../entity/financial";

export interface FinancialRepositoryPort {
    balance(): Promise<omiseFinancialEntity>;
    findChargesById(chargesId: string): Promise<omiseChargeEntity>;
    createRefund(RefundDTO: RefundDTO): Promise<OmiseRefundEntiry>;
}