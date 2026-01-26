import { refundDetailType, refundDTOType, refundEntityType } from "../../../core/entity/refund";
import { RefundRepositoryPort } from "../../../core/ports/refundRepositoryPort";
import { prisma } from "../../database/data-source";
import omise from "../../database/omise";
import { RefundQuery } from "../../database/querys/refund";
import dayjs from "dayjs";

export class RefundDataSource implements RefundRepositoryPort {

    async findAllRefund(): Promise<refundEntityType[]> {
        const result = await prisma.cancalationBooking.findMany({
            where: {
                cancelStatus: "confirmed"
            },
            orderBy: {
                updated_at: "desc",
            },
            select: {
                toBooking: {
                    select: {
                        bookingId: true,
                        amount: true,
                        paymentStatus: true,
                        ToPackage: {
                            select: {
                                packageName: true,
                            }
                        },
                        booker: {
                            select: {
                                firstName: true,
                                lastName: true,
                            }
                        },
                        toRefund: {
                            select: {
                                refundPercentage: true,
                                refundStatus: true,
                                amount: true
                            }
                        },
                    }
                }
            }
        });

        const responseFormat: refundEntityType[] = result.map((item) => ({
            bookingId: item.toBooking.bookingId,
            bookerName: `${item.toBooking.booker.firstName} ${item.toBooking.booker.lastName}`,
            packageName: item.toBooking.ToPackage.packageName as string,
            paymentStatus: item.toBooking.paymentStatus,
            refundStatus: item.toBooking.toRefund[0].refundStatus,
            amount: Number(item.toBooking.amount),
            refundPercentahe: item.toBooking.toRefund[0].refundPercentage,
            refundAmount: Number(item.toBooking.toRefund[0].amount)
        }));

        return responseFormat;
    }

    async findRefundDetail(bookingId: string): Promise<refundDetailType> {
        
        const recheckRefund = await prisma.cancalationBooking.findFirst({
            where: {
                bookingId: bookingId,
            },
            select: {
                cancelStatus: true,
            }
        });

        if (!recheckRefund) throw new Error("This booking id not found in the systems.");

        if (recheckRefund.cancelStatus !== "confirmed") throw new Error(`Please recheck cancelation progress, cancel status in ${recheckRefund.cancelStatus}`);

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

    async updateRefund(bookingId: string, refundDTO: refundDTOType): Promise<refundDetailType> {

        const recheckRefund = await prisma.cancalationBooking.findFirst({
            where: {
                bookingId: bookingId,
            },
            select: {
                cancelStatus: true,
                toBooking: {
                    select: {
                        paymentRef: true,
                    }
                }
            }
        });

        if (!recheckRefund) throw new Error("This booking id not found in the systems.");

        if (recheckRefund.cancelStatus !== "confirmed") throw new Error(`Please recheck cancelation progress, cancel status in ${recheckRefund.cancelStatus}`);   

        if (!recheckRefund.toBooking.paymentRef) throw new Error("This booking id is not paid, can't refund");

        const chargeData = await omise.charges.retrieve(recheckRefund.toBooking.paymentRef);
        
        if (chargeData.card !== null) {
            if (refundDTO.refundStatus === "refunded") {
                const refundInfo = await prisma.refundBooking.findFirst({
                    where: {
                        bookingId: bookingId,
                    },
                    select: {
                        id: true,
                        amount: true,
                        bookingId: true,
                        refundStatus: true,
                    }
                });

                if (!refundInfo) throw new Error("Have something wrong in get refund info, please try again later.");

                if (refundInfo.refundStatus === "refunded") throw new Error("This booking id already refunded");

                const mergeAmout = Number(`${refundInfo.amount}00`);
                
                const refunded = await omise.charges.createRefund(recheckRefund.toBooking.paymentRef, {
                    amount: mergeAmout,
                    metadata: {
                        booking_id: bookingId
                    }
                });
                
                
                if (!refunded) throw new Error("Have something wrong in refunding progress.");

                const updateRefund = await prisma.refundBooking.update({
                    where: {
                        id: refundInfo.id 
                    },
                    data: {
                        refundStatus: "refunded",
                        refunded_at: dayjs().format(),
                        refundRef: refunded.id
                    }
                });

                if (!updateRefund) throw new Error("Have something wrong in update refund ststus.");

                const findRefundResponse = await RefundQuery.findRefundDetail(bookingId);

                return findRefundResponse;
            }
        }

        const refundInfo = await prisma.refundBooking.findFirst({
            where: {
                bookingId: bookingId,
            },
            select: {
                id: true,
                amount: true,
                bookingId: true,
                refundStatus: true,
            }
        });

        if (!refundInfo) throw new Error("Have something wrong in get refund info, please try again later.");

        if (refundInfo.refundStatus === "refunded") throw new Error("This booking id already refunded");

        const updateRefund = await prisma.refundBooking.update({
            where: {
                id: refundInfo.id 
            },
            data: {
                refundStatus: "refunded"
            }
        });

        if (!updateRefund) throw new Error("Have something wrong in update refund ststus.");

        const findRefundResponse = await RefundQuery.findRefundDetail(bookingId);

        return findRefundResponse;
    }
}