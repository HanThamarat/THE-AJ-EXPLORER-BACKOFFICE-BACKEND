import { prisma } from "../data-source";

export class BOOKING_DATA_SOURNCE {
    static async reCheckBookingByUserId(userId: string, bookingId: string) {
        const recheckBooking = await prisma.contractBooking.findFirst({
            where: {
                userId: userId,
            },
            select: {
                toBooking: {
                    where: {
                        bookingId: bookingId,
                    },
                    select: {
                        bookingId: true
                    }
                }
            }
        });

        return recheckBooking;
    }
}