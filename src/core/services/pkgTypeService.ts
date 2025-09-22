import { PkgTypeRepositoryPort } from "../ports/pkgTypeRepositoryPort";
import { packageTypeDTO, packageTypeEntity } from "../entity/packageType";

export class PkgTypeService {
    constructor(private readonly pkgTypeRepository: PkgTypeRepositoryPort) {}

    async createPkgType(pkgTypeDTO: packageTypeDTO): Promise<packageTypeEntity> {
        return this.pkgTypeRepository.createPkgType(pkgTypeDTO);
    }

    async findPkgTypes(): Promise<packageTypeEntity[]> {
        return this.pkgTypeRepository.findPkgTypes();
    }

    async findPkgTypeByid(id: string): Promise<packageTypeEntity> {
        return this.pkgTypeRepository.findPkgTypeByid(id);
    }

    async updatePkgType(id: string, pkgTypeDTO: packageTypeDTO): Promise<packageTypeEntity> {
        return this.pkgTypeRepository.updatePkgType(id, pkgTypeDTO);
    }

    async deletePkgType(id: string): Promise<packageTypeEntity> {
        return this.pkgTypeRepository.deletePkgType(id);
    }
}