import { bookingEntity } from "../../../core/entity/clientBooking";
import { BookingByCardDTOType, chargeDTO } from "../../../core/entity/payment";
import { PaymentRepositoryPort } from "../../../core/ports/paymentRepositoryPort";
import { prisma } from "../../database/data-source";
import { Generate } from "../../helpers/generate";
import omise from "../../database/omise";
import { omiseChargeEntity } from "../../../core/entity/financial";
import { transporterMailer } from "../../helpers/nodemailer";
import { GroupBookingSumary, NormalBookingSumary } from "../../helpers/templetes/book";

export class PaymentDataSource implements PaymentRepositoryPort {
    constructor(private db: typeof prisma) {}

    async createBookingByCard(bookingDTO: BookingByCardDTOType): Promise<bookingEntity> {
        const generateBookId = await Generate.generateBookingId();
        const date = new Date();
        const extendedTime = new Date(date.getTime() + 15 * 60000);

        const createBook = await prisma.$transaction(async (tx) => {
            
            const createContractBook = await tx.contractBooking.create({
                data: bookingDTO.contractBooking
            });

            const createBook = await tx.booking.create({
                data: {
                    bookingId: generateBookId,
                    packageId: bookingDTO.packageId,
                    ContractBookingId: createContractBook.id,
                    childPrice: bookingDTO.childPrice,
                    childQty: bookingDTO.childQty,
                    adultPrice: bookingDTO.adultPrice,
                    adultQty: bookingDTO.adultQty,
                    groupPrice: bookingDTO.groupPrice,
                    groupQty: bookingDTO.groupQty,
                    amount: bookingDTO.amount,
                    additionalDetail: bookingDTO.additionalDetail,
                    pickupLocation: bookingDTO.pickupLocation,
                    locationId: bookingDTO.locationId,
                    pickup_lat: bookingDTO.pickup_lat,
                    pickup_lgn: bookingDTO.pickup_lgn,
                    trip_at: new Date(bookingDTO.trip_at),
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

            const mergeAmout = Number(`${createBook.amount}00`);

            const createCardToken = await omise.tokens.create({
                card: {
                    name: bookingDTO.card.card_name,
                    number: bookingDTO.card.card_number,
                    expiration_month: bookingDTO.card.expiration_month,
                    expiration_year: bookingDTO.card.expiration_year,
                    security_code: bookingDTO.card.security_code,
                    city: bookingDTO.card.city,
                    postal_code: bookingDTO.card.postal_code
                }
            });

            const createCharge = await omise.charges.create({
                amount: mergeAmout,
                currency: "thb",
                card: createCardToken.id,
                metadata: {
                    booking_id: createBook.bookingId
                },
            });

            console.log(createCharge);

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

    async generateQr(chargeDTO: chargeDTO): Promise<omiseChargeEntity> {

        const reCheckBooking = await prisma.booking.findFirst({
            where: {
                bookingId: chargeDTO.bookingId,
            },
            select: {
                paymentStatus: true,
                paymentRef: true,
                amount: true,
                messageSend: true,
            }
        });

        if (!reCheckBooking) throw new Error("Don't have a booking in system, please try again later.");

        if (reCheckBooking.paymentStatus !== "panding") throw new Error(`This booking ${reCheckBooking.paymentStatus}`);

        const now = new Date();
        now.setMinutes(now.getMinutes() + 15);
        const expiresAtISO = now.toISOString();
        const mergeAmout = Number(`${reCheckBooking.amount}00`);
        
        const source = await omise.sources.create({
            amount: mergeAmout,
            currency: 'thb',
            type: 'promptpay'
        });     
        
        if (reCheckBooking.paymentRef === null) {
            const charge = await omise.charges.create({
                expires_at: expiresAtISO,
                amount: mergeAmout,
                currency: 'thb',
                source: source.id,
                description: `Booking payment for ${chargeDTO.bookingId}`,
                metadata: {
                    booking_id: chargeDTO.bookingId
                },
                return_uri: 'https://yourdomain.com/payment/complete',
            });

            if (charge) {
                await prisma.booking.update({
                    where: {
                        bookingId: chargeDTO.bookingId
                    },
                    data: {
                        paymentRef: charge.id
                    }
                });
            }

            return charge as omiseChargeEntity;
        }

        const chargeData = await omise.charges.retrieve(reCheckBooking.paymentRef);

        if (chargeData.paid === true && reCheckBooking.messageSend === false) {
            const bookingData = await prisma.booking.findFirst({
                where: {
                    bookingId: chargeDTO.bookingId
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

            await prisma.booking.update({
                where: {
                    bookingId: chargeDTO.bookingId
                },
                data: {
                    paymentStatus: "paid"
                }
            });

            if (bookingData?.adultPrice || bookingData?.childPrice) {
                const bookedMail = await transporterMailer.sendMail({
                    from: "The Aj Explorer Support.",
                    to: bookingData.booker.email as string,
                    subject: `Booking #${bookingData.bookingId}`,
                    text: `Your Booking (#${bookingData.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                    html: NormalBookingSumary(bookingData)
                });

                if (bookedMail.messageId) {
                    await prisma.booking.update({
                        where: {
                            bookingId: bookingData.bookingId
                        },
                        data: {
                            messageSend: true,
                            messageId: bookedMail.messageId,
                        }
                    });
                }
            }

            if (bookingData?.groupPrice) {
                const bookedMail = await transporterMailer.sendMail({
                    from: "The Aj Explorer Support.",
                    to: bookingData.booker.email as string,
                    subject: `Booking #${bookingData.bookingId}`,
                    text: `Your Booking (#${bookingData.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                    html: GroupBookingSumary(bookingData)
                });

                if (bookedMail.messageId) {
                    await prisma.booking.update({
                        where: {
                            bookingId: bookingData.bookingId
                        },
                        data: {
                            messageSend: true,
                            messageId: bookedMail.messageId
                        }
                    });
                }
            }
        }

        if (chargeData.failure_message !== null) {
            await prisma.booking.update({
                where: {
                    bookingId: chargeDTO.bookingId
                },
                data: {
                    paymentStatus: "failed"
                }
            });
        }

        return chargeData as omiseChargeEntity;
    }
}