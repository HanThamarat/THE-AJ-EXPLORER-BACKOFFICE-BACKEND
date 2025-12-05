import { Request } from "express";
import { findProvinceByPackageEntity, packageClientResponse, packageSearchParams } from "../entity/clientPackage";
import { packageEntity } from "../entity/package";

export interface ClientPacakgeRepositoryPort {
    findProvinceByPackage(): Promise<findProvinceByPackageEntity>;
    findBySearch(params: packageSearchParams): Promise<packageClientResponse>;
    findPackageDetail(id: number): Promise<packageEntity>;
}