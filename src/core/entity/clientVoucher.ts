import { type } from "os";
import z from "zod";

export const couponEntitySchema = z.object({
    id: z.number(),
    couponName: z.string().optional(),
    type: z.string(),
    maxPercentDiscount: z.number().optional(),
    minimumPercentDiscount: z.number().optional(),
    description: z.string().nullable(),
});

export type couponEntityType = z.infer<typeof couponEntitySchema>;

export const couponsResponseSchema = z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPage: z.number(),
    nextPage: z.number(),
    prevPage: z.number(),
    items: z.array(couponEntitySchema).min(0)
});

export type couponsResponseType = z.infer<typeof couponsResponseSchema>;

export const couponSearchParamsSchema = z.object({
    page: z.number(),
    limit: z.number(),
    userId: z.string().optional()
});

export type couponSearchParamsType = z.infer<typeof couponSearchParamsSchema>;

export const couponInventoryDTOSchema = z.object({
    userId: z.string().optional(),
    couponId: z.number()
});

export type couponInventoryDTOType = z.infer<typeof couponInventoryDTOSchema>;