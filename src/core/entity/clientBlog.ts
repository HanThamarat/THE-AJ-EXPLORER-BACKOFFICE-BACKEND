import z from "zod"
import { imageEntitySchema } from "../../types/image";

export const blogListEntitySchema = z.object({
    id: z.number(),
    blogName: z.string(),
    blogType: z.string(),
    viewer: z.number(),
    thumnbnail: imageEntitySchema,
    created_at: z.union([z.string(), z.date()]),
    created_by: z.string()
});

export type blogListEntityType = z.infer<typeof blogListEntitySchema>;