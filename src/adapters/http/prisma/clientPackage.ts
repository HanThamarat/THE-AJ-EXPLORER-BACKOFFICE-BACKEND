import { findProvinceByPackageEntity } from "../../../core/entity/clientPackage";
import { ClientPacakgeRepositoryPort } from "../../../core/ports/clientPackagePort";
import { prisma } from "../../database/data-source";

export class ClientPackageDataSource implements ClientPacakgeRepositoryPort {
    async findProvinceByPackage(): Promise<findProvinceByPackageEntity> {
        const result : any = prisma.$queryRaw`
            select p."nameEn" as provinceName, p."id" as provinceId,
                json_agg(
                    json_build_object(
                        'packageId', p2.id ,
                        'packageName', p2."packageName"
                    )
                ) as packages
            from province p inner join packages p2 on p.id = p2."provinceId" group by p.id
        `;

        return result as findProvinceByPackageEntity;
    }
}