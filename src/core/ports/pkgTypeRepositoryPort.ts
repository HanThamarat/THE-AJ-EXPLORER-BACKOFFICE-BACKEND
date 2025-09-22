import { packageTypeDTO, packageTypeEntity } from "../entity/packageType";

export interface PkgTypeRepositoryPort {
    createPkgType(pkgTypeDTO: packageTypeDTO): Promise<packageTypeEntity>;
    findPkgTypes(): Promise<packageTypeEntity[]>;
    findPkgTypeByid(id: string): Promise<packageTypeEntity>;
    updatePkgType(id: string, pkgTypeDTO: packageTypeDTO): Promise<packageTypeEntity>;
    deletePkgType(id: string): Promise<packageTypeEntity>;
}