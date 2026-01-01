import { Request } from "express";
import { bookingEntity, bookingInfoType, findBookingType, mytripEntityType } from "../../../core/entity/clientBooking";
import { BookingRepositoryPort } from "../../../core/ports/clientBookingRepositoryPort";
import { prisma } from "../../database/data-source";
import { Generate } from "../../helpers/generate";
import dayjs from "dayjs";
import { imageEntity } from "../../../const/schema/image";
import { Bucket } from "../../database/bucket";
import { FILE_SCHEMA } from "../../../const/schema/file";
import { BOOKING_DATA_SOURNCE } from "../../database/querys/booking";
import { transporterMailer } from "../../helpers/nodemailer";
import { GroupBookingSumary, NormalBookingSumary } from "../../helpers/templetes/book";

export class BookingDataSource implements BookingRepositoryPort {
    constructor(private db: typeof prisma) {}

    async createNewBooking(booking: bookingEntity): Promise<bookingEntity> {
        const generateBookId = await Generate.generateBookingId();
        const date = new Date();
        const extendedTime = new Date(date.getTime() + 15 * 60000);

        const createBook = await prisma.$transaction(async (tx) => {
            
            const createContractBook = await tx.contractBooking.create({
                data: booking.contractBooking
            });

            const createBook = await tx.booking.create({
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

    async myTrip(page: "upcoming" | "cancaled" | "completed", userId: string, req: Request): Promise<mytripEntityType[] | null> {
        const recheckUserId = await this.db.user.count({
            where: {
                id: userId
            }
        });

        if (recheckUserId === 0) throw new Error("This userId don't have in the system, Please try again later.");
    
        const currentDate = dayjs().format();
        let findBooking: findBookingType[];
        let result: mytripEntityType[] = [];

        switch (page) {
            case "upcoming":
                findBooking = await this.db.$queryRaw`
                    select b."bookingId", b."bookingStatus", b.trip_at , p."id" as packageId, p."packageImages", p."packageName", pv."nameEn" 
                    from ((("ContractBooking" cb  inner join "Booking" b on cb.id = b."ContractBookingId") 
                        inner join packages p on b."packageId" = p.id)
                        inner join province pv on p."provinceId" = pv.id)
                    where cb."userId" = ${userId} and date(b.trip_at) >= date(${currentDate})
                ` as findBookingType[];
                break;
            case "cancaled":
                findBooking = await this.db.$queryRaw`
                    select b."bookingId", b."bookingStatus", b.trip_at , p."id" as packageId, p."packageImages", p."packageName", pv."nameEn" 
                    from ((("ContractBooking" cb  inner join "Booking" b on cb.id = b."ContractBookingId") 
                        inner join packages p on b."packageId" = p.id)
                        inner join province pv on p."provinceId" = pv.id)
                    where cb."userId" = ${userId} and b."bookingStatus" = 'failed'
                ` as findBookingType[];
                break;
            case "completed":
                findBooking = await this.db.$queryRaw`
                    select b."bookingId", b."bookingStatus", b.trip_at , p."id" as packageId, p."packageImages", p."packageName", pv."nameEn" 
                    from ((("ContractBooking" cb  inner join "Booking" b on cb.id = b."ContractBookingId") 
                        inner join packages p on b."packageId" = p.id)
                        inner join province pv on p."provinceId" = pv.id)
                    where cb."userId" = ${userId} and date(b.trip_at) < date(${currentDate}) and "bookingStatus" = 'confirmed'
                ` as findBookingType[];
                break;
            default:
                findBooking = await this.db.$queryRaw`
                    select b."bookingId", b."bookingStatus", b.trip_at , p."id" as packageId, p."packageImages", p."packageName", pv."nameEn" 
                    from ((("ContractBooking" cb  inner join "Booking" b on cb.id = b."ContractBookingId") 
                        inner join packages p on b."packageId" = p.id)
                        inner join province pv on p."provinceId" = pv.id)
                    where cb."userId" = ${userId} and date(b.trip_at) >= date(${currentDate})
                ` as findBookingType[];
                break;
        }

        const findUniueProvince = [...new Map(findBooking.map(item => [item.nameEn, item])).values()];

        for (const provice of findUniueProvince) {
            const filterPackagebyProvince = findBooking.filter((data) => data.nameEn === provice.nameEn);
            const findUniueTripDate = [...new Map(filterPackagebyProvince.map((item) => {
                const key = item.trip_at instanceof Date 
                    ? item.trip_at.toISOString() 
                    : item.trip_at;
                return [key, item];
            })).values()
            ].sort((a, b) => {
                return new Date(a.trip_at).getTime() - new Date(b.trip_at).getTime();
            });
            
            for (const sameDay of findUniueTripDate)  {
                const targetDate = new Date(sameDay.trip_at).toISOString();
                const filterPackageByDate = filterPackagebyProvince.filter(
                    (datas) => new Date(datas.trip_at).toISOString() === targetDate
                );

                result.push({
                    province_name: provice.nameEn,
                    trip_date: sameDay.trip_at as string,
                    booking_detail: await Promise.all(
                        filterPackageByDate.map(async (item) => {

                            const packageImageArr: imageEntity[] = JSON.parse(item.packageImages);
                            const findMainImage = packageImageArr.filter((image) => image.mainFile === true);
                            const base64Image = await Bucket.findFirstWithoutToken(findMainImage[0], FILE_SCHEMA.PACKAGE_UPLOAD_IMAGE_PATH);

                            return {
                                bookingId: item.bookingId,
                                bookingStatus: item.bookingStatus,
                                package: {
                                    packageId: item.packageid,
                                    packageName: item.packageName,
                                    packageMainImage: base64Image as imageEntity,
                                }
                            }
                        })
                    )
                });
            }
        }

        return result as mytripEntityType[];
    }

    async bookingDetail(bookingId: string, userId: string): Promise<bookingInfoType> {


        const recheckBooking = BOOKING_DATA_SOURNCE.reCheckBookingByUserId(userId, bookingId);

        if (!recheckBooking) throw new Error("Not found this bookingId system please try again later");

        const bookingResult = await this.db.booking.findFirst({
            where: {
                bookingId: bookingId
            },
            select: {
                bookingId: true,
                trip_at: true,
                bookingStatus: true,
                paymentStatus: true,
                pickupLocation: true,
                additionalDetail: true,
                adultQty: true,
                adultPrice: true,
                childQty: true,
                childPrice: true,
                groupQty: true,
                groupPrice: true,
                amount: true,
                ToPackage: {
                    select: {
                        packageName: true,
                        packageImages: true,
                    }
                },
                booker: {
                    select: {
                        firstName: true,
                        lastName: true,
                        phoneNumber: true,
                        email: true
                    }
                }
            }
        });

        if (!bookingResult) throw new Error("Can't find booking detail, Please try again later.");

        const imageArr: imageEntity[] = JSON.parse(bookingResult.ToPackage.packageImages as string) as imageEntity[];
        const findMainImage = imageArr.filter((item) => item.mainFile = true);

        const getBase64Image = await Bucket.findFirstWithoutToken(findMainImage[0], FILE_SCHEMA.PACKAGE_UPLOAD_IMAGE_PATH);

        const resultFormat: bookingInfoType = {
            bookingzId: bookingResult.bookingId,
            packageName: bookingResult.ToPackage.packageName as string,
            packageImage: getBase64Image.base64 as string,
            trip_at: bookingResult.trip_at,
            bookingStatus: bookingResult.bookingStatus,
            payStatus: bookingResult.paymentStatus,
            pickUpLocation: bookingResult.pickupLocation as string,
            specialRequest: bookingResult.additionalDetail,
            bookerInfo: {
                firstName: bookingResult.booker.firstName,
                lastName: bookingResult.booker.lastName,
                phoneNumber: bookingResult.booker.phoneNumber,
                email: bookingResult.booker.email,
            },
            booked_info: {
                adult: bookingResult.adultQty,
                adultPrice: bookingResult.adultPrice,
                child: bookingResult.childQty,
                childPrice: bookingResult.childPrice,
                group: bookingResult.groupQty,
                groupPrice: bookingResult.groupPrice,
                totalPrice: bookingResult.amount
            }
        };

        return resultFormat;
    }

    async getBookConfirmation(userId: string, bookingId: string): Promise<string> {
        const recheckBooking = BOOKING_DATA_SOURNCE.reCheckBookingByUserId(userId, bookingId);

        if (!recheckBooking) throw new Error("Not found this bookingId system please try again later");
        
        const bookingData = await prisma.booking.findFirst({
        where: {
            bookingId: bookingId
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

        return "send comfirmation to email successfully";
    }
}