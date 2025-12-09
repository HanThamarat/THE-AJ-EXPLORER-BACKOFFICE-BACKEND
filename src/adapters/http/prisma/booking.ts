import { bkEntity } from "../../../core/entity/booking";
import { BkRepositortPort } from "../../../core/ports/bookingRepository";
import { prisma } from "../../database/data-source";

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
}