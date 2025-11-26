import { z } from "zod";

export const roleSchema = z.object({
    id: z.number().int(),
    name: z.string().nullable(),
});

export type role = z.infer<typeof roleSchema>;

export const userEntitySchema = z.object({
    id: z.number().int().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    roleId: z.number().int().optional(),
    role: roleSchema.optional(),
    created_at: z.union([z.date(), z.string()]).optional(),
    updated_at: z.union([z.date(), z.string()]).optional(),
});

export type userEntity = z.infer<typeof userEntitySchema>;

export const userDTOSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    currentPassword: z.string().optional(),
    roleId: z.number().int().optional(),
});

export type userDTO = z.infer<typeof userDTOSchema>;

export const userCreateBodySchema = z.object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email(),
    username: z.string().min(1),
    password: z.string().min(6),
    roleId: z.coerce.number().int(),
});

export type UserCreateBody = z.infer<typeof userCreateBodySchema>;

export const userUpdateBodySchema = userDTOSchema.extend({
    roleId: z.coerce.number().int().optional(),
});

export type UserUpdateBody = z.infer<typeof userUpdateBodySchema>;

export const userIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "User id must be numeric."),
});

export type UserIdParams = z.infer<typeof userIdParamSchema>;
