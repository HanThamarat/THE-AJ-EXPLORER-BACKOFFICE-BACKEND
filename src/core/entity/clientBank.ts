import z from "zod";

export const bankEntitySchema = z.object({
    id: z.number(),
    bankNameEn: z.string(),
    bankNameTh: z.string(),
    bankCode: z.string(),
    bankPicture: z.string(),
});

export type bankEntityType = z.infer<typeof bankEntitySchema>;