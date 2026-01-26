import { refundDetailType } from "../../../core/entity/refund";
import { prisma } from "../data-source";

export class RefundQuery {
    static async findRefundDetail(bookingId: string): Promise<refundDetailType> {
        const result = await prisma.cancalationBooking.findFirst({
            where: {
                bookingId: bookingId,
                cancelStatus: 'confirmed'
            },
            select: {
                toBooking: {
                    select: {
                        bookingId: true,
                        paymentMethod: true,
                        paymentStatus: true,
                        amount: true,
                        booker: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        },
                        ToPackage: {
                            select: {
                                packageName: true
                            }
                        },
                        toRefund: {
                            select: {
                                refundPercentage: true,
                                refundStatus: true,
                                amount: true,
                                toUserBankAcc: {
                                    select: {
                                        accountFirstName: true,
                                        accountLastNaem: true,
                                        accountNumber: true,
                                        toBanking: {
                                            select: {
                                                bankNameEn: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!result) throw new Error("Have something wrong in finding information, Please try again later.");

        const resulutFormat: refundDetailType = {
            bookingId: result.toBooking.bookingId,
            bookerName: `${result.toBooking.booker.firstName} ${result.toBooking.booker.lastName}`,
            packageName: result.toBooking.ToPackage.packageName as string,
            paymentMethod: result.toBooking.paymentMethod,
            paymentStatus: result.toBooking.paymentStatus,
            amount: result.toBooking.amount,
            refundStatus: result.toBooking.toRefund[0].refundStatus,
            refundPercentahe: result.toBooking.toRefund[0].refundPercentage,
            refundAmount: Number(result.toBooking.toRefund[0].amount),
            bankInfo: {
                bankName: result.toBooking.toRefund[0].toUserBankAcc?.toBanking.bankNameEn ? result.toBooking.toRefund[0].toUserBankAcc?.toBanking.bankNameEn : "no data",
                accountFirstName: result.toBooking.toRefund[0].toUserBankAcc?.accountFirstName ? result.toBooking.toRefund[0].toUserBankAcc.accountFirstName : "no data",
                accountLastName: result.toBooking.toRefund[0].toUserBankAcc?.accountLastNaem ? result.toBooking.toRefund[0].toUserBankAcc.accountLastNaem : "no data",
                accountNumber: result.toBooking.toRefund[0].toUserBankAcc?.accountNumber ? result.toBooking.toRefund[0].toUserBankAcc.accountNumber : "no data",
            }
        };

        return resulutFormat;
    }
}