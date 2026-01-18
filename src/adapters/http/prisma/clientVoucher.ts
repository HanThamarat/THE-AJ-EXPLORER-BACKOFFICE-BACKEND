import { couponEntityType, couponInventoryDTOType, couponSearchParamsType, couponsResponseType } from "../../../core/entity/clientVoucher";
import { ClientVoucherRepositoryPort } from "../../../core/ports/clientVoucherRepositoryPort";
import dayjs from "dayjs";
import { prisma } from "../../database/data-source";

export class ClientVoucherDataSource implements ClientVoucherRepositoryPort {

    async findAllCoupon(params: couponSearchParamsType): Promise<couponsResponseType> {
        const skip: number = (params.page - 1) * params.limit;
        const take: number = params.limit;
        let couponInventoryId: Array<number> = [];
        
        if (params.userId) {
            const couponInvent = await prisma.couponInventory.findMany({
                where: {
                    userId: params.userId
                },
                select: {
                    toPromo: {
                        select: {
                            id: true
                        }
                    }
                }
            });

            await couponInvent.map((item) => couponInventoryId.push(item.toPromo.id));
        }

        const [couponResult, total] = await Promise.all([
            prisma.packagePromo.findMany({
                where: {
                    startDate: {
                        lte: dayjs().format(),
                    },
                    endDate: {
                        gte: dayjs().format(),
                    },
                    type: "coupon"
                },
                select: {
                    id: true,
                    type: true,
                    promoName: true,
                    description: true,
                    promoLink: {
                        select: {
                            percentage: true,
                        }
                    }
                }
            }),
            prisma.packagePromo.count({
                where: {
                    startDate: {
                        gte: dayjs().format(),
                    },
                    endDate: {
                        lte: dayjs().format(),
                    },
                    type: "coupon"
                }
            })
        ]);

        const resultResponse: couponEntityType[] = await Promise.all(couponResult.map((item) => {

            const findMaxValue = Math.max(...item.promoLink.map(p => p.percentage));
            const findMinValue = Math.min(...item.promoLink.map(p => p.percentage));

            return {
                id: item.id,
                type: item.type,
                couponName: item.promoName,
                maxPercentDiscount: findMaxValue,
                minimumPercentDiscount: findMinValue,
                description: item.description
            }
        }));

        const filteredResult = resultResponse.filter(item => !couponInventoryId.includes(item.id));

        return {
            page: params.page,
            limit: params.limit,
            total: total,
            totalPage: Math.ceil(total / params.limit),
            nextPage: params.page * params.limit < total ? params.page + 1 : null,
            prevPage: params.page > 1 ? params.page -1 : null,
            items: filteredResult
        } as couponsResponseType;
    }

    async addCouponInventory(couponInventoryDTO: couponInventoryDTOType): Promise<couponEntityType> {
        const recheckCoupon = await prisma.packagePromo.count({
            where: {
                id: couponInventoryDTO.couponId
            }
        });

        if (recheckCoupon === 0) throw new Error("This coupon id don't have in the system");

        const recheckExpire = await prisma.packagePromo.findMany({
            where: {
                startDate: {
                    lte: dayjs().format(),
                },
                endDate: {
                    gte: dayjs().format(),
                }
            },
            select: {
                id: true,
                type: true,
                description: true,
            }
        });

        const recheckCouponInventory = await prisma.couponInventory.findFirst({
            where: {
                userId: couponInventoryDTO.userId as string,
                couponId: couponInventoryDTO.couponId
            }
        });

        if (recheckCouponInventory && recheckExpire) throw new Error("This coupon have in the systems.");

        const createNewInventory = await prisma.couponInventory.create({
            data: {
                userId: couponInventoryDTO.userId as string,
                couponId: couponInventoryDTO.couponId
            },
            select: {
                id: true,
                toPromo: {
                    select: {
                        id: true,
                        type: true,
                        description: true
                    }
                }
            }
        });

        return {
            id: createNewInventory.id,
            type: createNewInventory.toPromo.type,
            description: createNewInventory.toPromo.description
        }
    }
}