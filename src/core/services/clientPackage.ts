import { Request } from "express";
import { findProvinceByPackageEntity, packageClientResponse, packageSearchParams } from "../entity/clientPackage";
import { packageEntity } from "../entity/package";
import { ClientPacakgeRepositoryPort } from "../ports/clientPackagePort";

export class ClientPackageService {
    constructor(private readonly clientPacakgeRepositoryPort: ClientPacakgeRepositoryPort) {}

    async findProvinceByPackage(): Promise<findProvinceByPackageEntity> {
        return this.clientPacakgeRepositoryPort.findProvinceByPackage();
    }
    
    async findBySearch(params: packageSearchParams): Promise<packageClientResponse> {
        return this.clientPacakgeRepositoryPort.findBySearch(params);
    }

    async findPackageDetail(id: number): Promise<packageEntity> {
        return this.clientPacakgeRepositoryPort.findPackageDetail(id);
    }
}