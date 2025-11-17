import { findProvinceByPackageEntity, packageClientResponse, packageSearchParams } from "../entity/clientPackage";
import { ClientPacakgeRepositoryPort } from "../ports/clientPackagePort";

export class ClientPackageService {
    constructor(private readonly clientPacakgeRepositoryPort: ClientPacakgeRepositoryPort) {}

    findProvinceByPackage(): Promise<findProvinceByPackageEntity> {
        return this.clientPacakgeRepositoryPort.findProvinceByPackage();
    }
    
    findBySearch(params: packageSearchParams): Promise<packageClientResponse> {
        return this.clientPacakgeRepositoryPort.findBySearch(params);
    }
}