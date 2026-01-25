import { cancelDetailEntityType, cancelDTOType, cancelEntityType } from "../../../core/entity/cancel";
import { CancelRepositoryPort } from "../../../core/ports/cancelRepositoryPort";
import { prisma } from "../../database/data-source";

export class CancelDataSource implements CancelRepositoryPort {

    async findAllCancel(): Promise<cancelEntityType[]> {
        const response = await prisma.cancalationBooking.findMany({
            orderBy: {
                updated_at: 'desc'
            },
            select: {
                bookingId: true,
                cancelStatus: true,
                toBooking: {
                    select: {
                        bookingId: true,
                        amount: true,
                        paymentStatus: true,
                        trip_at: true,
                        toRefund: {
                            select: {
                                refundPercentage: true,
                                amount: true,
                            }
                        },
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
                        }
                    }
                }
            }
        });

        const responseFormat: cancelEntityType[] = response.map((item) => ({
            bookingId: item.bookingId,
            bookerName: `${item.toBooking.booker.firstName} ${item.toBooking.booker.lastName}`,
            packageName: item.toBooking.ToPackage.packageName as string,
            paymentStatus: item.toBooking.paymentStatus,
            cancelStatus: item.cancelStatus,
            amount: item.toBooking.amount,
            refundAmount: Number(item.toBooking.toRefund[0].amount),
            refundPercentage: item.toBooking.toRefund[0].refundPercentage,
            trip_at: item.toBooking.trip_at
        }));

        return responseFormat;
    }

    async findCancelDetail(bookingId: string): Promise<cancelDetailEntityType> {
        const recheckCancel = await prisma.cancalationBooking.findFirst({
            where: {
                bookingId: bookingId
            },
            select: {
                id: true
            }
        });
        
        if (!recheckCancel) throw new Error("This booking id not found in the system.");

        const result = await prisma.cancalationBooking.findFirst({
            where: {
                bookingId: bookingId
            },
            select: {
                bookingId: true,
                cancelStatus: true,
                toBooking: {
                    select: {
                        bookingId: true,
                        amount: true,
                        paymentStatus: true,
                        trip_at: true,
                        pickupLocation: true,
                        toRefund: {
                            select: {
                                refundPercentage: true,
                                amount: true,
                            }
                        },
                        booker: {
                            select: {
                                firstName: true,
                                lastName: true,
                                email: true,
                                phoneNumber: true,
                            }
                        },
                        ToPackage: {
                            select: {
                                packageName: true
                            }
                        }
                    }
                }
            }
        });

        if (!result) throw new Error("Finding booking detail have something wrong.");

        const responseFormat: cancelDetailEntityType = {
            bookingId: result.bookingId,
            bookerName: `${result.toBooking.booker.firstName} ${result.toBooking.booker.lastName}`,
            email: result.toBooking.booker.email,
            phoneNumber: result.toBooking.booker.phoneNumber,
            pickupPoint: result.toBooking.pickupLocation as string,
            packageName: result.toBooking.ToPackage.packageName as string,
            paymentStatus: result.toBooking.paymentStatus,
            cancelStatus: result.cancelStatus,
            amount: result.toBooking.amount,
            refundAmount: Number(result.toBooking.toRefund[0].amount),
            refundPercentage: result.toBooking.toRefund[0].refundPercentage,
            trip_at: result.toBooking.trip_at
        };

        return responseFormat;
    }

    async updateCancel(bookingId: string, cancelDTO: cancelDTOType): Promise<cancelEntityType> {
        const recheckCancel = await prisma.cancalationBooking.findFirst({
            where: {
                bookingId: bookingId
            },
            select: {
                id: true
            }
        });

        if (!recheckCancel) throw new Error("This booking id not found in the system.");

        const updateCancel = await prisma.cancalationBooking.update({
            where: {
                id: recheckCancel.id
            },
            data: {
                cancelStatus: cancelDTO.cancelStatus
            },
            select: {
                bookingId: true,
                cancelStatus: true,
                toBooking: {
                    select: {
                        bookingId: true,
                        amount: true,
                        paymentStatus: true,
                        trip_at: true,
                        toRefund: {
                            select: {
                                refundPercentage: true,
                                amount: true,
                            }
                        },
                        booker: {
                            select: {
                                firstName: true,
                                lastName: true
                            }
                        },
                        ToPackage: {
                            select: {
                                packageName: true
                            }
                        }
                    }
                }
            }
        });

        if (!updateCancel) throw new Error("Have something wrong in updating cancel progess, please try again later.");

        const responseFormat: cancelEntityType = {
            bookingId: updateCancel.bookingId,
            bookerName: `${updateCancel.toBooking.booker.firstName} ${updateCancel.toBooking.booker.lastName}`,
            packageName: updateCancel.toBooking.ToPackage.packageName as string,
            paymentStatus: updateCancel.toBooking.paymentStatus,
            cancelStatus: updateCancel.cancelStatus,
            amount: updateCancel.toBooking.amount,
            refundAmount: Number(updateCancel.toBooking.toRefund[0].amount),
            refundPercentage: updateCancel.toBooking.toRefund[0].refundPercentage,
            trip_at: updateCancel.toBooking.trip_at
        };

        return responseFormat;
    }
}