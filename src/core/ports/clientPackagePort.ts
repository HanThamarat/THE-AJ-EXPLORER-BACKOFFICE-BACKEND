import { findProvinceByPackageEntity } from "../entity/clientPackage";

export interface ClientPacakgeRepositoryPort {
    findProvinceByPackage(): Promise<findProvinceByPackageEntity>;
}