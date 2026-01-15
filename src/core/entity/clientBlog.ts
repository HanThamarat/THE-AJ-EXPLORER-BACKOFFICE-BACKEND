import z from "zod"
import { imageEntitySchema } from "../../types/image";
import { lutimes } from "fs";

export const blogListEntitySchema = z.object({
    id: z.number(),
    blogName: z.string(),
    blogType: z.string(),
    viewer: z.number(),
    description: z.string().optional().nullable(),
    thumnbnail: imageEntitySchema,
    created_at: z.union([z.string(), z.date()]),
    created_by: z.string()
});

export type blogListEntityType = z.infer<typeof blogListEntitySchema>;

export const blogSearchParamsSchema = z.object({
    page: z.number(),
    limit: z.number()
});

export type blogSearchParamsType = z.infer<typeof blogSearchParamsSchema>;

export const blogListResponseSchema = z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPage: z.number(),
    nextPage: z.number(),
    prevPage: z.number(),
    items: z.array(blogListEntitySchema).min(0)
});

export type blogListResponseType = z.infer<typeof blogListResponseSchema>;
