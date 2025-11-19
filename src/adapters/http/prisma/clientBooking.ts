import { bookingEntity } from "../../../core/entity/clientBooking";
import { BookingRepositoryPort } from "../../../core/ports/clientBookingRepositoryPort";
import { prisma } from "../../database/data-source";
import { Generate } from "../../helpers/generate";
import { transporterMailer } from "../../helpers/nodemailer";
import { NormalBookingSumary, GroupBookingSumary } from "../../helpers/templetes/book";

export class BookingDataSource implements BookingRepositoryPort {
    constructor(private db: typeof prisma) {}

    async createNewBooking(booking: bookingEntity): Promise<bookingEntity | null> {


        const generateBookId = await Generate.generateBookingId();
        const date = new Date();
        const extendedTime = new Date(date.getTime() + 15 * 60000);

        const createBook = await this.db.booking.create({
            data: {
                bookingId: generateBookId,
                packageId: booking.packageId,
                paymentStatus: booking.paymentStatus,
                bookingStatus: booking.bookingStatus,
                userId: booking.userId,
                childPrice: booking.childPrice,
                childQty: booking.childQty,
                adultPrice: booking.adultPrice,
                adultQty: booking.adultQty,
                groupPrice: booking.groupPrice,
                groupQty: booking.groupQty,
                amount: booking.amount,
                additionalDetail: booking.additionalDetail,
                locationId: booking.locationId,
                pickup_lat: booking.pickup_lat,
                pickup_lgn: booking.pickup_lgn,
                trip_at: new Date(booking.trip_at),
                expire_at: extendedTime
            },
            include: {
                booker: true,
            }
        });

        if (!createBook) throw new Error("booking failed.");


        if (createBook.adultPrice || createBook.childPrice) {
            const bookedMail = await transporterMailer.sendMail({
                from: "The Aj Explorer Support.",
                to: createBook.booker.email as string,
                subject: `Booking #${createBook.bookingId}`,
                text: `Your Booking (#${createBook.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                html: NormalBookingSumary(createBook)
            });

            console.log("Message sent:", bookedMail.messageId);
        }

        if (createBook.groupPrice) {
            const bookedMail = await transporterMailer.sendMail({
                from: "The Aj Explorer Support.",
                to: createBook.booker.email as string,
                subject: `Booking #${createBook.bookingId}`,
                text: `Your Booking (#${createBook.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                html: GroupBookingSumary(createBook)
            });

            console.log("Message sent:", bookedMail.messageId);
        }

        return null;
    }
}