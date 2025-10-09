import { chargeDTO, omiseChargeEntity, omiseFinancialEntity } from "../../../core/entity/financial";
import { FinancialRepositoryPort } from "../../../core/ports/financialRopositoryPort";
import omise from "../../database/omise";

export class FinancialORM implements FinancialRepositoryPort {
    async balance(): Promise<omiseFinancialEntity> {
        const balance = await omise.balance.retrieve();

        return balance as omiseFinancialEntity;
    }

    async generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity> {
        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        const expiresAtISO = now.toISOString();
        
        const source = await omise.sources.create({
            amount: chargeDTO.amount,
            currency: 'thb',
            type: 'promptpay'
        });       
    
        const charge = await omise.charges.create({
            expires_at: expiresAtISO,
            amount: chargeDTO.amount,
            currency: 'thb',
            source: source.id,
            description: `Booking payment for ${chargeDTO.bookingId}`,
            metadata: {
                booking_id: chargeDTO.bookingId
            },
            return_uri: 'https://yourdomain.com/payment/complete', // optional
        });

        return charge as omiseChargeEntity;
    }

    async findChargesById(chargesId: string): Promise<omiseChargeEntity> {
        const chargeData = await omise.charges.retrieve(chargesId);

        return chargeData as omiseChargeEntity;
    }
}