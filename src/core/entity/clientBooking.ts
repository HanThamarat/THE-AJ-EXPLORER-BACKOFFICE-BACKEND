import { z } from "zod";
import { imageEntitySchema } from "../../const/schema/image";
import { payStatus } from "@prisma/client";
import { type } from "os";

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

export const bookingEntitySchema = z.object({
    id: z.number().int().optional(),
    bookingId: z.string().optional(),
    paymentRef: z.string().optional(),
    paymentStatus: z.enum(["panding", "paid", "failed"]),
    bookingStatus: z.enum(["panding", "confirmed", "failed"]),
    packageId: z.number().int(),
    contractBooking: contractBookingSchema,
    childPrice: z.number().optional(),
    childQty: z.number().int().optional(),
    adultPrice: z.number().optional(),
    adultQty: z.number().int().optional(),
    groupPrice: z.number().optional(),
    groupQty: z.number().int().optional(),
    amount: z.number(),
    additionalDetail: z.string().optional(),
    pickupLocation: z.string().optional(),
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
});

export type ClientBookingCreateBody = z.infer<typeof clientBookingCreateSchema>;

export const packageDetailSchema = z.object({
    packageId: z.number(),
    packageName: z.string(),
    packageMainImage: imageEntitySchema
});

export type packageDetailType = z.infer<typeof packageDetailSchema>;

export const bookingDetailSchema = z.object({
    bookingId: z.string(),
    bookingStatus: z.string(),
    package: packageDetailSchema
});

export type bookingDetailType = z.infer<typeof bookingDetailSchema>;

export const mytripEntitySchema = z.object({
    province_name: z.string().min(3),
    trip_date:  z.string(),
    booking_detail: z.array(bookingDetailSchema).min(0)
});

export type mytripEntityType = z.infer<typeof mytripEntitySchema>;

export interface findBookingType {
    bookingId:  string;
    bookingStatus: string;
    trip_at: string | Date;
    packageid: number;
    packageImages: string;
    packageName: string;
    nameEn: string;
}

export const bookedCapacityInfoSchema = z.object({
    adult: z.number().nullable(),
    adultPrice: z.number().nullable(),
    child: z.number().nullable(),
    childPrice: z.number().nullable(),
    group: z.number().nullable(),
    groupPrice: z.number().nullable(),
    totalPrice: z.number()
});

export type bookedCapacityInfoType = z.infer<typeof bookedCapacityInfoSchema>;

export const bookerInfoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
});

export type bookerInfoType = z.infer<typeof bookerInfoSchema>;

export const bookingInfoSchema = z.object({
    bookingzId: z.string(),
    payStatus: z.string(),
    bookingStatus: z.string(),
    packageName: z.string(),
    packageImage: z.string(),
    trip_at: z.union([z.date(), z.string()]),
    bookerInfo: bookerInfoSchema,
    pickUpLocation: z.string(),
    specialRequest: z.string().nullable(),
    booked_info: bookedCapacityInfoSchema,
});

export type bookingInfoType = z.infer<typeof bookingInfoSchema>;

export const bankAccDTOSchema = z.object({
    bankId: z.number(),
    accountFirstName: z.string(),
    accountLastName: z.string(),
    accountNumber: z.string()
});

export type bankAccDTOType = z.infer<typeof bankAccDTOSchema>;

export const cancelBookingDTO = z.object({
    bookingId: z.string(),
    userId: z.string().optional(),
    bankAccount: bankAccDTOSchema
});

export type cancelBookingType = z.infer<typeof cancelBookingDTO>;

export const cancelBookingResponseSchema = z.object({
    bookingId:  z.string(),
    amount: z.number(),
    cancelStatus: z.string(),
    refundStatus: z.string().optional(),
    canceled_at: z.union([z.date(), z.string()]),
});

export type cancelBookingResponseType = z.infer<typeof cancelBookingResponseSchema>;