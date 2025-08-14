import { PackageRepositoryPort } from "../ports/packageRepositoryPort";
import { packageDTO, packageEntity } from "../entity/package";

export class PackageService {
    constructor(private readonly packageRepository: PackageRepositoryPort) {}

    async createPackage(packageDto: packageDTO): Promise<packageEntity> {
        return this.packageRepository.createPacakge(packageDto);
    }

    async findPackage(): Promise<packageEntity[]> {
        return this.packageRepository.findPackage();
    }

    async findPackageById(id: string): Promise<packageEntity> {
        return this.packageRepository.findPackageById(id);
    }

    async updatePackage(id: string, packageDto: packageDTO): Promise<packageEntity> {
        return this.packageRepository.updatePackage(id, packageDto);
    }

    async deletePackage(id: string): Promise<packageEntity> {
        return this.packageRepository.deletePackage(id);
    }
}