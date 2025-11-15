import { packageDTO, packageEntity } from "../entity/package";
import { Request } from "express";

export interface PackageRepositoryPort {
    createPacakge(packageDto: packageDTO): Promise<packageEntity>;
    findPackage(): Promise<packageEntity[]>;
    findPackageById(id: string, req: Request): Promise<packageEntity>;
    updatePackage(id: string, packageDto: packageDTO, req: Request): Promise<packageEntity>
    deletePackage(id: string): Promise<packageEntity>;
}