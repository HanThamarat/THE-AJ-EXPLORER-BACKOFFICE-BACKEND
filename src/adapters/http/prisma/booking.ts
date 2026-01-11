import { bkEntity, bookingAvgDataType, bookingAvgEntity, bookingDetailEntityType, bookingDetailDTOType } from "../../../core/entity/booking";
import { BkRepositortPort } from "../../../core/ports/bookingRepository";
import { prisma } from "../../database/data-source";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
dayjs.extend(weekday)

export class BkDataSource implements BkRepositortPort {
    constructor(private db: typeof prisma) {}

    async findAllBooking(): Promise<bkEntity[]> {
        const bkresult = await this.db.booking.findMany({
            orderBy: {
                id: 'desc'
            },
            select: {
                id: true,
                bookingId: true,
                paymentRef: true,
                bookingStatus: true,
                paymentStatus: true,
                trip_at: true,
                created_at: true,
                updated_at: true,
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
        });

        const resultFormat: bkEntity[] = bkresult.map((data) => ({
            id: data.id,
            packageName: data.ToPackage.packageName,
            bookingId: data.bookingId,
            name: `${data.booker.firstName} ${data.booker.lastName}`,
            paymentRef: data.paymentRef,
            paymentStatus: data.paymentStatus,
            bookingStatus: data.bookingStatus,
            trip_at: data.trip_at,
            created_at: data.created_at,
            updated_at: data.updated_at,
        }));

        return resultFormat;
    }

    async findBookingAvg(type: "Weekly" | "Monthly" | "Yearly"): Promise<bookingAvgEntity> {

        let dataAvg: bookingAvgDataType[] = []; 

        if (type === 'Weekly') {
            const weekName: Array<string> = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            
            for (let i = 0; i < weekName.length; i++) {
                const startOfDay = dayjs().day(i).startOf('day').toDate();
                const endOfDay = dayjs().day(i).endOf('day').toDate();

                const getBookingAvg = await prisma.booking.count({
                    where: {
                       created_at: {
                            gte: startOfDay,
                            lte: endOfDay,
                        }
                    }
                });

                dataAvg.push({
                    name: weekName[i],
                    avg: getBookingAvg,
                })
            }            
        }

        if (type === "Monthly") {
            const monthName: Array<string> = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

            for (let i = 0; i < monthName.length; i++) {
                const startOfMonth = dayjs().month(i).startOf('month').toDate();
                const endOfMonth = dayjs().month(i).endOf('month').toDate();

                const getBookingAvg = await prisma.booking.count({
                    where: {
                       created_at: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        }
                    }
                });

                dataAvg.push({
                    name: monthName[i],
                    avg: getBookingAvg,
                })
            }    
        }

        if (type === "Yearly") {
            const findYearly: any = await prisma.$queryRaw`
                  SELECT 
                    EXTRACT(YEAR FROM "created_at") as year, 
                    COUNT(*)::int as count 
                FROM "Booking" 
                GROUP BY year 
                ORDER BY year ASC;
            `;
            
            for (const yearlyAvg of findYearly) {
                dataAvg.push ({
                    name: yearlyAvg.year as string,
                    avg: yearlyAvg.count as number
                });
            }
        }
        
        const resFormat: bookingAvgEntity = {
            type: type,
            data: dataAvg
        }

        return resFormat;
    }

    async findBookingDetail(bookingId: string): Promise<bookingDetailEntityType> {
        const bookingResult = await prisma.booking.findFirst({
            where: {
                bookingId: bookingId,
            },
            select: {
                bookingId: true,
                ToPackage: {
                    select: {
                        packageName: true,
                    }
                },
                amount: true,
                pickupLocation: true,
                paymentStatus: true,
                bookingStatus: true,
                booker: {
                    select: {
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                        email: true,
                        country: true
                    }
                }
            }
        });

        if (!bookingResult) throw new Error("This booking id not found in the system, Please try again.");


        const resultFormat: bookingDetailEntityType = {
            bookingId: bookingResult.bookingId,
            packageName: bookingResult.ToPackage.packageName as string,
            amount: bookingResult.amount,
            pickUpLocation: bookingResult.pickupLocation as string,
            paymentStatus: bookingResult.paymentStatus,
            bookingStatus: bookingResult.bookingStatus,
            booker: bookingResult.booker
        };

        return resultFormat;
    }

