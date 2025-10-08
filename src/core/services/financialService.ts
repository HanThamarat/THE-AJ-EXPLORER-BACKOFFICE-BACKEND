import { omiseFinancialEntity } from "../entity/financial";
import { FinancialRepositoryPort } from "../ports/financialRopositoryPort";

export class FinancialService {
    constructor(private readonly financialRepositoryPort: FinancialRepositoryPort) {}

    balance(): Promise<omiseFinancialEntity> {
        return this.financialRepositoryPort.balance();
    } 
}