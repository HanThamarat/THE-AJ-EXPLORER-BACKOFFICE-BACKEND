import { packageEntity } from "./package";
import { Request } from "express";

export interface findPackageByProviuceEntity {
    provinceId:         number;
    provinceName:       string;
    pakcages:           packageEntity[]
}

interface ShotpackageEntity {
    packageId:          number;
    packageName:        string;
}

export interface findProvinceByPackageEntity {
    provinceId:         number;
    provinceName:       string;
    packages:           ShotpackageEntity[];
}

export interface packageImageSave {
    file_name:          string;
    file_original_name: string;
    file_path:          string;
    mainFile:           boolean;
    base64?:            string | null;
}

export interface packageSearchParams {
    req:                Request;
    provinceId?:        number;
    packageName?:       string;
    page:               number;
    limit:              number;
}

export interface packageClientResponse {
    page:               number;
    limit:              number;
    total:              number;
    totalPage:          number;
    nextPage:           number;
    prevPage:           number;
    items:              packageListEntity[] | [];
}

export interface packageListEntity {
    packageId:          number;
    packageName:        string;
    province:           string;
    fromAmount:         number;
    promoAmount?:       number;
    starAvg:            number;
    reviewQty:          number;
    packageImage:       packageImageSave[] | [];
}