    async updateBookingStatus(bookingId: string, bookingStatus: "panding" | "confirmed" | "failed"): Promise<bookingDetailEntityType> {
        const recheckBooking = await this.db.booking.count({
            where: {
                bookingId: bookingId
            }
        });

        if (recheckBooking === 0) throw new Error("This booking id don't have in the system, please try again later.");

        const updateBookingStatus = await this.db.booking.update({
            where: {
                bookingId: bookingId
            },
            data: {
                bookingStatus: bookingStatus,
            },
            select: {
                bookingId: true,
                ToPackage: {
                    select: {
                        packageName: true,
                    }
                },
                amount: true,
                pickupLocation: true,
                paymentStatus: true,
                bookingStatus: true,
                booker: {
                    select: {
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                        email: true,
                        country: true
                    }
                }
            }
        });

        if (!updateBookingStatus) throw new Error("Updating booking status something wrong, please try again later.");

        const resultFormat: bookingDetailEntityType = {
            bookingId: updateBookingStatus.bookingId,
            packageName: updateBookingStatus.ToPackage.packageName as string,
            amount: updateBookingStatus.amount,
            pickUpLocation: updateBookingStatus.pickupLocation as string,
            paymentStatus: updateBookingStatus.paymentStatus,
            bookingStatus: updateBookingStatus.bookingStatus,
            booker: updateBookingStatus.booker
        };

        return resultFormat;
    }

    async updateBookingDetail(bookingId: string, bookingDTO: bookingDetailDTOType): Promise<bkEntity> {
        const recheckBookingId = await this.db.booking.findFirst({
            where: {
                bookingId: bookingId
            },
            select: {
                ContractBookingId: true,
                bookingId: true
            }
        });        

        if (!recheckBookingId) throw new Error("This booking id not found in the systems, please try again later.");

        const updateBooking = await this.db.$transaction(async (tx) => {
           
            await tx.contractBooking.update({
                where: {
                    id: recheckBookingId.ContractBookingId
                },
                data: {
                    firstName: bookingDTO.firstName,
                    lastName: bookingDTO.lastName,
                    country: bookingDTO.country,
                    email: bookingDTO.email,
                    phoneNumber: bookingDTO.phoneNumber,
                }
            })

            const updateBookingInfo = await tx.booking.update({
                where: {
                    bookingId: recheckBookingId.bookingId
                },
                data: {
                    pickupLocation: bookingDTO.pickupLocation,
                    trip_at: dayjs(bookingDTO.trip_at).format(),
                    additionalDetail: bookingDTO.specialRequirement
                },
                select: {
                    id: true,
                    bookingId: true,
                    paymentRef: true,
                    bookingStatus: true,
                    paymentStatus: true,
                    ContractBookingId: true,
                    trip_at: true,
                    created_at: true,
                    updated_at: true,
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
            });

            return updateBookingInfo;
        });

        if (!updateBooking) throw new Error("Updating booking infomation something wrong, please try again later.");

        const resultFormat: bkEntity = {
            id: updateBooking.id,
            packageName: updateBooking.ToPackage.packageName,
            bookingId: updateBooking.bookingId,
            name: `${updateBooking.booker.firstName} ${updateBooking.booker.lastName}`,
            paymentRef: updateBooking.paymentRef,
            paymentStatus: updateBooking.paymentStatus,
            bookingStatus: updateBooking.bookingStatus,
            trip_at: updateBooking.trip_at,
            created_at: updateBooking.created_at,
            updated_at: updateBooking.updated_at,
        };

        return resultFormat;
    }
}