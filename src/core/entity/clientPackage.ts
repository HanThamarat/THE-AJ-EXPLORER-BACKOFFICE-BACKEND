import { Request } from "express";
import { z } from "zod";
import { packageEntitySchema, packageImageSaveSchema } from "./package";

const shotPackageEntitySchema = z.object({
    packageId: z.number().int(),
    packageName: z.string(),
});

export const findPackageByProviuceEntitySchema = z.object({
    provinceId: z.number().int(),
    provinceName: z.string(),
    pakcages: z.array(packageEntitySchema),
});

export type findPackageByProviuceEntity = z.infer<typeof findPackageByProviuceEntitySchema>;

export const findProvinceByPackageEntitySchema = z.object({
    provinceId: z.number().int(),
    provinceName: z.string(),
    packages: z.array(shotPackageEntitySchema),
});

export type findProvinceByPackageEntity = z.infer<typeof findProvinceByPackageEntitySchema>;

export type packageImageSave = z.infer<typeof packageImageSaveSchema>;

export const packageSearchQuerySchema = z.object({
    provinceId: z.coerce.number().int().optional(),
    packageName: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).default(10),
});

export type PackageSearchQuery = z.infer<typeof packageSearchQuerySchema>;

export type packageSearchParams = PackageSearchQuery & {
    req: Request;
};

export const packageListEntitySchema = z.object({
    packageId: z.number().int(),
    packageName: z.string(),
    packageDes: z.string(),
    province: z.string(),
    fromAmount: z.number(),
    promoAmount: z.number().optional(),
    starAvg: z.number(),
    reviewQty: z.number().int(),
    packageImage: z.array(packageImageSaveSchema),
});

export type packageListEntity = z.infer<typeof packageListEntitySchema>;

export const packageClientResponseSchema = z.object({
    page: z.number().int(),
    limit: z.number().int(),
    total: z.number().int(),
    totalPage: z.number().int(),
    nextPage: z.number().int(),
    prevPage: z.number().int(),
    items: z.array(packageListEntitySchema),
});

export type packageClientResponse = z.infer<typeof packageClientResponseSchema>;