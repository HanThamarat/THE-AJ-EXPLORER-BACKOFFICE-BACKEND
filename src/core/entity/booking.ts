import { z } from "zod";

export const bkEntitySchema = z.object({
    id: z.number().int().optional(),
    bookingId: z.string().optional(),
    paymentRef: z.string().nullable().optional(),
    paymentStatus: z.enum(["panding", "paid", "failed"]),
    bookingStatus: z.enum(["panding", "confirmed", "failed"]),
    packageName: z.string().nullable(),
    name: z.string().nullable(),
    trip_at: z.union([z.date(), z.string()]),
    created_at: z.union([z.date(), z.string()]),
    updated_at: z.union([z.date(), z.string()]),
});

export type bkEntity = z.infer<typeof bkEntitySchema>;

export const bookingAvgDataSchema = z.object({
    name: z.string(),
    avg: z.number()
})

export type bookingAvgDataType = z.infer<typeof bookingAvgDataSchema>;

export const bookingAvgSchema = z.object({
    type: z.string(),
    data: z.array(bookingAvgDataSchema),
});

export type bookingAvgEntity = z.infer<typeof bookingAvgSchema>;