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

export const bookerInfoSchema = z.object({
    bookerName: z.string(),
    image: z.string(),
});

export type bookerInfoType = z.infer<typeof bookerInfoSchema>;

export const packageReviewSchema = z.object({
    title: z.string(),
    sumary: z.string(),
    ratingStar: z.number(),
    created_at: z.union([z.string(), z.date()]),
    booker: bookerInfoSchema
});

export type packageReviewType = z.infer<typeof packageReviewSchema>;

export const packageReviewSearchParams = z.object({
    packageid: z.number(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(10),
});

export type packageReviewSearchType = z.infer<typeof packageReviewSearchParams>;

export const reviewSQLStatementSchema = z.object({
  title: z.string(),
  samary: z.string(),
  staff: z.number(),
  cleanliness: z.number(),
  location: z.number(), 
  created_at: z.union([z.string(), z.date()]),
  bookerimage: z.string().nullable(),
  bookername: z.string(),
});

export type reviewSQLStatementType = z.infer<typeof reviewSQLStatementSchema>;

export const packageReviwResponseSchema = z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPage: z.number().int(),
    nextPage: z.number().int(),
    prevPage: z.number().int(),
    items: z.array(packageReviewSchema),
});

export type packageReviwResponseType = z.infer<typeof packageReviwResponseSchema>;
