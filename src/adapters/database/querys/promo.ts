import { Promotion, PromotionLink } from "../../../core/entity/promotion";
import { prisma } from "../data-source";

export const findPromoByID = async (id: number): Promise<Promotion | unknown> => {
    try {
        const response = await prisma.packagePromo.findFirst({
            where: {
                id: id,
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
                status: true,
                type: true,
                description: true,
                couponCode: true,
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

        const responseFormated: Promotion = {
            id: response?.id ? response.id : 0,
            promoName: response?.promoName ? response.promoName : 'no data',
            type: response?.type ? response.type : 'promotion',
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
            })) : 'no data',
            created_by: response?.userCreate?.firstName || response?.userCreate?.lastName ? `${response?.userCreate?.firstName} ${response?.userCreate.lastName}` : 'no data',
            created_at: response?.created_at ? response.created_at : 'no data',
            updated_at: response?.updated_at ? response.updated_at : 'no data',
            updated_by: response?.userUpdate?.firstName || response?.userUpdate?.lastName ? `${response?.userUpdate?.firstName} ${response?.userUpdate.lastName}` : 'no data',
        };
                
        return responseFormated;
    } catch (err) {
        return err;
    }
};