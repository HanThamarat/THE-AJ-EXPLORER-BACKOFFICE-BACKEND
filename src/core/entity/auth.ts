import { Prisma } from "@prisma/client";
import { z } from "zod";
import { userEntitySchema } from "./user";

export const authEntitySchema = z.object({
    userInfo: userEntitySchema,
    authToken: z.string(),
});

export type authEntity = z.infer<typeof authEntitySchema>;

export const authUserEntitySchema = z.object({
    id: z.number().int(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    username: z.string(),
    password: z.string().optional(),
    picture: z.string().nullable(),
    picturePath: z.string().nullable(),
    status: z.boolean(),
    roleId: z.number().int(),
    created_at: z.string(),
    updated_at: z.string(),
    iat: z.number().int(),
    exp: z.number().int(),
});

export type authUserEntity = z.infer<typeof authUserEntitySchema>;

export const googleProfileDTOSchema = z.object({
    email: z.string().email(),
    name: z.string(),
    images: z.string().optional(),
    googleId: z.string(),
});

export type googleProfileDTO = z.infer<typeof googleProfileDTOSchema>;

export const userCredentialDTOSchema = z.object({
    email: z.string().email(),
    name: z.string().optional(),
    passsword: z.string().min(6, "Password must have at least 6 characters."),
});

export type userCredentialDTO = z.infer<typeof userCredentialDTOSchema>;

export const localSigninSchema = z.object({
    username: z.string().min(1, "Username is required."),
    password: z.string().min(1, "Password is required."),
});

export type LocalSigninBody = z.infer<typeof localSigninSchema>;

export const googleSigninSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    picture: z.string().url().optional(),
    sub: z.string().min(1),
});

export type GoogleSigninBody = z.infer<typeof googleSigninSchema>;

export const createCustomerSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6),
});

export type CreateCustomerBody = z.infer<typeof createCustomerSchema>;

export const credentialSigninSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type CredentialSigninBody = z.infer<typeof credentialSigninSchema>;

export const customerEntitySchema = z.object({
    id: z.string(),
    name: z.string().nullable(),
    email: z.string().email(),
    emailVerified: z.date().nullable(),
    image: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    authToken: z.string().optional()
});

export type customerEntity = z.infer<typeof customerEntitySchema>;