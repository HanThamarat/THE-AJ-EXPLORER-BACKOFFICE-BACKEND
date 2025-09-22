import { packageDTO, packageEntity, packageImageSave, packageInclude, packageNotInclude } from "../../../core/entity/package";
import { PackageRepositoryPort } from "../../../core/ports/packageRepositoryPort";
import { prisma } from "../../database/data-source";
import { AxiosInstance } from "../../../hooks/axiosInstance";
import { Request } from "express";
import { FILE_SCHEMA } from "../../../const/schema/file";
import { CacheHelper } from "../../helpers/redisCache";
import { PACKAGE_SCHEMA } from "../../../const/schema/package";

export class PackagePrismaORM implements PackageRepositoryPort {
    
    async createPacakge(packageDto: packageDTO): Promise<packageEntity> {
        const createpackage = await prisma.packages.create({
            data: {
                packageName: packageDto.packageName,
                packageTypeId: packageDto.packageTypeId,
                description: packageDto.description,
                provinceId: packageDto.provinceId,
                districtId: packageDto.districtId,
                subDistrictId: packageDto.subDistrictId,
                depart_point_lat: packageDto.depart_point_lat,
                depart_point_lon: packageDto.depart_point_lon,
                end_point_lat: packageDto.end_point_lat,
                end_point_lon: packageDto.end_point_lon,
                benefit_include: packageDto.benefit_include,
                benefit_not_include: packageDto.benefit_not_include,
                packageImages: packageDto.packageImage,
                status: packageDto.status,
                created_by: Number(packageDto.created_by),
                updated_by: Number(packageDto.updated_by)
            }
        });

        if (!createpackage) throw new Error("Creating a package something wrong.");

        const createPkgOption = await prisma.packageOption.createMany({
            data: packageDto.packageOption.map((data) => ({
                packageId: createpackage.id,
                pkgOptionId: data.pkgOptionTypeId,
                name: data.name,
                description: data.description,
                adultPrice: data?.adultPrice,
                childPrice: data?.childPrice,
                groupPrice: data?.groupPrice,
            }))
        });

        if (!createPkgOption) throw new Error("Creating a package option something wrong.");

        const createPkgAttraction = await prisma.packageAttraction.createMany({
            data: packageDto.packageAttraction.map((data) => ({
                packageId: createpackage.id,
                attractionName: data.attractionName,
                attractionTime: data.attractionTime,
                description: data?.description,
                status: data.status
            }))
        });

        if (!createPkgAttraction) throw new Error("Creating a pkg attraction something wrong.");

        const result = await prisma.packages.findFirst({
            where: {
                id: createpackage.id
            },
            select: {
                id: true,
                packageName: true,
                description: true,
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
                        packageOptionType: {
                            select: {
                                name: true
                            }
                        },
                        description: true,
                        adultPrice: true,
                        childPrice: true,
                        groupPrice: true,
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

        await CacheHelper.deleteCache(PACKAGE_SCHEMA.PACKAGES_DATA_KEY);

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            depart_point_lat: result?.depart_point_lat ? result.depart_point_lat : 'no data',
            depart_point_lon: result?.depart_point_lon ? result.depart_point_lon : 'no dara',
            end_point_lat: result?.end_point_lat ? result.end_point_lat : 'no data',
            end_point_lon: result?.end_point_lon ? result.end_point_lon : 'no dara',
            benefit_include: parseBenefitInclude,
            benefit_not_include: parseBenefitNotInclude,
            packageImage: parseImageArr,
            packageOption: result?.packageOption ? result.packageOption.map((data) => ({
                id: data.id,
                packageId: data.packageId,
                pkgOptionType: data.packageOptionType?.name ?? "",
                name: data.name ?? "",
                description: data.description ?? "",
                adultPrice: Number(data.adultPrice ?? 0),
                childPrice: Number(data.childPrice ?? 0),
                groupPrice: Number(data.groupPrice ?? 0),
            })) : null,
            pakcageAttraction: result?.packageAttraction ? result.packageAttraction.map((data) => ({
                attractionName: data.attractionName,
                attractionTime: data.attractionTime,
                description: data?.description ? data.description : "nO data",
                status: result?.status ? true : false,
            })) : null,
            status: result?.status ? true : false,
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
            created_by: result?.createBy ? `${result.createBy.firstName} ${result.createBy.lastName}` : 'no data',
            updated_by: result?.updateBy ? `${result.updateBy.firstName} ${result.updateBy.lastName}` : 'no data'
        };

        return resultFormat;
    }

    async findPackage(): Promise<packageEntity[]> {
        
        const packagesCache = await CacheHelper.getCache(PACKAGE_SCHEMA.PACKAGES_DATA_KEY);

        if (packagesCache !== null) {
            const prasePkgCache = JSON.parse(packagesCache);
            return prasePkgCache as packageEntity[];
        }        

        const data = await prisma.packages.findMany({
            orderBy: {
                id: 'desc'
            },
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                packageName: true,
                description: true,
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
                        packageOptionType: {
                            select: {
                                name: true
                            }
                        },
                        description: true,
                        adultPrice: true,
                        childPrice: true,
                        groupPrice: true,
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

        const resultFormat: packageEntity[] = data.map((result) => {
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
            return {
                id: result?.id ? result.id : 0,
                packageName: result?.packageName ? result.packageName : 'no data',
                packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
                description: result?.description ? result.description : 'no data',
                province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
                district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
                subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
                depart_point_lat: result?.depart_point_lat ? result.depart_point_lat : 'no data',
                depart_point_lon: result?.depart_point_lon ? result.depart_point_lon : 'no dara',
                end_point_lat: result?.end_point_lat ? result.end_point_lat : 'no data',
                end_point_lon: result?.end_point_lon ? result.end_point_lon : 'no dara',
                benefit_include: parseBenefitInclude,
                benefit_not_include: parseBenefitNotInclude,
                packageImage: parseImageArr,
                packageOption: result?.packageOption ? result.packageOption.map((data) => ({
                    id: data.id,
                    packageId: data.packageId,
                    pkgOptionType: data.packageOptionType?.name ?? "",
                    name: data.name ?? "",
                    description: data.description ?? "",
                    adultPrice: Number(data.adultPrice ?? 0),
                    childPrice: Number(data.childPrice ?? 0),
                    groupPrice: Number(data.groupPrice ?? 0),
                })) : null,
                pakcageAttraction: result?.packageAttraction ? result.packageAttraction.map((data) => ({
                    attractionName: data.attractionName,
                    attractionTime: data.attractionTime,
                    description: data?.description ? data.description : "nO data",
                    status: data.status
                })) : null,
                status: result?.status ? result.status : 'no data',
                created_at: result?.created_at ? result.created_at : 'no data',
                updated_at: result?.updated_at ? result.updated_at : 'no data',
                created_by: result?.createBy ? `${result.createBy.firstName} ${result.createBy.lastName}` : 'no data',
                updated_by: result?.updateBy ? `${result.updateBy.firstName} ${result.updateBy.lastName}` : 'no data'
            }
        });

        const converResult = JSON.stringify(resultFormat);        
        await CacheHelper.setCache(PACKAGE_SCHEMA.PACKAGES_DATA_KEY, converResult);

        return resultFormat;
    }

    async findPackageById(id: string, req: Request): Promise<packageEntity> {
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
                        packageOptionType: {
                            select: {
                                name: true
                            }
                        },
                        description: true,
                        adultPrice: true,
                        childPrice: true,
                        groupPrice: true,
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
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
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
                name: data.name ?? "",
                description: data.description ?? "",
                adultPrice: Number(data.adultPrice ?? 0),
                childPrice: Number(data.childPrice ?? 0),
                groupPrice: Number(data.groupPrice ?? 0),
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

    async updatePackage(id: string, packageDto: packageDTO): Promise<packageEntity> {
        const recheckPackage = await prisma.packages.count({
            where: {
                id: Number(id),
                deleted_at: null
            }
        });

        if (recheckPackage === 0) throw new Error("This package id not found in the system.");

        const createpackage = await prisma.packages.update({
            where: {
                id: Number(id)
            },
            data: {
                packageName: packageDto.packageName,
                packageTypeId: packageDto.packageTypeId,
                description: packageDto.description,
                provinceId: packageDto.provinceId,
                districtId: packageDto.districtId,
                subDistrictId: packageDto.subDistrictId,
                depart_point_lat: packageDto.depart_point_lat,
                depart_point_lon: packageDto.depart_point_lon,
                end_point_lat: packageDto.end_point_lat,
                end_point_lon: packageDto.end_point_lon,
                benefit_include: packageDto.benefit_include,
                benefit_not_include: packageDto.benefit_not_include,
                packageImages: packageDto.packageImage,
                status: packageDto.status,
                updated_by: Number(packageDto.updated_by)
            }
        });

        if (!createpackage) throw new Error("Updating a package something wrong.");

        await prisma.packageOption.deleteMany({
            where: {
                packageId: Number(id)
            }
        });

        const createPkgOption = await prisma.packageOption.createMany({
            data: packageDto.packageOption.map((data) => ({
                packageId: createpackage.id,
                pkgOptionId: data.pkgOptionTypeId,
                name: data.name,
                description: data.description,
                adultPrice: data?.adultPrice,
                childPrice: data?.childPrice,
                groupPrice: data?.groupPrice,
            }))
        });

        if (!createPkgOption) throw new Error("Updating a package option something wrong.");

        await prisma.packageAttraction.deleteMany({
            where: {
                packageId: Number(id)
            },
        });

        const createPkgAttraction = await prisma.packageAttraction.createMany({
            data: packageDto.packageAttraction.map((data) => ({
                packageId: createpackage.id,
                attractionName: data.attractionName,
                attractionTime: data.attractionTime,
                description: data?.description,
                status: data.status
            }))
        });

        if (!createPkgAttraction) throw new Error("Updating a pkg attraction something wrong.");


        const result = await prisma.packages.findFirst({
            where: {
                id: createpackage.id
            },
            select: {
                id: true,
                packageName: true,
                description: true,
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
                        packageOptionType: {
                            select: {
                                name: true
                            }
                        },
                        description: true,
                        adultPrice: true,
                        childPrice: true,
                        groupPrice: true,
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

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            depart_point_lat: result?.depart_point_lat ? result.depart_point_lat : 'no data',
            depart_point_lon: result?.depart_point_lon ? result.depart_point_lon : 'no dara',
            end_point_lat: result?.end_point_lat ? result.end_point_lat : 'no data',
            end_point_lon: result?.end_point_lon ? result.end_point_lon : 'no dara',
            benefit_include: parseBenefitInclude,
            benefit_not_include: parseBenefitNotInclude,
            packageImage: parseImageArr,
            packageOption: result?.packageOption ? result.packageOption.map((data) => ({
                id: data.id,
                packageId: data.packageId,
                pkgOptionType: data.packageOptionType?.name ?? "",
                name: data.name ?? "",
                description: data.description ?? "",
                adultPrice: Number(data.adultPrice ?? 0),
                childPrice: Number(data.childPrice ?? 0),
                groupPrice: Number(data.groupPrice ?? 0),
            })) : null,
            pakcageAttraction: result?.packageAttraction ? result.packageAttraction.map((data) => ({
                attractionName: data.attractionName,
                attractionTime: data.attractionTime,
                description: data?.description ? data.description : "nO data",
                status: result?.status ? true : false,
            })) : null,
            status: result?.status ? true : false,
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
            created_by: result?.createBy ? `${result.createBy.firstName} ${result.createBy.lastName}` : 'no data',
            updated_by: result?.updateBy ? `${result.updateBy.firstName} ${result.updateBy.lastName}` : 'no data'
        };

        return resultFormat;
    }

    async deletePackage(id: string): Promise<packageEntity> {
        const recheckPackage = await prisma.packages.count({
            where: {
                id: Number(id),
                deleted_at: null
            }
        });

        if (recheckPackage === 0) throw new Error("This package id not found in the system.");

        const deletePackageCash = await prisma.packages.update({
            where: {
                id: Number(id),
            },
            data: {
                deleted_at: new Date(Date.now())
            }
        });

        if (!deletePackageCash) throw new Error("Deleting a package something wrong.");

        const result = await prisma.packages.findFirst({
            where: {
                id: Number(id),
            },
            select: {
                id: true,
                packageName: true,
                description: true,
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
                        packageOptionType: {
                            select: {
                                name: true
                            }
                        },
                        description: true,
                        adultPrice: true,
                        childPrice: true,
                        groupPrice: true,
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

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            depart_point_lat: result?.depart_point_lat ? result.depart_point_lat : 'no data',
            depart_point_lon: result?.depart_point_lon ? result.depart_point_lon : 'no dara',
            end_point_lat: result?.end_point_lat ? result.end_point_lat : 'no data',
            end_point_lon: result?.end_point_lon ? result.end_point_lon : 'no dara',
            benefit_include: parseBenefitInclude,
            benefit_not_include: parseBenefitNotInclude,
            packageImage: parseImageArr,
            packageOption: result?.packageOption ? result.packageOption.map((data) => ({
                id: data.id,
                packageId: data.packageId,
                pkgOptionType: data.packageOptionType?.name ?? "",
                name: data.name ?? "",
                description: data.description ?? "",
                adultPrice: Number(data.adultPrice ?? 0),
                childPrice: Number(data.childPrice ?? 0),
                groupPrice: Number(data.groupPrice ?? 0),
            })) : null,
            pakcageAttraction: result?.packageAttraction ? result.packageAttraction.map((data) => ({
                attractionName: data.attractionName,
                attractionTime: data.attractionTime,
                description: data?.description ? data.description : "nO data",
                status: result?.status ? true : false,
            })) : null,
            status: result?.status ? true : false,
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
            created_by: result?.createBy ? `${result.createBy.firstName} ${result.createBy.lastName}` : 'no data',
            updated_by: result?.updateBy ? `${result.updateBy.firstName} ${result.updateBy.lastName}` : 'no data'
        };

        return resultFormat;
    }
}