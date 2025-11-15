import { bookingEntity } from "../../../core/entity/booking";
import { BookingRepositoryPort } from "../../../core/ports/bookingRepositoryPort";
import { prisma } from "../../database/data-source";
import { Generate } from "../../helpers/generate";

export class BookingORM implements BookingRepositoryPort {
    constructor(private db: typeof prisma) {}

    // async createNewBooking(booking: bookingEntity): Promise<bookingEntity> {


    //     const generateBookId = await Generate.generateBookingId();
    //     const date = new Date();
    //     const extendedTome = new Date(date.getTime() + 15 * 60000);

    //     const createBook = await this.db.booking.create({
    //         data: {
    //             bookingId: generateBookId,
    //             paymentStatus: booking.paymentStatus,
    //             bookingStatus: booking.bookingStatus,
    //             userId: booking.userId,
    //             childPrice: booking.childPrice,
    //             childQty: booking.childQty,
    //             adultPrice: booking.adultPrice,
    //             adultQty: booking.adultPrice,
    //             groupPrice: booking.groupPrice,
    //             groupQty: booking.groupQty,
    //             amount: booking.amount,
    //             additionalDetail: booking.additionalDetail,
    //             locationId: booking.locationId,
    //             pickup_lat: booking.pickup_lat,
    //             pickup_lgn: booking.pickup_lgn,
    //             trip_at: new Date(booking.trip_at),
    //             expire_at: extendedTome
    //         }
    //     });
    // }
}