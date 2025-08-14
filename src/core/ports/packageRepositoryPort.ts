import { packageDTO, packageEntity } from "../entity/package"

export interface PackageRepositoryPort {
    createPacakge(packageDto: packageDTO): Promise<packageEntity>;
    findPackage(): Promise<packageEntity[]>;
    findPackageById(id: string): Promise<packageEntity>;
    updatePackage(id: string, packageDto: packageDTO): Promise<packageEntity>
    deletePackage(id: string): Promise<packageEntity>;
}