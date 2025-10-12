
export interface packageDTO {
    packageName:                string;
    packageTypeId:              number;
    description?:               string;
    additional_description?:    string;
    provinceId:                 number;
    districtId:                 number;
    subDistrictId:              number;
    depart_point_lon:           string;
    depart_point_lat:           string;
    end_point_lon:              string;
    end_point_lat:              string;
    benefit_include:            string;
    benefit_not_include:        string;
    status:                     boolean;
    packageImage:               string;
    packageOption:              packageOptionDTO[];
    packageAttraction:          packageAttractionDTO[];
    created_by?:                number;
    updated_by?:                number;
}

export interface packageAttractionDTO {
    packageId?:         number;
    attractionName:     string;
    attractionTime:     Date;
    description?:       string;
    status:             boolean;
}

export interface packageOptionDTO {
    packageId:          number;
    pkgOptionTypeId:    number;
    name:               string;
    description:        string;
    adultFromAge?:      string;
    adultToAge?:        string;
    childFromAge?:      string;
    childToAge?:        string;
    groupFromAge?:      string;
    groupToAge?:        string;
    adultPrice?:        number;
    childPrice?:        number;
    groupPrice?:        number;
}

export interface packageImageDTO {
    base64:             string;
    fileName:           string;
    mainFile:          boolean;               
}

export interface packageNotInclude {
    detail:      string;
}

export interface packageInclude {
    detail:      string;
}

export interface packageImageSave {
    file_name:          string;
    file_original_name: string;
    file_path:          string;
    mainFile:           boolean;
    base64?:            string | null;
}

export interface packageEntity {
    id:                         number;
    packageName:                string;
    packageType:                string;
    description?:               string;
    additional_description?:    string;
    province:                   string;
    district:                   string;
    subDistrict:                string;
    packageImage:               packageImageSave[] | [];
    depart_point_lon:           string;
    depart_point_lat:           string;
    end_point_lon:              string;
    end_point_lat:              string;
    benefit_include:            packageInclude[] | null;
    benefit_not_include:        packageNotInclude[] | null;
    packageOption:              packageOptionEntity[] | null;
    pakcageAttraction :         packageAttractionEntity[] | null; 
    status:                     boolean | string;
    created_by:                 string;
    updated_by:                 string;
    created_at:                 Date | string;
    updated_at:                 Date | string;
}

export interface packageAttractionEntity {
    attractionName:     string;
    attractionTime:     Date;
    description?:       string;
    status:             boolean;
}

export interface packageOptionEntity {
    id:                 number;
    packageId:          number;
    pkgOptionType:      string;
    name:               string;
    description:        string;
    adultFromAge?:      string;
    adultToAge?:        string;
    childFromAge?:      string;
    childToAge?:        string;
    groupFromAge?:      string;
    groupToAge?:        string;
    adultPrice?:        number;
    childPrice?:        number;
    groupPrice?:        number;
    created_at?:        Date;
    updated_at?:        Date;
}