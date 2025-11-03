import { packageEntity } from "./package";


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

