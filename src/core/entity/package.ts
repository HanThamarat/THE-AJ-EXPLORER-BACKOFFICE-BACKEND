import { z } from "zod";

export const packageImageDTOSchema = z.object({
    base64: z.string(),
    fileName: z.string(),
    mainFile: z.boolean(),
});

export type packageImageDTO = z.infer<typeof packageImageDTOSchema>;

export const packageOptionDTOSchema = z.object({
    packageId: z.coerce.number().int(),
    pkgOptionTypeId: z.coerce.number().int(),
    name: z.string(),
    description: z.string(),
    adultFromAge: z.string().optional(),
    adultToAge: z.string().optional(),
    childFromAge: z.string().optional(),
    childToAge: z.string().optional(),
    groupFromAge: z.string().optional(),
    groupToAge: z.string().optional(),
    adultPrice: z.coerce.number().optional(),
    childPrice: z.coerce.number().optional(),
    groupPrice: z.coerce.number().optional(),
});

export type packageOptionDTO = z.infer<typeof packageOptionDTOSchema>;

export const packageAttractionDTOSchema = z.object({
    packageId: z.coerce.number().int().optional(),
    attractionName: z.string(),
    attractionTime: z.union([z.date(), z.string()]),
    description: z.string().optional(),
    status: z.boolean(),
});

export type packageAttractionDTO = z.infer<typeof packageAttractionDTOSchema>;

export const packageIncludeSchema = z.object({
    detail: z.string(),
});

export type packageInclude = z.infer<typeof packageIncludeSchema>;

export const packageNotIncludeSchema = z.object({
    detail: z.string(),
});

export type packageNotInclude = z.infer<typeof packageNotIncludeSchema>;

export const packageImageSaveSchema = z.object({
    file_name: z.string(),
    file_original_name: z.string(),
    file_path: z.string(),
    mainFile: z.boolean(),
    base64: z.string().nullable().optional(),
});

export type packageImageSave = z.infer<typeof packageImageSaveSchema>;

export const packageOptionEntitySchema = z.object({
    id: z.number().int(),
    packageId: z.number().int(),
    pkgOptionTypeId: z.number().int().optional(),
    pkgOptionType: z.string(),
    name: z.string(),
    description: z.string(),
    adultFromAge: z.string().optional(),
    adultToAge: z.string().optional(),
    childFromAge: z.string().optional(),
    childToAge: z.string().optional(),
    groupFromAge: z.string().optional(),
    groupToAge: z.string().optional(),
    adultPrice: z.number().optional(),
    childPrice: z.number().optional(),
    groupPrice: z.number().optional(),
    created_at: z.union([z.date(), z.string()]).optional(),
    updated_at: z.union([z.date(), z.string()]).optional(),
});

export type packageOptionEntity = z.infer<typeof packageOptionEntitySchema>;

export const packageAttractionEntitySchema = z.object({
    attractionName: z.string(),
    attractionTime: z.union([z.date(), z.string()]),
    description: z.string().optional(),
    status: z.boolean(),
});

export type packageAttractionEntity = z.infer<typeof packageAttractionEntitySchema>;

export const packageRequestSchema = z.object({
    packageName: z.string(),
    packageTypeId: z.coerce.number().int(),
    description: z.string().optional(),
    additional_description: z.string().optional(),
    provinceId: z.coerce.number().int(),
    districtId: z.coerce.number().int(),
    subDistrictId: z.coerce.number().int(),
    depart_point_lon: z.string(),
    depart_point_lat: z.string(),
    end_point_lon: z.string(),
    end_point_lat: z.string(),
    status: z.boolean(),
    packageImage: z.array(packageImageDTOSchema),
    packageOption: z.array(packageOptionDTOSchema),
    benefit_include: z.array(packageIncludeSchema),
    benefit_not_include: z.array(packageNotIncludeSchema),
    attraction: z.array(packageAttractionDTOSchema),
});

export type PackageRequestBody = z.infer<typeof packageRequestSchema>;

export const packageUpdateRequestSchema = packageRequestSchema;
export type PackageUpdateRequestBody = z.infer<typeof packageUpdateRequestSchema>;

export const packageEntitySchema = z.object({
    id: z.number().int(),
    packageName: z.string(),
    packageTypeId: z.number().int().optional(),
    packageType: z.string(),
    description: z.string().optional(),
    additional_description: z.string().optional(),
    province: z.string(),
    provinceId: z.number().int().optional(),
    district: z.string(),
    districtId: z.number().int().optional(),
    subDistrict: z.string(),
    subDistrictId: z.number().int().optional(),
    packageImage: z.array(packageImageSaveSchema),
    depart_point_lon: z.string(),
    depart_point_lat: z.string(),
    end_point_lon: z.string(),
    end_point_lat: z.string(),
    benefit_include: z.array(packageIncludeSchema).nullable(),
    benefit_not_include: z.array(packageNotIncludeSchema).nullable(),
    packageOption: z.array(packageOptionEntitySchema).nullable(),
    pakcageAttraction: z.array(packageAttractionEntitySchema).nullable(),
    status: z.union([z.boolean(), z.string()]),
    created_by: z.string(),
    updated_by: z.string(),
    created_at: z.union([z.date(), z.string()]),
    updated_at: z.union([z.date(), z.string()]),
});

export type packageEntity = z.infer<typeof packageEntitySchema>;

export const packageDTOSchema = z.object({
    packageName: z.string(),
    packageTypeId: z.coerce.number().int(),
    description: z.string().optional(),
    additional_description: z.string().optional(),
    provinceId: z.coerce.number().int(),
    districtId: z.coerce.number().int(),
    subDistrictId: z.coerce.number().int(),
    depart_point_lon: z.string(),
    depart_point_lat: z.string(),
    end_point_lon: z.string(),
    end_point_lat: z.string(),
    benefit_include: z.string(),
    benefit_not_include: z.string(),
    status: z.boolean(),
    packageImage: z.string(),
    packageOption: z.array(packageOptionDTOSchema),
    packageAttraction: z.array(packageAttractionDTOSchema),
    created_by: z.coerce.number().int().optional(),
    updated_by: z.coerce.number().int().optional(),
});

export type packageDTO = z.infer<typeof packageDTOSchema>;

export const packageIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "Package id must be numeric."),
});

export type PackageIdParams = z.infer<typeof packageIdParamSchema>;