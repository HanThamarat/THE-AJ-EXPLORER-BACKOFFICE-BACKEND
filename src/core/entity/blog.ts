import { Request } from "express";
import { z } from "zod";
import { imageDTOSchema, imageEntitySchema, imageDTO, imageEntity } from "../../types/image";

const blogPayloadSchema = z.object({
    title: z.string().trim().min(1, "Blog title is required."),
    blogType: z.coerce.number().int().positive("Blog type must be a valid id."),
    thumnbnail: imageDTOSchema,
    descrition: z.string().trim().min(1, "Blog description is required."),
    status: z.coerce.boolean(),
});

export const blogCreateBodySchema = blogPayloadSchema;
export const blogUpdateBodySchema = blogPayloadSchema;

export const blogDTOSchema = blogPayloadSchema.extend({
    created_by: z.coerce.number().int(),
    updated_by: z.coerce.number().int(),
});

export type BlogCreateBody = z.infer<typeof blogCreateBodySchema>;
export type BlogUpdateBody = z.infer<typeof blogUpdateBodySchema>;
type BlogDTOBase = z.infer<typeof blogDTOSchema>;

export type blogDTO = BlogDTOBase & {
    req: Request;
};

export const blogEntitySchema = z.object({
    id: z.number().int(),
    title: z.string(),
    blogtype_id: z.number().int().optional(),
    blogtype: z.string(),
    thumnbnail: z.union([imageEntitySchema, z.string()]),
    descrition: z.string(),
    status: z.union([z.boolean(), z.string()]),
    created_by: z.string(),
    created_at: z.union([z.date(), z.string()]),
    updated_by: z.string(),
    updated_at: z.union([z.date(), z.string()]),
});

export type blogEntity = z.infer<typeof blogEntitySchema>;

export const blogTypeEntitySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    created_at: z.union([z.date(), z.string()]).optional(),
    updated_at: z.union([z.date(), z.string()]).optional(),
});

export type blogTypeEntity = z.infer<typeof blogTypeEntitySchema>;

export const blogIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "Blog id must be numeric."),
});

export type BlogIdParams = z.infer<typeof blogIdParamSchema>;
