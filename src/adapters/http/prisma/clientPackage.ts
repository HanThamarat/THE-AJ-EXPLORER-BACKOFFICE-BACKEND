import { FILE_SCHEMA } from "../../../const/schema/file";
import { imageEntity } from "../../../const/schema/image";
import { findProvinceByPackageEntity, packageClientResponse, packageListEntity, packageSearchParams } from "../../../core/entity/clientPackage";
import { packageEntity, packageImageSave, packageInclude, packageNotInclude } from "../../../core/entity/package";
import { ClientPacakgeRepositoryPort } from "../../../core/ports/clientPackagePort";
import { Bucket } from "../../database/bucket";
import { prisma } from "../../database/data-source";
import dayjs from "dayjs"; 
import { CacheHelper } from "../../helpers/redisCache";
import { AxiosInstance } from "../../../hooks/axiosInstance";
import { PACKAGE_SCHEMA } from "../../../const/schema/package";
import { Request } from "express";

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

    async findPackageDetail(id: number, req: Request): Promise<packageEntity> {
        const packageIdCache = await CacheHelper.getCache(PACKAGE_SCHEMA.PACKAGE_ID_KEY + id);
        
        if (packageIdCache !== null) {
            const parsePackage = JSON.parse(packageIdCache);
            return parsePackage as packageEntity;
        }

        const axios = await AxiosInstance(req);
        const recheckPackage = await prisma.packages.count({
            where: {
                id: Number(id),
                deleted_at: null
            }
        });

        if (recheckPackage === 0) throw new Error("This package id not found in the system.");

            const result = await prisma.packages.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id: true,
                packageName: true,
                description: true,
                provinceId: true,
                districtId: true,
                subDistrictId: true,
                additional_description: true,
                packageTypeId: true,
                depart_point_lat: true,
                depart_point_lon: true,
                end_point_lat: true,
                end_point_lon: true,
                benefit_include: true,
                benefit_not_include: true,
                status: true,
                created_at: true,
                updated_at: true,
                packageImages: true,
                packageAttraction: {
                    select: {
                        attractionName: true,
                        attractionTime: true,
                        description: true,
                        status: true
                    }
                },
                pacakgeType: {
                    select: {
                        name: true
                    }
                },
                province: {
                    select: {
                        nameEn: true,
                        nameTh: true,
                    }
                },
                district: {
                    select: {
                        nameEn: true,
                        nameTh: true,
                    }
                },
                subdistrict: {
                    select: {
                        nameEn: true,
                        nameTh: true
                    }
                },
                packageOption: {
                    select: {
                        id: true,
                        name: true,
                        packageId: true,
                        pkgOptionId: true,
                        packageOptionType: {
                            select: {
                                name: true
                            }
                        },
                        description: true,
                        adultPrice: true,
                        childPrice: true,
                        groupPrice: true,
                        adultFromAge: true,
                        adultToAge: true,
                        childFromAge: true,
                        childToAge: true,
                        groupFromAge: true,
                        groupToAge: true,
                    }
                },
                createBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                },
                updateBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });

        // recheck null data and convert string to arr.
        let parseImageArr: packageImageSave[] = []; 
        let parseBenefitInclude: packageInclude[] = [];
        let parseBenefitNotInclude: packageNotInclude[] = [];
        if (result?.packageImages) {
            parseImageArr = JSON.parse(result.packageImages);                    
        }
        if (result?.benefit_include) {
            parseBenefitInclude = JSON.parse(result.benefit_include);
        }
        if (result?.benefit_not_include) {
            parseBenefitNotInclude = JSON.parse(result.benefit_not_include);
        }

        // take a parseImageArr for push to new arr for prepare to use in api.
        let imgArr: Array<string> = [];
        for (const Image of parseImageArr) {
            imgArr.push(Image.file_name);
        }

        const imageBase64 = await axios?.post('/findfiles', {
            file_name: imgArr,
            file_path: FILE_SCHEMA.PACKAGE_UPLOAD_IMAGE_PATH
        });

        // merge origin image arr and push base64 to arr
        const mergedImage: packageImageSave[] = parseImageArr.map(original => {
            const match = imageBase64?.data?.body?.find((imgs: any) => imgs.file_name === original.file_name);

            return match
                ? { ...original, file_base64: match.file_base64 }
                : original;
        }); 

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageTypeId: result?.packageTypeId ? result.packageTypeId : 0,
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            additional_description: result?.additional_description ? result.additional_description : 'no data',
            provinceId: result?.provinceId ? result.provinceId : 0,
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            districtId: result?.districtId ? result.districtId : 0,
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrictId: result?.subDistrictId ? result.subDistrictId : 0,
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            depart_point_lat: result?.depart_point_lat ? result.depart_point_lat : 'no data',
            depart_point_lon: result?.depart_point_lon ? result.depart_point_lon : 'no dara',
            end_point_lat: result?.end_point_lat ? result.end_point_lat : 'no data',
            end_point_lon: result?.end_point_lon ? result.end_point_lon : 'no dara',
            benefit_include: parseBenefitInclude,
            benefit_not_include: parseBenefitNotInclude,
            packageImage: mergedImage,
            packageOption: result?.packageOption ? result.packageOption.map((data) => ({
                id: data.id,
                packageId: data.packageId,
                pkgOptionType: data.packageOptionType?.name ?? "",
                pkgOptionTypeId: data.pkgOptionId ?? "",
                name: data.name ?? "",
                description: data.description ?? "",
                adultPrice: Number(data.adultPrice ?? 0),
                childPrice: Number(data.childPrice ?? 0),
                groupPrice: Number(data.groupPrice ?? 0),
                adultFromAge: data.adultFromAge ?? "",
                adultToAge: data.adultToAge ?? "",
                childFromAge: data.childFromAge ?? "",
                childToAge: data.childToAge ?? "",
                groupFromAge: data.groupFromAge ?? "",
                groupToAge: data.groupToAge ?? ""
            })) : null,
            pakcageAttraction: result?.packageAttraction ? result.packageAttraction.map((data) => ({
                attractionName: data.attractionName,
                attractionTime: data.attractionTime,
                description: data?.description ? data.description : "no data",
                status: result?.status ? true : false,
            })) : null,
            status: result?.status ? true : false,
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
            created_by: result?.createBy ? `${result.createBy.firstName} ${result.createBy.lastName}` : 'no data',
            updated_by: result?.updateBy ? `${result.updateBy.firstName} ${result.updateBy.lastName}` : 'no data'
        };

        const convertResult = JSON.stringify(resultFormat);
        await CacheHelper.setCache(PACKAGE_SCHEMA.PACKAGE_ID_KEY + id, convertResult);

        return resultFormat; 
    }
}