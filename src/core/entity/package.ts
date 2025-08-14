
export interface packageDTO {
    packageName:        string;
    packageTypeId:      number;
    description:        string;
    provinceId:         number;
    districtId:         number;
    subDistrictId:      number;
    lon:                string;
    lat:                string;
    status:             boolean;
    packageImage:       string;
    packageOption:      packageOptionDTO[];
    created_by?:         number;
    updated_by?:         number;
}

export interface packageOptionDTO {
    packageId:          number;
    pkgOptionTypeId:    number;
    name:               string;
    description:        string;
    adultPrice?:        number;
    childPrice?:        number;
    groupPrice?:        number;
}


export interface packageEntity {
    id:                 number;
    packageName:        string;
    packageType:        string;
    description:        string;
    province:           string;
    district:           string;
    subDistrict:        string;
    lon:                string;
    lat:                string;
    packageImage:       string;
    packageOption:      packageOptionEntity[] | null;
    status:             boolean | string;
    created_by:         string;
    updated_by:         string;
    created_at:         Date | string;
    updated_at:         Date | string;
}

export interface packageOptionEntity {
    id:                 number;
    packageId:          number;
    pkgOptionType:      string;
    name:               string;
    description:        string;
    adultPrice?:        number;
    childPrice?:        number;
    groupPrice?:        number;
    created_at?:         Date;
    updated_at?:         Date;
}