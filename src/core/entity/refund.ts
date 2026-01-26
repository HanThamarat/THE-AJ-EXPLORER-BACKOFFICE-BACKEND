import z, { ZodLazy } from "zod";

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

export type refundEntityType =  z.infer<typeof refundEntitySchema>;

export const bankAccountSchema = z.object({
    bankName: z.string(),
    accountFirstName: z.string(),
    accountLastName: z.string(),
    accountNumber: z.string()
});

export type bankAccountType = z.infer<typeof bankAccountSchema>;

export const refundDetailSchema = z.object({
    bookingId: z.string(),
    bookerName: z.string(),
    packageName: z.string(),
    paymentStatus: z.string(),
    refundStatus: z.string(),
    amount: z.number(),
    refundPercentahe: z.number(),
    refundAmount: z.number(),
    paymentMethod: z.string().nullable(),
    bankInfo: bankAccountSchema
});

export type refundDetailType = z.infer<typeof refundDetailSchema>;

export const refundDTOSchema = z.object({
    refundStatus: z.enum(["panding", "refunded", "failed"]),
});

export type refundDTOType = z.infer<typeof refundDTOSchema>;