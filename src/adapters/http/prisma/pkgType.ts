import { packageTypeDTO, packageTypeEntity } from "../../../core/entity/packageType";
import { PkgTypeRepositoryPort } from "../../../core/ports/pkgTypeRepositoryPort";
import { prisma } from "../../database/data-source";

export class PkgTypePrismaORM implements PkgTypeRepositoryPort {
    async createPkgType(pkgTypeDTO: packageTypeDTO): Promise<packageTypeEntity> {

        const recheckPackage = await prisma.packageType.findFirst({
            where: {
                name: {
                    mode: 'insensitive',
                    equals: pkgTypeDTO.name
                }
            }
        });

        if (recheckPackage) throw new Error("This package type name already existing."); 

        const createType = await prisma.packageType.create({
            data: {
                name: pkgTypeDTO.name,
                status: pkgTypeDTO.status,
                created_by: pkgTypeDTO.created_by,
                updated_by: pkgTypeDTO.updated_by,
            },
            select: {
                id: true,
                name: true,
                status: true,
                created_at: true,
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                updated_at: true,
                updatedBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!createType) throw new Error("Creating a package type something wrong!");

        const responseFormat: packageTypeEntity = {
            id: createType.id,
            name: createType?.name ? createType.name : "no data",
            status: createType?.status ? true : false,
            created_at: createType?.created_at ? createType.created_at : "no data",
            created_by: createType?.createdBy ? `${createType.createdBy?.firstName} ${createType.createdBy?.lastName}` : "no data",
            updated_at: createType?.updated_at ? createType.updated_at : "no data",
            updated_by: createType?.updatedBy ? `${createType.updatedBy?.firstName} ${createType.updatedBy?.lastName}` : "no data",
        }

        return responseFormat;
    }

    async findPkgTypes(): Promise<packageTypeEntity[]> {
        
        const result = await prisma.packageType.findMany({
            orderBy: {
                updated_at: 'desc'
            },
            where: {
                deleted_at: null
            },
            select: {
                id: true,
                name: true,
                status: true,
                created_at: true,
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                updated_at: true,
                updatedBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        const responseFormat: packageTypeEntity[] = result.map((data) => ({
            id: data.id,
            name: data?.name ? data.name : "no data",
            status: data?.status ? true : false,
            created_at: data?.created_at ? data.created_at : "no data",
            created_by: data?.createdBy ? `${data.createdBy?.firstName} ${data.createdBy?.lastName}` : "no data",
            updated_at: data?.updated_at ? data.updated_at : "no data",
            updated_by: data?.updatedBy ? `${data.updatedBy?.firstName} ${data.updatedBy?.lastName}` : "no data",
        }));

        return responseFormat;
    }

    async findPkgTypeByid(id: string): Promise<packageTypeEntity> {
        
        const result = await prisma.packageType.findFirst({
            where: {
                id: Number(id),
                deleted_at: null
            },
            select: {
                id: true,
                name: true,
                status: true,
                created_at: true,
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                updated_at: true,
                updatedBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!result) throw new Error("This package type id not found in the system.");

        const responseFormat: packageTypeEntity = {
            id: result.id,
            name: result?.name ? result.name : "no data",
            status: result?.status ? true : false,
            created_at: result?.created_at ? result.created_at : "no data",
            created_by: result?.createdBy ? `${result.createdBy?.firstName} ${result.createdBy?.lastName}` : "no data",
            updated_at: result?.updated_at ? result.updated_at : "no data",
            updated_by: result?.updatedBy ? `${result.updatedBy?.firstName} ${result.updatedBy?.lastName}` : "no data",
        }

        return responseFormat;
    }

    async updatePkgType(id: string, pkgTypeDTO: packageTypeDTO): Promise<packageTypeEntity> {

        const recheckPkgType = await prisma.packageType.count({
            where: {
                id: Number(id),
                deleted_at: null,
            }
        });
        
        if (!recheckPkgType) throw new Error("This package type id not found in the system.");

        const recheckPackage = await prisma.packageType.findFirst({
            where: {
                name: {
                    mode: 'insensitive',
                    equals: pkgTypeDTO.name
                },
                id: {
                    not: Number(id)
                }
            }
        });

        if (recheckPackage) throw new Error("This package type name already existing."); 

        const result = await prisma.packageType.update({
            where: {
                id: Number(id)
            },
            data: {
                name: pkgTypeDTO.name,
                status: pkgTypeDTO.status ? true : false,
                updated_by: pkgTypeDTO.updated_by
            },
            select: {
                id: true,
                name: true,
                status: true,
                created_at: true,
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                updated_at: true,
                updatedBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!result) throw new Error("Updating a package type failed");

        const responseFormat: packageTypeEntity = {
            id: result.id,
            name: result?.name ? result.name : "no data",
            status: result?.status ? true : false,
            created_at: result?.created_at ? result.created_at : "no data",
            created_by: result?.createdBy ? `${result.createdBy?.firstName} ${result.createdBy?.lastName}` : "no data",
            updated_at: result?.updated_at ? result.updated_at : "no data",
            updated_by: result?.updatedBy ? `${result.updatedBy?.firstName} ${result.updatedBy?.lastName}` : "no data",
        }

        return responseFormat;
    }

    async deletePkgType(id: string): Promise<packageTypeEntity> {
        const recheckPkgType = await prisma.packageType.count({
            where: {
                id: Number(id),
                deleted_at: null,
            }
        });
        
        if (!recheckPkgType) throw new Error("This package type id not found in the system.");

        const result = await prisma.packageType.update({
            where: {
                id: Number(id),
            },
            data: {
                deleted_at: new Date(),
            },
            select: {
                id: true,
                name: true,
                status: true,
                created_at: true,
                createdBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                updated_at: true,
                updatedBy: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });

        if (!result) throw new Error("Updating a package type failed");

        const responseFormat: packageTypeEntity = {
            id: result.id,
            name: result?.name ? result.name : "no data",
            status: result?.status ? true : false,
            created_at: result?.created_at ? result.created_at : "no data",
            created_by: result?.createdBy ? `${result.createdBy?.firstName} ${result.createdBy?.lastName}` : "no data",
            updated_at: result?.updated_at ? result.updated_at : "no data",
            updated_by: result?.updatedBy ? `${result.updatedBy?.firstName} ${result.updatedBy?.lastName}` : "no data",
        }

        return responseFormat;
    }
}