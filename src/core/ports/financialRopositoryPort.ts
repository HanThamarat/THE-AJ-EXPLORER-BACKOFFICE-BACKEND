import { omiseFinancialEntity } from "../entity/financial";
import { chargeDTO, omiseChargeEntity } from "../entity/financial";

export interface FinancialRepositoryPort {
    balance(): Promise<omiseFinancialEntity>;
    generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity>;
    findChargesById(chargesId: string) : Promise<omiseChargeEntity>;
}