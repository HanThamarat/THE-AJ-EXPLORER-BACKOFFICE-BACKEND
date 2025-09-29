import { Prisma } from "@prisma/client";

export interface provinceEntiry {
    id:        number;
    code:      number;
    nameTH:    string;
    nameEN:    string;
    district:  districtEntity[];
}

export interface districtEntity {
    id:        number;
    code:      number;
    nameTH:    string;
    nameEN:    string;
    subDistrict: subDistrictEntity[]
}

export interface subDistrictEntity {
    id:        number;
    code:      number;
    nameTH:    string;
    nameEN:    string;
}

export type provinceRelational = Prisma.provinceGetPayload<{
    select: {
        id: true,
        code: true,
        nameEn: true,
        nameTh: true,
    }
}>

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
}>