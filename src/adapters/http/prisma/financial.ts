import { omiseChargeEntity, omiseFinancialEntity, OmiseRefundEntiry, RefundDTO } from "../../../core/entity/financial";
import { FinancialRepositoryPort } from "../../../core/ports/financialRopositoryPort";
import omise from "../../database/omise";
import { CurrencyConvert } from "../../helpers/currencyConvertion";

export class FinancialORM implements FinancialRepositoryPort {
    async balance(): Promise<omiseFinancialEntity> {
        const balance = await omise.balance.retrieve();

        const balanceFormatter: omiseFinancialEntity = {
            object: balance.object,
            location: balance.location,
            livemode: balance.livemode,
            currency: balance.currency,
            total: CurrencyConvert.formatAsThb(balance.total),
            transferable: CurrencyConvert.formatAsThb(balance.transferable),
            reserve: balance.reserve,
            created_at: balance.created_at
        };

        return balanceFormatter as omiseFinancialEntity;
    }

    async findChargesById(chargesId: string): Promise<omiseChargeEntity> {
        const chargeData = await omise.charges.retrieve(chargesId);

        return chargeData as omiseChargeEntity;
    }

    // create refund function
    async createRefund(RefundDTO: RefundDTO): Promise<OmiseRefundEntiry> {
        try {
            const chargeRefund = await omise.charges.createRefund(RefundDTO.chargesId,
                    {
                        amount: RefundDTO.amount,
                        metadata: {
                            booking_id: RefundDTO.booking_id,
                        },
                    }
            );

            return chargeRefund as OmiseRefundEntiry;
        } catch (error: any) {
            throw new Error(error.message || "Failed to create refund");
        }
    }
}