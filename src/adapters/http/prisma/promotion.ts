import { PromotionDTO, Promotion, PromotionLinkDTO, PromotionLink, promotionDay } from "../../../core/entity/promotion";
import { PromoRepositoryPort } from "../../../core/ports/promoRepositoryPort";
import { prisma } from "../../database/data-source";
import { findPromoByID } from "../../database/querys/promo";

export class PromoPrismaORM implements PromoRepositoryPort {
    async create(promoDto: PromotionDTO): Promise<Promotion> {

        const createPromo = await prisma.$transaction(async (tx) => {
            const Promo = await tx.packagePromo.create({
                data: {
                    promoName: promoDto.promoName,
                    type: promoDto.type,
                    couponCode: promoDto.couponCode,
                    description: promoDto.description,
                    startDate: promoDto.startDate,
                    endDate: promoDto.endDate,
                    status: promoDto.status,
                    created_by: Number(promoDto.created_by),
                    updated_by: Number(promoDto.updated_by)
                }
            });

            await tx.promoLink.createMany({
                data: promoDto.packagePromoLink.map((data: PromotionLinkDTO) => ({
                    percentage: data.percentage,
                    packageLink: data.packageLink,
                    promoId: Promo.id
                }))
            });

            return Promo;
        });

        if (!createPromo) throw new Error("Creating a promotion link failed."); 

        const response = await findPromoByID(createPromo.id);

        return response as Promotion;
    }

    async findAll(): Promise<Promotion[]> {
        const result = await prisma.packagePromo.findMany({
            orderBy: {
                updated_at: 'desc'
            },
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                promoName: true,
                startDate: true,
                endDate: true,
                created_at: true,
                created_by: true,
                updated_at: true,
                updated_by: true,
                description: true,
                type: true,
                couponCode: true,
                status: true,
                promoLink: {
                    select: {
                        id: true,
                        packageLink: true,
                        packagePromoLink: {
                            select: {
                                packageName: true
                            }
                        },
                        percentage: true
                    }
                },
                userCreate: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                userUpdate: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const responseFormated: Promotion[] = result.map((response) => ({
            id: response?.id ? response.id : 0,
            promoName: response?.promoName ? response.promoName : 'no data',
            type: response.type,
            couponCode: response?.couponCode ? response.couponCode : "no data",
            description: response?.description ? response.description : "no data",
            startDate: response?.startDate ? response.startDate : 'no data',
            endDate: response?.endDate ? response.endDate : 'nodata',
            status: response?.status ? response.status : "no data",
            packagePromoLink: response?.promoLink.length ? response?.promoLink.map<PromotionLink>((data) => ({
                id: data?.id ? data.id : 0,
                pakcageId: data?.packageLink ? data.packageLink : 0,
                packageLink: data?.packagePromoLink?.packageName ? data?.packagePromoLink?.packageName : 'no data',
                percentage: Number(data?.percentage) ? Number(data.percentage) : 0
            })) : [],
            created_by: response?.userCreate?.firstName || response?.userCreate?.lastName ? `${response?.userCreate?.firstName} ${response?.userCreate.lastName}` : 'no data',
            created_at: response?.created_at ? response.created_at : 'no data',
            updated_at: response?.updated_at ? response.updated_at : 'no data',
            updated_by: response?.userUpdate?.firstName || response?.userUpdate?.lastName ? `${response?.userUpdate?.firstName} ${response?.userUpdate.lastName}` : 'no data',
        }));

        return responseFormated;
    }

    async findById(id: string): Promise<Promotion> {
        const recheckPromotion = await prisma.packagePromo.count({
            where: {
                deleted_at: null,
                id: Number(id)
            }
        });

        if (recheckPromotion === 0) throw new Error("This package promotion id no found in the system.");

        const response = await findPromoByID(Number(id));

        return response as Promotion;
    }

    async update(id: string, promoDto: PromotionDTO): Promise<Promotion> {
        const recheckPromotion = await prisma.packagePromo.findFirst({
            where: {
                deleted_at: null,
                id: Number(id)
            }
        });

        if (!recheckPromotion) throw new Error("This package promotion id no found in the system.");

        const recheckPromotionName = await prisma.packagePromo.findFirst({
            where: {
                promoName: {
                    equals: promoDto.promoName,
                    mode: 'insensitive'
                }
            }
        });

        if (recheckPromotionName && recheckPromotion.promoName.toLocaleLowerCase !== promoDto.promoName.toLocaleLowerCase) throw new Error("This promotion name already in the system.");

        const updatePro = await prisma.$transaction(async (tx) => {
            const updatePromo = await tx.packagePromo.update({
                where: {
                    id: Number(id),
                },
                data: {
                    promoName: promoDto.promoName,
                    type: promoDto.type,
                    couponCode: promoDto.couponCode,
                    description: promoDto.description,
                    startDate: promoDto.startDate,
                    endDate: promoDto.endDate,
                    status: promoDto.status,
                    updated_by: Number(promoDto.updated_by)
                }
            });

            if (!updatePromo) throw new Error("Updating a promotion failed.");

            const getPromoLink = await tx.promoLink.findMany({
                where: {
                    promoId: updatePromo.id
                }
            });

            const promoLink: PromotionLinkDTO[] = getPromoLink.map((data) => ({
                id: data.id,
                promoId: data.promoId,
                percentage: data.percentage,
                packageLink: data.packageLink
            }));

            const existingIds = new Set(promoDto.packagePromoLink.map((p) => p.id));

            // filter data
            const promoLinkCreatArr = promoDto.packagePromoLink.filter((p) => p.id === undefined);
            const promoLinkDeleteArr = promoLink.filter((p) => !existingIds.has(p.id));
            const promoLinkUpdateArr = promoLink.filter((p) => existingIds.has(p.id));
            
            if (promoLinkDeleteArr.length !== 0) {
                for (const promoLink of promoLinkDeleteArr) {
                    await tx.promoLink.delete({
                        where: {
                            id: promoLink.id
                        }
                    });
                }
            }

            if (promoLinkUpdateArr.length !== 0) {
                for (const promoLinkUpdate of promoLinkUpdateArr) {
                    await tx.promoLink.update({
                        where: {
                            id: promoLinkUpdate.id
                        },
                        data: {
                            percentage: promoLinkUpdate.percentage,
                            packageLink: promoLinkUpdate.packageLink 
                        }
                    });
                }
            }

            if (promoLinkCreatArr.length !== 0) {
                for (const promoLinkCreat of promoLinkCreatArr) {
                    await tx.promoLink.create({
                        data: {
                            percentage: promoLinkCreat.percentage,
                            packageLink: promoLinkCreat.packageLink,
                            promoId: updatePromo.id
                        }
                    })
                }
            }

            return updatePromo;
        })

        const response = await findPromoByID(updatePro.id);

        return response as Promotion;
    }

    async delete(id: string): Promise<Promotion> {
        const recheckPromotion = await prisma.packagePromo.count({
            where: {
                deleted_at: null,
                id: Number(id)
            }
        });

        if (recheckPromotion === 0) throw new Error("This package promotion id no found in the system.");

        const deletedPromo = await prisma.packagePromo.update({
            where: {
                id: Number(id)
            },
            data: {
                deleted_at: new Date(),
            }
        });

        if (!deletedPromo) throw new Error("Deleting a promotion failed.");

        const response = await findPromoByID(deletedPromo.id);

        return response as Promotion;
    }

    async findPromoDay(): Promise<promotionDay[]> {
        const result = await prisma.packagePromo.findMany({
            select: {
                id: true,
                startDate: true,
                endDate: true,
                type: true
            }
        });

        return result;
    }
}