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

        const createnewBook = await this.db.$transaction(async (tx) => {
            
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


            if (!createCharge) throw new Error("have something wrong in payment process, Please try again later.");

            await tx.booking.update({
                where: {
                    bookingId: createBook.bookingId
                },
                data: {
                    paymentRef: createCharge.id
                }
            });   

            if (createCharge.paid === true) {
                await tx.booking.update({
                    where: {
                        bookingId: createBook.bookingId
                    },
                    data: {
                        paymentStatus: "paid"
                    }
                });   
            }

            if (createCharge.failure_code !== null) {
                await tx.booking.update({
                    where: {
                        bookingId: createBook.bookingId
                    },
                    data: {
                        paymentStatus: "failed"
                    }
                });   
            }

            return createBook;
        });

        if (createnewBook?.adultPrice || createnewBook?.childPrice) {
            const bookedMail = await transporterMailer.sendMail({
                from: "The Aj Explorer Support.",
                to: createnewBook.booker.email as string,
                subject: `Booking #${createnewBook.bookingId}`,
                text: `Your Booking (#${createnewBook.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                html: NormalBookingSumary(createnewBook)
            });        

            if (bookedMail.messageId) {
                await this.db.booking.update({
                    where: {
                        bookingId: createnewBook.bookingId
                    },
                    data: {
                        messageSend: true,
                        messageId: bookedMail.messageId,
                    }
                });
            }
        }

        if (createnewBook?.groupPrice) {
            const bookedMail = await transporterMailer.sendMail({
                from: "The Aj Explorer Support.",
                to: createnewBook.booker.email as string,
                subject: `Booking #${createnewBook.bookingId}`,
                text: `Your Booking (#${createnewBook.bookingId}) was successfully and your payment has been processed. Here is your booking summary`, // plain‑text body
                html: GroupBookingSumary(createnewBook)
            });

            if (bookedMail.messageId) {
                await this.db.booking.update({
                    where: {
                        bookingId: createnewBook.bookingId
                    },
                    data: {
                        messageSend: true,
                        messageId: bookedMail.messageId
                    }
                });
            }
        }

        const ressponseFormat: bookingEntity = {
            id: createnewBook.id,
            bookingId: createnewBook.bookingId,
            paymentStatus: createnewBook.paymentStatus,
            bookingStatus: createnewBook.bookingStatus,
            packageId: createnewBook.packageId,
            contractBooking: {
                id: createnewBook.booker.id,
                email: createnewBook.booker.email,
                firstName: createnewBook.booker.firstName,
                lastName: createnewBook.booker.lastName,
                country: createnewBook.booker.country,
                phoneNumber: createnewBook.booker.phoneNumber,
                userId: createnewBook.booker.userId ? createnewBook.booker.userId : "no data",
            },
            childPrice: createnewBook.childPrice ? createnewBook.childPrice : undefined,
            childQty: createnewBook.childQty ? createnewBook.childQty : undefined,
            adultPrice: createnewBook.adultPrice ? createnewBook.adultPrice : undefined,
            adultQty: createnewBook.adultQty ? createnewBook.adultQty : undefined,
            groupPrice: createnewBook.groupPrice ? createnewBook.groupPrice : undefined,
            groupQty: createnewBook.groupQty ? createnewBook.groupQty : undefined,
            amount: createnewBook.amount ? createnewBook.amount : 0,
            additionalDetail: createnewBook.additionalDetail ? createnewBook.additionalDetail : undefined,
            pickupLocation: createnewBook.pickupLocation ? createnewBook.pickupLocation : undefined,
            pickup_lat: createnewBook.pickup_lat ? Number(createnewBook.pickup_lat) : 0,
            pickup_lgn: createnewBook.pickup_lgn ? Number(createnewBook.pickup_lgn) : 0,
            trip_at: createnewBook.trip_at,
            policyAccept: createnewBook.policyAccept
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