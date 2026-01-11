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

export const bookerInfoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phoneNumber: z.string().email(),
    country: z.string(),
});

export type bookerInfoType = z.infer<typeof bookerInfoSchema>;

export const bookingDetailEntitySchema = z.object({
    bookingId: z.string(),
    packageName: z.string(),
    amount: z.number(),
    pickUpLocation: z.string(),
    paymentStatus: z.string(),
    bookingStatus: z.string(),
    booker: bookerInfoSchema,
});

export type bookingDetailEntityType = z.infer<typeof bookingDetailEntitySchema>;

export const bookingDetailDTOSchema = z.object({
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    country: z.string().min(2).max(10),
    email: z.string().email(),
    phoneNumber: z.string(),
    trip_at: z.union([z.string(), z.date()]),
    pickupLocation: z.string(),
    specialRequirement: z.string(),
});

export type bookingDetailDTOType = z.infer<typeof bookingDetailDTOSchema>;