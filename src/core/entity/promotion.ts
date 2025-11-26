import { z } from "zod";

const promotionTypeEnum = z.enum(["promotion", "coupon"]);

export const promotionLinkDTOSchema = z.object({
    id: z.number().int().optional(),
    promoId: z.number().int().optional(),
    percentage: z.number(),
    packageLink: z.number().int(),
});

export type PromotionLinkDTO = z.infer<typeof promotionLinkDTOSchema>;

export const promotionDTOSchema = z.object({
    promoName: z.string(),
    type: promotionTypeEnum,
    couponCode: z.string().optional(),
    description: z.string().optional(),
    startDate: z.union([z.date(), z.string()]),
    endDate: z.union([z.date(), z.string()]),
    status: z.boolean(),
    packagePromoLink: z.array(promotionLinkDTOSchema),
    created_by: z.coerce.number().int(),
    updated_by: z.coerce.number().int(),
});

export type PromotionDTO = z.infer<typeof promotionDTOSchema>;

export const promotionLinkEntitySchema = z.object({
    id: z.number().int(),
    packageLink: z.string(),
    pakcageId: z.number().int(),
    percentage: z.number(),
});

export type PromotionLink = z.infer<typeof promotionLinkEntitySchema>;

export const promotionEntitySchema = z.object({
    id: z.number().int(),
    promoName: z.string(),
    type: promotionTypeEnum,
    couponCode: z.string().optional(),
    description: z.string().optional(),
    startDate: z.union([z.date(), z.string()]),
    endDate: z.union([z.date(), z.string()]),
    status: z.union([z.boolean(), z.string()]),
    packagePromoLink: z.union([z.array(promotionLinkEntitySchema), z.string()]),
    created_by: z.union([z.number(), z.string()]),
    created_at: z.union([z.date(), z.string()]),
    updated_by: z.union([z.number(), z.string()]),
    updated_at: z.union([z.date(), z.string()]),
});

export type Promotion = z.infer<typeof promotionEntitySchema>;

export const promotionDaySchema = z.object({
    id: z.number().int(),
    startDate: z.union([z.string(), z.date()]),
    endDate: z.union([z.string(), z.date()]),
    type: promotionTypeEnum,
});

export type promotionDay = z.infer<typeof promotionDaySchema>;

const promotionLinkBodyBaseSchema = z.object({
    id: z.coerce.number().int().optional(),
    percentage: z.coerce.number(),
    packageLink: z.coerce.number().int(),
});

export const promotionCreateBodySchema = z.object({
    promoName: z.string().min(1),
    type: promotionTypeEnum,
    couponCode: z.string().optional(),
    description: z.string().optional(),
    startDate: z.union([z.date(), z.string()]),
    endDate: z.union([z.date(), z.string()]),
    status: z.boolean(),
    PromoLink: z.array(promotionLinkBodyBaseSchema.omit({ id: true })),
});

export type PromotionCreateBody = z.infer<typeof promotionCreateBodySchema>;

export const promotionUpdateBodySchema = promotionCreateBodySchema.extend({
    PromoLink: z.array(promotionLinkBodyBaseSchema),
});

export type PromotionUpdateBody = z.infer<typeof promotionUpdateBodySchema>;

export const promotionIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "Promotion id must be numeric."),
});

export type PromotionIdParams = z.infer<typeof promotionIdParamSchema>;