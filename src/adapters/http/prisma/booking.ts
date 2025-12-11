import { bkEntity, bookingAvgDataType, bookingAvgEntity } from "../../../core/entity/booking";
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
}