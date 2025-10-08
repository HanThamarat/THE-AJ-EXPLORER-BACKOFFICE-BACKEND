import { omiseFinancialEntity } from "../../../core/entity/financial";
import { FinancialRepositoryPort } from "../../../core/ports/financialRopositoryPort";
import omise from "../../database/omise";

export class FinancialORM implements FinancialRepositoryPort {
    async balance(): Promise<omiseFinancialEntity> {
        const balance = await omise.balance.retrieve();

        return balance as omiseFinancialEntity;
    }
}