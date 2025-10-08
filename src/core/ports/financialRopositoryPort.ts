import { omiseFinancialEntity } from "../entity/financial";

export interface FinancialRepositoryPort {
    balance(): Promise<omiseFinancialEntity>;
}