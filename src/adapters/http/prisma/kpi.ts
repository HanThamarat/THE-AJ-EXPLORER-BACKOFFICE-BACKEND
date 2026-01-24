import { bookingAvgDataType } from "../../../core/entity/booking";
import { overviewEntityType, popularProviceType, qtyEntityType } from "../../../core/entity/kpi";
import { KPIRepositoryPort } from "../../../core/ports/kpiRepositoryPort";
import { prisma } from "../../database/data-source";
import dayjs from "dayjs";

export class KPIDataSource implements KPIRepositoryPort {

    async findPopularProvince(): Promise<popularProviceType[]> {
        const qtyResult: any = await prisma.$queryRaw`
            select pv.id as province_id, pv."nameEn" as province_name, count(pv.id) as qty
            from (("Booking" b left join packages p on b."packageId" = p.id)
                left join province pv on p."provinceId" = pv.id)
            where b."bookingStatus" = 'confirmed'
            group by pv.id order by qty desc limit 5
        `;

        const resultFormat: popularProviceType[] = qtyResult.map((item: any) => ({
            provinceId: item.province_id,
            provinceName: item.province_name,
            qty: Number(item.qty)
        }));

        return resultFormat;
    }

    async findTotalBooking(): Promise<qtyEntityType> {

        const currentMonth = dayjs().month();
        const startOfMonth = dayjs().month(currentMonth).startOf('month').toDate();
        const endOfMonth = dayjs().month(currentMonth).endOf('month').toDate();

        const result = await prisma.booking.count({
            where: {
                paymentStatus: "paid",
                created_at: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                }
            }
        });

        return {
            qty: result,
        } as qtyEntityType;
    }

    async findTotalPackage(): Promise<qtyEntityType> {
        
        const result = await prisma.packages.count({
            where: {
                deleted_at: null
            }
        });


        return {
            qty: result
        } as qtyEntityType;
    }

    async findOverview(): Promise<overviewEntityType[]> {
        
        const currentMonth = dayjs().month();
        const startOfMonth = dayjs().month(currentMonth).startOf('month').toDate();
        const endOfMonth = dayjs().month(currentMonth).endOf('month').toDate();

        const result = await prisma.booking.findMany({
            where: {
                created_at: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                paymentStatus: "paid",
            },
            orderBy: {
                updated_at: "desc"
            },
            select: {
                bookingId: true,
                amount: true,
                paymentStatus: true,
                bookingStatus: true,
                adultQty: true,
                childQty: true,
                groupQty: true,
                booker: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                ToPackage: {
                    select: {
                        packageName: true,
                    }
                }
            }
        });


        const resultFormat: overviewEntityType[] = await Promise.all(result.map((item) => {

            let qty = 0;

            if (item.childQty !== 0 || item.adultQty !== 0) {
                qty = Number(item.childQty) + Number(item.adultQty);
            } else if (item.groupQty !== 0) {
                qty = Number(item.groupQty);
            }

            return {
                bookingId: item.bookingId,
                packageName: item.ToPackage.packageName as string,
                booker: `${item.booker.firstName} ${item.booker.lastName}`,
                amount: item.amount,
                paymentStatus: item.paymentStatus,
                bookingStatus: item.bookingStatus,
                peopleQty: qty,
            }
        }));

        return resultFormat;
    }

    async findTotalIncome(): Promise<bookingAvgDataType[]> {
        
        let dataAvg: bookingAvgDataType[] = []; 
        const monthName: Array<string> = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

        for (let i = 0; i < monthName.length; i++) {
            
            let totalIncome = 0;
            const startOfMonth = dayjs().month(i).startOf('month').toDate();
            const endOfMonth = dayjs().month(i).endOf('month').toDate();


            const getBookingIncome = await prisma.booking.findMany({
                where: {
                    created_at: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    }
                },
                select: {
                    amount: true
                }
            });

            if (getBookingIncome.length !== 0) {
                for (const item of getBookingIncome) {
                    totalIncome += item.amount;
                }
            }

            dataAvg.push({
                name: monthName[i],
                avg: totalIncome
            });

            totalIncome = 0;
        }

        return dataAvg;
    }
}