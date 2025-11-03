import { findProvinceByPackageEntity } from "../entity/clientPackage";
import { ClientPacakgeRepositoryPort } from "../ports/clientPackagePort";

export class ClientPackageService {
    constructor(private readonly clientPacakgeRepositoryPort: ClientPacakgeRepositoryPort) {}

    findProvinceByPackage(): Promise<findProvinceByPackageEntity> {
        return this.clientPacakgeRepositoryPort.findProvinceByPackage();
    }
}