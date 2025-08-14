import { packageDTO, packageEntity, packageOptionEntity } from "../../../core/entity/package";
import { PackageRepositoryPort } from "../../../core/ports/packageRepositoryPort";
import { prisma } from "../../database/data-source";

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
                lat: packageDto.lat,
                lon: packageDto.lon,
                packageImages: packageDto.packageImage,
                status: packageDto.status,
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

        const result = await prisma.packages.findFirst({
            where: {
                id: createpackage.id
            },
            select: {
                id: true,
                packageName: true,
                description: true,
                lon: true,
                lat: true,
                status: true,
                created_at: true,
                updated_at: true,
                packageImages: true,
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
                }
            }
        });

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            lon: result?.lon ? result.lon : 'no data',
            lat: result?.lat ? result.lat : 'no dara',
            packageImage: result?.packageImages ? result.packageImages : 'no data',
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
            status: result?.status ? result.status : 'no data',
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
        };

        return resultFormat;
    }

    async findPackage(): Promise<packageEntity[]> {
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
                lon: true,
                lat: true,
                status: true,
                created_at: true,
                updated_at: true,
                packageImages: true,
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
                }
            }
        });

        const resultFormat: packageEntity[] = data.map((result) => ({
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            lon: result?.lon ? result.lon : 'no data',
            lat: result?.lat ? result.lat : 'no dara',
            packageImage: result?.packageImages ? result.packageImages : 'no data',
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
            status: result?.status ? result.status : 'no data',
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
        }))

        return resultFormat;
    }

    async findPackageById(id: string): Promise<packageEntity> {
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
                lon: true,
                lat: true,
                status: true,
                created_at: true,
                updated_at: true,
                packageImages: true,
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
                }
            }
        });

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            lon: result?.lon ? result.lon : 'no data',
            lat: result?.lat ? result.lat : 'no dara',
            packageImage: result?.packageImages ? result.packageImages : 'no data',
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
            status: result?.status ? result.status : 'no data',
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
        };

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
                lat: packageDto.lat,
                lon: packageDto.lon,
                packageImages: packageDto.packageImage,
                status: packageDto.status,
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

        const result = await prisma.packages.findFirst({
            where: {
                id: createpackage.id
            },
            select: {
                id: true,
                packageName: true,
                description: true,
                lon: true,
                lat: true,
                status: true,
                created_at: true,
                updated_at: true,
                packageImages: true,
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
                }
            }
        });

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            lon: result?.lon ? result.lon : 'no data',
            lat: result?.lat ? result.lat : 'no dara',
            packageImage: result?.packageImages ? result.packageImages : 'no data',
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
            status: result?.status ? result.status : 'no data',
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
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
                lon: true,
                lat: true,
                status: true,
                created_at: true,
                updated_at: true,
                packageImages: true,
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
                }
            }
        });

        const resultFormat: packageEntity = {
            id: result?.id ? result.id : 0,
            packageName: result?.packageName ? result.packageName : 'no data',
            packageType: result?.pacakgeType?.name ? result.pacakgeType.name : 'no data',
            description: result?.description ? result.description : 'no data',
            province: result?.province?.nameEn ? result?.province?.nameEn : 'no data',
            district: result?.district?.nameEn ? result.district.nameEn : 'no data', 
            subDistrict: result?.subdistrict?.nameEn ? result.subdistrict.nameEn : 'no data',
            lon: result?.lon ? result.lon : 'no data',
            lat: result?.lat ? result.lat : 'no dara',
            packageImage: result?.packageImages ? result.packageImages : 'no data',
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
            status: result?.status ? result.status : 'no data',
            created_at: result?.created_at ? result.created_at : 'no data',
            updated_at: result?.updated_at ? result.updated_at : 'no data',
        };

        return resultFormat;
    }
}