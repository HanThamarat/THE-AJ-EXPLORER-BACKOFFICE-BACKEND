import { z } from "../../conf/zod-conf";
import { imageEntitySchema } from "../../types/image";

export const reviewDTOSchema = z.object({
    bookingId: z.string(),
    cleanliness: z.number(),
    staff: z.number(),
    location: z.number(),
    title: z.string().optional().nullable(),
    samary: z.string().optional().nullable(),
});

export type reviewDTOType = z.infer<typeof reviewDTOSchema>;

export const reviewEntitySchema = z.object({
    id: z.number(),
    bookingId: z.string(),
    cleanliness: z.number(),
    staff: z.number(),
    location: z.number(),
    title: z.string().optional().nullable(),
    samary: z.string().optional().nullable(),
    iamge: z.string().optional().nullable(),
    created_at: z.union([z.string(), z.date()]),
    updated_at: z.union([z.string(), z.date()]),
});

export type reviewEntityType = z.infer<typeof reviewEntitySchema>;

export const reviewResponseSchema = z.object({
    bookingId: z.string(),
    packageName: z.string(),
    trip_at: z.union([z.string(), z.date()]),
    image: imageEntitySchema,
});

export type reviewResponseType = z.infer<typeof reviewResponseSchema>;

