import { chargeDTO, omiseChargeEntity, omiseFinancialEntity, OmiseRefundEntiry, RefundDTO } from "../../../core/entity/financial";
import { FinancialRepositoryPort } from "../../../core/ports/financialRopositoryPort";
import { prisma } from "../../database/data-source";
import omise from "../../database/omise";
import { CurrencyConvert } from "../../helpers/currencyConvertion";
import { transporterMailer } from "../../helpers/nodemailer";
import { GroupBookingSumary, NormalBookingSumary } from "../../helpers/templetes/book";

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

    async generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity> {

        const reCheckBooking = await prisma.booking.findFirst({
            where: {
                bookingId: chargeDTO.bookingId,
            },
            select: {
                paymentStatus: true,
                paymentRef: true,
                amount: true,
                messageSend: true,
            }
        });

        if (!reCheckBooking) throw new Error("Don't have a booking in system, please try again later.");

        if (reCheckBooking.paymentStatus !== "panding") throw new Error(`This booking ${reCheckBooking.paymentStatus}`);

        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        const expiresAtISO = now.toISOString();
        const mergeAmout = Number(`${reCheckBooking.amount}00`);
        
        const source = await omise.sources.create({
            amount: mergeAmout,
            currency: 'thb',
            type: 'promptpay'
        });     
        
        if (reCheckBooking.paymentRef === null) {
            const charge = await omise.charges.create({
                expires_at: expiresAtISO,
                amount: mergeAmout,
                currency: 'thb',
                source: source.id,
                description: `Booking payment for ${chargeDTO.bookingId}`,
                metadata: {
                    booking_id: chargeDTO.bookingId
                },
                return_uri: 'https://yourdomain.com/payment/complete',
            });

            if (charge) {
                await prisma.booking.update({
                    where: {
                        bookingId: chargeDTO.bookingId
                    },
                    data: {
                        paymentRef: charge.id
                    }
                });
            }

            return charge as omiseChargeEntity;
        }

        const chargeData = await omise.charges.retrieve(reCheckBooking.paymentRef);

        if (chargeData.paid === true && reCheckBooking.messageSend === false) {
            const bookingData = await prisma.booking.findFirst({
                where: {
                    bookingId: chargeDTO.bookingId
                },
                select: {
                    id: true,
                    bookingId: true,
                    adultPrice: true,
                    adultQty: true,
                    childPrice: true,
                    childQty: true,
                    amount: true,
                    groupPrice: true,
                    groupQty: true,
                    paymentStatus: true,
                    bookingStatus: true,
                    packageId: true,
                    additionalDetail: true,
                    pickupLocation: true,
                    pickup_lat: true,
                    pickup_lgn: true,
                    trip_at: true,
                    policyAccept: true,
                    booker: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            country: true,
                            phoneNumber: true,
                            userId: true,
                        }
                    }
                }
            });

            await prisma.booking.update({
                where: {
                    bookingId: chargeDTO.bookingId
                },
                data: {
                    paymentStatus: "paid"
                }
            });

            if (bookingData?.adultPrice || bookingData?.childPrice) {
                const bookedMail = await transporterMailer.sendMail({
                    from: "The Aj Explorer Support.",
                    to: bookingData.booker.email as string,
                    subject: `Booking #${bookingData.bookingId}`,
                    text: `Your Booking (#${bookingData.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                    html: NormalBookingSumary(bookingData)
                });

                if (bookedMail.messageId) {
                    await prisma.booking.update({
                        where: {
                            bookingId: bookingData.bookingId
                        },
                        data: {
                            messageSend: true,
                            messageId: bookedMail.messageId,
                        }
                    });
                }
            }

            if (bookingData?.groupPrice) {
                const bookedMail = await transporterMailer.sendMail({
                    from: "The Aj Explorer Support.",
                    to: bookingData.booker.email as string,
                    subject: `Booking #${bookingData.bookingId}`,
                    text: `Your Booking (#${bookingData.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                    html: GroupBookingSumary(bookingData)
                });

                if (bookedMail.messageId) {
                    await prisma.booking.update({
                        where: {
                            bookingId: bookingData.bookingId
                        },
                        data: {
                            messageSend: true,
                            messageId: bookedMail.messageId
                        }
                    });
                }
            }
        }

        if (chargeData.failure_message !== null) {
            await prisma.booking.update({
                where: {
                    bookingId: chargeDTO.bookingId
                },
                data: {
                    paymentStatus: "failed"
                }
            });
        }

        return chargeData as omiseChargeEntity;
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