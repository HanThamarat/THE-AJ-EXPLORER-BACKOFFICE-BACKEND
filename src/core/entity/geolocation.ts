import { Prisma } from "@prisma/client";
import { z } from "zod";

export const subDistrictEntitySchema = z.object({
    id: z.number().int(),
    code: z.number().int(),
    nameTH: z.string(),
    nameEN: z.string(),
});

export type subDistrictEntity = z.infer<typeof subDistrictEntitySchema>;

export const districtEntitySchema = z.object({
    id: z.number().int(),
    code: z.number().int(),
    nameTH: z.string(),
    nameEN: z.string(),
    subDistrict: z.array(subDistrictEntitySchema),
});

export type districtEntity = z.infer<typeof districtEntitySchema>;

export const provinceEntirySchema = z.object({
    id: z.number().int(),
    code: z.number().int(),
    nameTH: z.string(),
    nameEN: z.string(),
    district: z.array(districtEntitySchema),
});

export type provinceEntiry = z.infer<typeof provinceEntirySchema>;

export type provinceRelational = Prisma.provinceGetPayload<{
    select: {
        id: true,
        code: true,
        nameEn: true,
        nameTh: true,
    }
}>;

export type districtByProidEntity = Prisma.districtGetPayload<{
    select: {
        id: true,
        code: true,
        nameEn: true,
        nameTh: true,
        subdistricts: {
            select: {
                id: true,
                code: true,
                nameEn: true,
                nameTh: true,
            }
        }
    }
}>;

export const geolocationIdParamSchema = z.object({
    id: z.string().regex(/^\d+$/, "Geolocation id must be numeric."),
});

export type GeolocationIdParams = z.infer<typeof geolocationIdParamSchema>;