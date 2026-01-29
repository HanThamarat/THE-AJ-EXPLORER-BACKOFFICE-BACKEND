import { packageReviewSearchType, packageReviewType, packageReviwResponseType, reviewDTOType, reviewEntityType, reviewResponseType, reviewSQLStatementType } from "../../../core/entity/review";
import { ReviewRepositoryPort } from "../../../core/ports/reviewRepositoryPort";
import { imageEntity } from "../../../types/image";
import { prisma } from "../../database/data-source";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { Bucket } from "../../database/bucket";
import { FILE_SCHEMA } from "../../../types/file";

dayjs.extend(isSameOrAfter);

export class ReviewDataSource implements ReviewRepositoryPort {

    async createNewReview(userId: string, reviewDTO: reviewDTOType): Promise<reviewEntityType> {

        const recheckbooking = await prisma.booking.findFirst({
            where: {
                bookingId: reviewDTO.bookingId
            },
            select: {
                bookingId: true,
                trip_at: true,
                booker: {
                    select: {
                        userId: true
                    }
                },
                toReview: {
                    select: {
                        bookingId: true
                    }
                }
            }
        });

        if (!recheckbooking || recheckbooking.booker.userId !== userId) throw new Error("don't have this booking id in the system.");

        if (recheckbooking.toReview[0]) throw new Error("This booking already reviewed.");

        const trip_at = dayjs(recheckbooking.trip_at);

        if (!dayjs().isSameOrAfter(trip_at, 'd')) throw new Error("This booking is still not end of trip.");

        const createNew = await prisma.review.create({
            data: {
                bookingId: reviewDTO.bookingId,
                cleanliness: reviewDTO.cleanliness,
                staff: reviewDTO.staff,
                location: reviewDTO.location,
                title: reviewDTO.title,
                samary: reviewDTO.samary
            },
            select: {
                id: true,
                bookingId: true,
                cleanliness: true,
                staff: true,
                location: true,
                title: true,
                samary: true,
                iamge: true,
                created_at: true,
                updated_at: true
            }
        });

        if (!createNew) throw new Error("Have something wrong in create a new review, Please try again later.");
        
        const resultFormat: reviewEntityType = {
            id: createNew.id,
            bookingId: createNew.bookingId,
            cleanliness: createNew.cleanliness,
            staff: createNew.staff,
            location: createNew.location,
            title: createNew.title,
            samary: createNew.samary,
            iamge: createNew.iamge,
            created_at: createNew.created_at,
            updated_at: createNew.updated_at
        };

        return resultFormat;
    }

    async findMyReviews(userId: string): Promise<reviewResponseType[]> {

        let myReview: reviewResponseType[] = [];
        const currentDate = dayjs().toDate();
        
        const findMyBooking: any = await prisma.$queryRaw`
            select b."bookingId"
            from ("ContractBooking" cb left join "Booking" b on cb.id = b.id)
            where cb."userId" = ${userId}
        `;

        for (const booking of findMyBooking) {

            if (myReview.length >= 5) break;

            if (booking.bookingId !== null) {
                const review = await prisma.review.findFirst({
                    where: {
                        bookingId: booking.bookingId as string
                    },
                    select: {
                        id: true,
                    }
                });
                
                if (!review) {
                    const mybook = await prisma.booking.findFirst({
                        where: {
                            bookingId: booking.bookingId as string,
                            trip_at: {
                                lte: currentDate,
                            }
                        },
                        select: {
                            bookingId: true,
                            trip_at: true,
                            ToPackage: {
                                select: {
                                    packageName: true,
                                    packageImages: true,
                                }
                            }
                        }
                    });

                    if (mybook) {
                        const image: imageEntity[] = JSON.parse(mybook.ToPackage.packageImages as string);
                        const getImage: imageEntity = await Bucket.findFirstWithoutToken(image[0], FILE_SCHEMA.PACKAGE_UPLOAD_IMAGE_PATH);       

                        myReview.push({
                            bookingId: mybook.bookingId,
                            packageName: mybook.ToPackage.packageName as string,
                            trip_at: mybook.trip_at,
                            image: getImage,
                        });
                    }
                }
            }
        }

        return myReview;
    }

    async findPackageReview(searchParams: packageReviewSearchType): Promise<packageReviwResponseType | null> {

        if (!searchParams.packageid) throw new Error("Please enter a package id.");

        const skip: number = (searchParams.page - 1) * searchParams.limit;
        const take: number = searchParams.limit;

        const recheckPackage = await prisma.packages.count({
            where: {
                status: true,
                id: searchParams.packageid as number
            }
        });

        if (recheckPackage === 0) throw new Error("Please recheck the package id, This package id don't have in the system.");

        const [reviewResult, total] = await Promise.all([
            prisma.$queryRaw`
                select r.title, r.samary, r.staff, r.cleanliness, r."location", r.created_at, u.image as bookerImage, u."name" as bookerName
                from ((("Booking" b inner join "Review" r on b."bookingId" = r."bookingId")
                    inner join "ContractBooking" cb on b."ContractBookingId" = cb.id)
                    inner join "User" u on cb."userId" = u.id)
                where b."packageId" = ${searchParams.packageid}
                order by r.created_at desc
                offset ${skip} rows 
                fetch next ${take} rows only
            ` as any,
            prisma.$queryRaw`select count(r.id) as total_reviews from "Booking" b inner join "Review" r on b."bookingId" = r."bookingId"` as any
        ]);

        const mapItemsResponse: packageReviewType[] = await Promise.all(reviewResult.map((item: reviewSQLStatementType) => {

            const calstartAvg = ((item.cleanliness + item.location + item.staff) / 3).toFixed(1);

            return {
                title: item.title,
                sumary: item.samary,
                ratingStar: Number(calstartAvg),
                created_at: item.created_at,
                booker: {
                    bookerName: item.bookername,
                    image: item.bookerimage
                }
            }
        }));
        const totalReview = Number(total[0].total_reviews);

        return {
            page: searchParams.page,
            limit: searchParams.limit,
            total: totalReview,
            totalPage: Math.ceil(totalReview / searchParams.limit),
            nextPage: searchParams.page * searchParams.limit < totalReview ? searchParams.page + 1 : null,
            prevPage: searchParams.page > 1 ? searchParams.page - 1 : null,
            items: mapItemsResponse
        } as packageReviwResponseType;
    }
}