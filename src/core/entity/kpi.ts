import z from "zod";

export const popularProviceSchema = z.object({
    provinceId: z.number(),
    provinceName: z.string(),
    qty: z.number(),
});

export type popularProviceType = z.infer<typeof popularProviceSchema>;

export const qtyEntitySchema = z.object({
    qty: z.number()
});

export type qtyEntityType = z.infer<typeof qtyEntitySchema>;

export const overviewEntitySchema = z.object({
    bookingId: z.string(),
    packageName: z.string(),
    booker: z.string(),
    amount: z.number(),
    paymentStatus: z.string(),
    bookingStatus: z.string(),
    peopleQty: z.number(),
});

export type overviewEntityType = z.infer<typeof overviewEntitySchema>;