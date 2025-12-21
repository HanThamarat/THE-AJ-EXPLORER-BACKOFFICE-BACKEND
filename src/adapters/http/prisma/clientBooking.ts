import { bookingEntity } from "../../../core/entity/clientBooking";
import { BookingRepositoryPort } from "../../../core/ports/clientBookingRepositoryPort";
import { prisma } from "../../database/data-source";
import { Generate } from "../../helpers/generate";
import { transporterMailer } from "../../helpers/nodemailer";
import { NormalBookingSumary, GroupBookingSumary } from "../../helpers/templetes/book";

export class BookingDataSource implements BookingRepositoryPort {
    constructor(private db: typeof prisma) {}

    async createNewBooking(booking: bookingEntity): Promise<bookingEntity> {


        const generateBookId = await Generate.generateBookingId();
        const date = new Date();
        const extendedTime = new Date(date.getTime() + 15 * 60000);

        const createBook = await prisma.$transaction(async (tx) => {
            
            const createContractBook = await this.db.contractBooking.create({
                data: booking.contractBooking
            });

            const createBook = await this.db.booking.create({
                data: {
                    bookingId: generateBookId,
                    packageId: booking.packageId,
                    paymentStatus: booking.paymentStatus,
                    bookingStatus: booking.bookingStatus,
                    ContractBookingId: createContractBook.id,
                    childPrice: booking.childPrice,
                    childQty: booking.childQty,
                    adultPrice: booking.adultPrice,
                    adultQty: booking.adultQty,
                    groupPrice: booking.groupPrice,
                    groupQty: booking.groupQty,
                    amount: booking.amount,
                    additionalDetail: booking.additionalDetail,
                    pickupLocation: booking.pickupLocation,
                    locationId: booking.locationId,
                    pickup_lat: booking.pickup_lat,
                    pickup_lgn: booking.pickup_lgn,
                    trip_at: new Date(booking.trip_at),
                    expire_at: extendedTime
                },
                select: {
                    id: true,
                    bookingId: true,
                    adultPrice: true,
                    adultQty: true,
                    childPrice: true,
                    childQty: true,
                    amount: true,
                    groupPrice: true,
                    groupQty: true,
                    paymentStatus: true,
                    bookingStatus: true,
                    packageId: true,
                    additionalDetail: true,
                    pickupLocation: true,
                    pickup_lat: true,
                    pickup_lgn: true,
                    trip_at: true,
                    policyAccept: true,
                    booker: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                            country: true,
                            phoneNumber: true,
                            userId: true,
                        }
                    }
                }
            });

            if (!createBook) throw new Error("booking failed.");

            return createBook;
        });

        const ressponseFormat: bookingEntity = {
            id: createBook.id,
            bookingId: createBook.bookingId,
            paymentStatus: createBook.paymentStatus,
            bookingStatus: createBook.bookingStatus,
            packageId: createBook.packageId,
            contractBooking: {
                id: createBook.booker.id,
                email: createBook.booker.email,
                firstName: createBook.booker.firstName,
                lastName: createBook.booker.lastName,
                country: createBook.booker.country,
                phoneNumber: createBook.booker.phoneNumber,
                userId: createBook.booker.userId ? createBook.booker.userId : "no data",
            },
            childPrice: createBook.childPrice ? createBook.childPrice : undefined,
            childQty: createBook.childQty ? createBook.childQty : undefined,
            adultPrice: createBook.adultPrice ? createBook.adultPrice : undefined,
            adultQty: createBook.adultQty ? createBook.adultQty : undefined,
            groupPrice: createBook.groupPrice ? createBook.groupPrice : undefined,
            groupQty: createBook.groupQty ? createBook.groupQty : undefined,
            amount: createBook.amount ? createBook.amount : 0,
            additionalDetail: createBook.additionalDetail ? createBook.additionalDetail : undefined,
            pickupLocation: createBook.pickupLocation ? createBook.pickupLocation : undefined,
            pickup_lat: createBook.pickup_lat ? Number(createBook.pickup_lat) : 0,
            pickup_lgn: createBook.pickup_lgn ? Number(createBook.pickup_lgn) : 0,
            trip_at: createBook.trip_at,
            policyAccept: createBook.policyAccept
        }

        return ressponseFormat;
    }
}