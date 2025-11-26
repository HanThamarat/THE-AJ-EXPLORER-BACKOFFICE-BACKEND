import { z } from "zod";

export const bookingEntitySchema = z.object({
    id: z.number().int().optional(),
    bookingId: z.string().optional(),
    paymentRef: z.string().optional(),
    paymentStatus: z.enum(["panding", "paid", "failed"]),
    bookingStatus: z.enum(["panding", "confirmed", "failed"]),
    packageId: z.number().int(),
    userId: z.string(),
    childPrice: z.number().optional(),
    childQty: z.number().int().optional(),
    adultPrice: z.number().optional(),
    adultQty: z.number().int().optional(),
    groupPrice: z.number().optional(),
    groupQty: z.number().int().optional(),
    amount: z.number(),
    additionalDetail: z.string().optional(),
    locationId: z.number().int().optional(),
    pickup_lat: z.number(),
    pickup_lgn: z.number(),
    trip_at: z.union([z.date(), z.string()]),
    policyAccept: z.boolean(),
    expire_at: z.union([z.date(), z.string()]).optional(),
    created_at: z.union([z.date(), z.string()]).optional(),
    updated_at: z.union([z.date(), z.string()]).optional(),
});

export type bookingEntity = z.infer<typeof bookingEntitySchema>;

export const clientBookingCreateSchema = z.object({
    userId: z.string().min(1),
    packageId: z.coerce.number().int(),
    childPrice: z.coerce.number().optional(),
    childQty: z.coerce.number().int().optional(),
    adultPrice: z.coerce.number().optional(),
    adultQty: z.coerce.number().int().optional(),
    groupPrice: z.coerce.number().optional(),
    groupQty: z.coerce.number().int().optional(),
    amount: z.coerce.number(),
    additionalDetail: z.string().optional(),
    locationId: z.coerce.number().int().optional(),
    pickup_lat: z.coerce.number(),
    pickup_lgn: z.coerce.number(),
    trip_at: z.union([z.date(), z.string()]),
    policyAccept: z.boolean(),
});

export type ClientBookingCreateBody = z.infer<typeof clientBookingCreateSchema>;
