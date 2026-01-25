import z from "zod";
import { referencesSchema } from "./financial";

export const cancelEntitySchema = z.object({
    bookingId: z.string(),
    bookerName: z.string(),
    packageName: z.string(),
    paymentStatus: z.string(),
    cancelStatus: z.string(),
    refundPercentage: z.number(),
    refundAmount: z.number(),
    amount: z.number(),
    trip_at: z.union([z.string(), z.date()])
});

export type cancelEntityType = z.infer<typeof cancelEntitySchema>;

export const cancelDetailEntitySchema = z.object({
    bookingId: z.string(),
    bookerName: z.string(),
    packageName: z.string(),
    paymentStatus: z.string(),
    cancelStatus: z.string(),
    refundPercentage: z.number(),
    refundAmount: z.number(),
    amount: z.number(),
    email: z.string().email(),
    phoneNumber: z.string(),
    pickupPoint: z.string(),
    trip_at: z.union([z.string(), z.date()])
});

export type cancelDetailEntityType = z.infer<typeof cancelDetailEntitySchema>;

export const cancelDTOSchema = z.object({
    cancelStatus: z.enum(["panding", "confirmed", "failed"]),
});

export type cancelDTOType = z.infer<typeof cancelDTOSchema>;

export const refundEntitySchema = z.object({
    bookingId: z.string(),
    bookerName: z.string(),
    packageName: z.string(),
    paymentStatus: z.string(),
    refundStatus: z.string(),
    amount: z.number(),
    refundPercentahe: z.number(),
    refundAmount: z.number()
});

export type refundEntityType =  z.infer<typeof referencesSchema>;