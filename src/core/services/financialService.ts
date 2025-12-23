import { omiseChargeEntity, omiseFinancialEntity, RefundDTO, OmiseRefundEntiry } from "../entity/financial";
import { FinancialRepositoryPort } from "../ports/financialRopositoryPort";

export class FinancialService {
    constructor(private readonly financialRepositoryPort: FinancialRepositoryPort) {}

    balance(): Promise<omiseFinancialEntity> {
        return this.financialRepositoryPort.balance();
    } 


    findChargesById(chargesId: string): Promise<omiseChargeEntity> {
        return this.financialRepositoryPort.findChargesById(chargesId);
    }

    createRefund(refundDTO: RefundDTO): Promise<OmiseRefundEntiry> {
        return this.financialRepositoryPort.createRefund(refundDTO);
    }
}