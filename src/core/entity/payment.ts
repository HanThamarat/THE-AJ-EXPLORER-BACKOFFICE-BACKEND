import z from "zod";

export const CardDTOSchema = z.object({
    card_name:  z.string().min(3),
    card_number: z.string().min(3),
    expiration_month: z.number(),
    expiration_year: z.number(),
    security_code: z.string(),
    city: z.string(),
    postal_code: z.string(),
});

export type CardDTOType = z.infer<typeof CardDTOSchema>;

export const contractBookingSchema = z.object({
    id: z.number().int().optional(),
    firstName: z.string().min(3),
    lastName: z.string().min(3),
    email: z.string().email(),
    country: z.string(),
    phoneNumber: z.string().min(10).max(10),
    userId: z.string().optional(),
    created_at: z.union([z.date(), z.string()]).optional(),
    updated_at: z.union([z.date(), z.string()]).optional(),
});

export type contractBookingEntity = z.infer<typeof contractBookingSchema>;

export const BookingByCardDTO = z.object({
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
    pickupLocation: z.string().optional(),
    contractBooking: contractBookingSchema,
    policyAccept: z.boolean(),
    card: CardDTOSchema
});

export type BookingByCardDTOType = z.infer<typeof BookingByCardDTO>;

export const chargeDTOSchema = z.object({
    userId: z.string().optional(),
    bookingId: z.string(),
});

export type chargeDTO = z.infer<typeof chargeDTOSchema>;

export const createMobileBankChargeSchema = z.object({
    userId: z.string().optional(),
    bank: z.string().optional(),
    bookingId: z.string(),
});

export type createMobileBankChargeType = z.infer<typeof createMobileBankChargeSchema>;