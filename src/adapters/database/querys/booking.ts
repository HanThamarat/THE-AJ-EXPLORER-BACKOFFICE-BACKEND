import { prisma } from "../data-source";

export class BOOKING_DATA_SOURNCE {
    static async reCheckBookingByUserId(userId: string, bookingId: string) {
        const recheckBooking = await prisma.booking.findFirst({
            where: {
                bookingId: bookingId,
            },
            select: {
                bookingId: true,
                booker: {
                    select: {
                        userId: true
                    }
                }
            }
        });

        if (recheckBooking?.booker.userId !== userId) return null;

        return recheckBooking;
    }
}