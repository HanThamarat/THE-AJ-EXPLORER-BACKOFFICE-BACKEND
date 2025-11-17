import { findProvinceByPackageEntity, packageClientResponse, packageSearchParams } from "../entity/clientPackage";

export interface ClientPacakgeRepositoryPort {
    findProvinceByPackage(): Promise<findProvinceByPackageEntity>;
    findBySearch(params: packageSearchParams): Promise<packageClientResponse>;
}