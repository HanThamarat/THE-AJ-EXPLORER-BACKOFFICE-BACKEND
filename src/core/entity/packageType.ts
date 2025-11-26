import { z } from "zod";

export const packageTypeDTOSchema = z.object({
    name: z.string(),
    status: z.boolean(),
    created_by: z.coerce.number().int(),
    updated_by: z.coerce.number().int(),
});

export type packageTypeDTO = z.infer<typeof packageTypeDTOSchema>;

export const packageTypeEntitySchema = z.object({
    id: z.number().int(),
    name: z.string(),
    status: z.boolean(),
    created_by: z.string(),
    created_at: z.union([z.date(), z.string()]),
    updated_by: z.string(),
    updated_at: z.union([z.date(), z.string()]),
});

export type packageTypeEntity = z.infer<typeof packageTypeEntitySchema>;

export const packageTypeBodySchema = z.object({
    name: z.string().min(1, "Package type name is required."),
    status: z.boolean(),
});

export type PackageTypeBody = z.infer<typeof packageTypeBodySchema>;

export const packageTypeIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "Package type id must be numeric."),
});

export type PackageTypeIdParams = z.infer<typeof packageTypeIdParamSchema>;