import { FILE_SCHEMA } from "../../../const/schema/file";
import { imageEntity } from "../../../const/schema/image";
import { findProvinceByPackageEntity, packageClientResponse, packageListEntity, packageSearchParams } from "../../../core/entity/clientPackage";
import { ClientPacakgeRepositoryPort } from "../../../core/ports/clientPackagePort";
import { Bucket } from "../../database/bucket";
import { prisma } from "../../database/data-source";
import dayjs from "dayjs"; 

export class ClientPackageDataSource implements ClientPacakgeRepositoryPort {
    constructor(private db: typeof prisma) {}

    async findProvinceByPackage(): Promise<findProvinceByPackageEntity> {
        const result : any = this.db.$queryRaw`
            select p."nameEn" as provinceName, p."id" as provinceId,
                json_agg(
                    json_build_object(
                        'packageId', p2.id ,
                        'packageName', p2."packageName"
                    )
                ) as packages
            from province p inner join packages p2 on p.id = p2."provinceId" group by p.id
        `;

        return result as findProvinceByPackageEntity;
    }

    async findBySearch(params: packageSearchParams): Promise<packageClientResponse> {
        const currentDate = dayjs();
        const skip: number = (params.page - 1) * params.limit;
        const take: number = params.limit;
        let result: packageListEntity[] = [];

        const [items, total] =  await Promise.all([
            prisma.packages.findMany({
                skip,
                take,
                where: {
                    OR: [
                        {
                            packageName: {
                                contains: params.packageName,
                                mode: "insensitive"
                            }
                        },
                        {
                            provinceId: params.provinceId
                        }
                    ]
                },
                select: {
                    id: true,
                    packageName: true,
                    packageImages: true,
                    description: true,
                    province: {
                        select: {
                            nameEn: true
                        }
                    },
                    packageOption: {
                        select: {
                            adultPrice: true,
                            childPrice: true,
                            groupPrice: true,
                        }
                    },
                    ToBbooking: {
                        select: {
                            toReview: true
                        }
                    },
                    packagePromoLink: {
                        select: {
                            percentage: true,
                            packagePromo: {
                                select: {
                                    startDate: true,
                                    endDate: true,
                                    type: true,
                                }
                            }
                        }
                    }
                }
            }),
            prisma.packages.count()
        ]);

        for (const item of items) {
            let reviewQty: number = 0;
            const imageArr: imageEntity[] = await JSON.parse(item.packageImages as string) ?? [];
            const imgFromBuckets = await Bucket.findManyWithoutToken(imageArr.slice(0, 4), FILE_SCHEMA.PACKAGE_UPLOAD_IMAGE_PATH);

            for (const booking of item.ToBbooking) {
                reviewQty = booking.toReview.length;
            }

            const filterPromo = item.packagePromoLink.filter(
                (b) => currentDate.isAfter(dayjs(b.packagePromo.startDate, 'day')) && 
                currentDate.isBefore(dayjs(b.packagePromo.endDate), 'day') && 
                b.packagePromo.type === "promotion"
            );

            const findMinPrice = item.packageOption.map(data => {
                if (data.adultPrice && data.adultPrice) {
                    return Math.min(data.adultPrice as number, data.childPrice as number);
                }

                if (data.groupPrice && data.groupPrice !== 0) {
                    return Math.min(data.groupPrice as number);
                }

                return 0;
            });

            const calPromoPrice: number = filterPromo.length !== 0 ? 
            (findMinPrice[0] * (1 - filterPromo[0].percentage / 100)) : 0;
            
            await result.push({
                packageId: item.id,
                packageName: item.packageName as string,
                packageDes: item.description as string,
                province: item.province?.nameEn as string,
                starAvg: 0,
                reviewQty: reviewQty,
                fromAmount: findMinPrice[0],
                promoAmount: calPromoPrice,
                packageImage: imgFromBuckets
            });
            reviewQty = 0;
        }
        
        return {
            page: params.page,
            limit: params.limit,
            total: total,
            totalPage: Math.ceil(total / params.limit),
            nextPage: params.page * params.limit < total ? params.page + 1 : null,
            prevPage: params.page > 1 ? params.page - 1 : null,
            items: result
        } as packageClientResponse;
    }
}